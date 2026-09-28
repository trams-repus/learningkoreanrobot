"""게임 어휘(src/content/vocab.ts) 중 녹음 목록에 없는 단어의 Lingua Libre 한국어 녹음을 Commons에서 찾아 목록에 더한다.

download_audio.py가 받기 전에 부른다. 이 작업 환경은 Wikimedia가 요청 제한(429)을 걸어서 GitHub Actions에서 돈다.

- 찾는 파일: LL-Q9176_(kor)-<녹음자>-<단어>.wav (Lingua Libre 한국어). 이름이 정확히 '-<단어>.wav'로 끝나는 것만.
- 요청 수를 줄이려고 단어마다 검색하지 않고, allimages로 한국어 녹음 파일 이름을 500개씩 훑은 뒤 한꺼번에 맞춘다.
- 녹음자: 호로조를 먼저, 없으면 이 게임 단어를 가장 많이 녹음한 녹음자(목소리가 덜 바뀌게), 그다음 이름순.
- 라이선스·녹음자는 파일 정보(extmetadata)에서 읽어 목록에 적는다. 허용 라이선스(CC0, CC BY, CC BY-SA, 퍼블릭 도메인)가 아니면 쓰지 않는다.
- 못 찾은 단어는 목록에 '없음'으로 남긴다 → 게임은 그 단어만 기기 TTS.
"""
from __future__ import annotations

import datetime
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
PREFIX = "LL-Q9176_(kor)-"
PREFERRED_SPEAKER = "호로조"
ALLOWED_LICENSES = re.compile(r"^(CC0|CC[ -]BY(-SA)?( \d\.\d)?|Public domain)", re.I)


def vocab_words(vocab_ts: pathlib.Path) -> list[str]:
    """vocab.ts의 v('단어', ...) 목록 (순서 유지, 중복 제거)."""
    words = re.findall(r"\bv\('([^']+)'", vocab_ts.read_text(encoding="utf-8"))
    return list(dict.fromkeys(words))


def api_get(params: dict, ua: str) -> dict:
    params = {**params, "format": "json", "formatversion": "2", "maxlag": "5"}
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers={"User-Agent": ua})
    with urllib.request.urlopen(req, timeout=60) as res:
        data = json.load(res)
    if "error" in data:
        raise ValueError(f"Commons API 오류: {data['error']}")
    return data


def list_korean_recordings(ua: str, delay: float) -> list[str]:
    """Commons의 LL-Q9176_(kor)-로 시작하는 파일 이름 전체 (File: 없이)."""
    names, cont = [], {}
    while True:
        data = api_get({"action": "query", "list": "allimages", "aiprefix": PREFIX, "ailimit": "500", "aiprop": "", **cont}, ua)
        names += [img["name"].replace("_", " ") for img in data["query"]["allimages"]]
        if "continue" not in data:
            return names
        cont = {"aicontinue": data["continue"]["aicontinue"]}
        time.sleep(delay)


def split_name(name: str) -> tuple[str, str] | None:
    """'LL-Q9176 (kor)-녹음자-단어.wav' → (녹음자, 단어). 녹음자 이름에 '-'가 있을 수 있어 마지막 '-'로 나눈다."""
    base = name.replace(" ", "_")
    if not base.startswith(PREFIX) or not base.endswith(".wav"):
        return None
    rest = base[len(PREFIX) : -len(".wav")]
    if "-" not in rest:
        return None
    speaker, word = rest.rsplit("-", 1)
    return speaker.replace("_", " "), word.replace("_", " ")


def speaker_name(artist: str) -> str:
    """Lingua Libre의 Artist 값 'Speaker: X\nRecorder: Y'에서 녹음한 사람(X)만."""
    m = re.search(r"Speaker:\s*([^\n]+)", artist)
    return (m.group(1) if m else artist).strip()


def file_info(names: list[str], ua: str, delay: float) -> dict[str, dict]:
    """파일 이름 → {license, artist}. 한 번에 50개씩."""
    out = {}
    for i in range(0, len(names), 50):
        titles = "|".join("File:" + n for n in names[i : i + 50])
        data = api_get({"action": "query", "prop": "imageinfo", "iiprop": "extmetadata", "iiextmetadatafilter": "LicenseShortName|Artist", "titles": titles}, ua)
        for page in data["query"]["pages"]:
            meta = (page.get("imageinfo") or [{}])[0].get("extmetadata", {})
            name = page["title"].split(":", 1)[1]
            out[name.replace("_", " ")] = {
                "license": meta.get("LicenseShortName", {}).get("value", ""),
                "artist": re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "")).strip(),
            }
        time.sleep(delay)
    return out


# 파일 이름용 로마자 (국어의 로마자 표기법 자모 대응, 소리 변화는 반영하지 않는다). 파일 이름으로만 쓴다.
_INITIAL = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"]
_VOWEL = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"]
_FINAL = ["", "k", "k", "k", "n", "n", "n", "t", "l", "l", "l", "l", "l", "l", "l", "l", "m", "p", "p", "t", "t", "ng", "t", "t", "k", "t", "p", "t"]


def romanize(word: str) -> str:
    out = []
    for ch in word:
        code = ord(ch) - 0xAC00
        if 0 <= code < 11172:
            out.append(_INITIAL[code // 588] + _VOWEL[(code % 588) // 28] + _FINAL[code % 28])
        elif ch.isascii() and ch.isalnum():
            out.append(ch.lower())
    return "".join(out) or "word"


def _stale_missing(link: str, days: int = 7) -> bool:
    """'없음'으로 적힌 단어는 적은 날부터 days일이 지나면 다시 찾는다 (새 녹음이 올라올 수 있어서).
    날짜가 없거나 이전 규칙(호로조 이름만 확인)으로 적힌 '없음'은 바로 다시 찾는다."""
    if not link.startswith("없음"):
        return False
    m = re.search(r"(\d{4}-\d{2}-\d{2}) Commons에 Lingua Libre", link)
    return not m or (datetime.date.today() - datetime.date.fromisoformat(m.group(1))).days >= days


def discover(sources_path: pathlib.Path, vocab_ts: pathlib.Path, ua: str, delay: float = 1.0) -> list[str]:
    """목록에 녹음이 없는 어휘를 찾아 sources_path를 고쳐 쓴다. 바뀐 단어 목록을 돌려준다."""
    sources = json.loads(sources_path.read_text(encoding="utf-8"))
    by_word = {s["word"]: s for s in sources}
    changed = []
    # 라이선스를 '확인 전'으로 적어 둔 항목(같은 이름 규칙 후보로 받은 고양이·곰·당근)은 파일 정보로 확인해 채운다.
    unchecked = [s for s in sources if s.get("license") == "확인 전" and s.get("commonsFile")]
    if unchecked:
        info = file_info([s["commonsFile"].replace("_", " ") for s in unchecked], ua, delay)
        for s in unchecked:
            meta = info.get(s["commonsFile"].replace("_", " "))
            if meta and meta["license"]:
                s["license"] = meta["license"]
                s["speaker"] = speaker_name(meta["artist"]) or s["speaker"]
                s["link"] = f"같은 이름 규칙 후보 → 파일·라이선스 확인 ({datetime.date.today().isoformat()}, GitHub Actions)"
                changed.append(s["word"])
        print(f"확인: 라이선스 확인 전 {len(unchecked)}개 중 {len(changed)}개 채움")
    for s in sources:  # 이전 실행이 녹음자 칸에 'Speaker: X\nRecorder: Y'를 그대로 적은 것을 정리
        s["speaker"] = speaker_name(s["speaker"])
    words = vocab_words(vocab_ts)
    wanted = [w for w in words if w not in by_word or _stale_missing(by_word[w]["link"])]
    if not wanted:
        print("찾기: 모든 어휘가 이미 녹음 목록에 있음")
        sources_path.write_text(json.dumps(sources, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return changed

    names = list_korean_recordings(ua, delay)
    print(f"찾기: Commons 한국어 Lingua Libre 녹음 {len(names)}개, 목록에 없는 어휘 {len(wanted)}개")
    candidates: dict[str, list[tuple[str, str]]] = {}
    for n in names:
        parsed = split_name(n)
        if parsed and parsed[1] in wanted:
            candidates.setdefault(parsed[1], []).append((parsed[0], n))

    coverage: dict[str, int] = {}
    for opts in candidates.values():
        for speaker in {sp for sp, _ in opts}:
            coverage[speaker] = coverage.get(speaker, 0) + 1
    rank = lambda sp: (sp != PREFERRED_SPEAKER, -coverage.get(sp, 0), sp)  # noqa: E731

    ordered = {w: sorted(opts, key=lambda o: rank(o[0])) for w, opts in candidates.items()}
    info = file_info([n for opts in ordered.values() for _, n in opts], ua, delay)

    used_files = {s["file"] for s in sources}
    today = datetime.date.today().isoformat()
    for w in wanted:
        pick = next(((sp, n) for sp, n in ordered.get(w, []) if ALLOWED_LICENSES.match(info.get(n, {}).get("license", ""))), None)
        old = by_word.get(w)
        if pick is None:
            if old is None or old["link"].startswith("없음"):
                entry = {
                    "word": w,
                    "file": old["file"] if old else "",
                    "commonsFile": f"{PREFIX}*-{w}.wav",
                    "url": "",
                    "link": f"없음: {today} Commons에 Lingua Libre 한국어 녹음(허용 라이선스) 없음 → 기기 TTS",
                    "speaker": "",
                    "license": "",
                    "collection": "",
                }
                if old:
                    sources[sources.index(old)] = entry
                else:
                    sources.append(entry)
                by_word[w] = entry
                changed.append(w)
            continue
        speaker, name = pick
        commons_file = name.replace(" ", "_")
        file = old["file"] if old and old.get("file") else romanize(w) + ".wav"
        while file in used_files and not (old and old.get("file") == file):
            file = file[:-4] + "_2.wav"
        used_files.add(file)
        entry = {
            "word": w,
            "file": file,
            "commonsFile": commons_file,
            "url": "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(commons_file, safe="()_-"),
            "link": f"Commons API로 찾음 ({today}, GitHub Actions)",
            "speaker": speaker_name(info[name]["artist"]) or speaker,
            "license": info[name]["license"],
            "collection": "Lingua Libre (Wikimedia Commons)",
        }
        if old:
            sources[sources.index(old)] = entry
        else:
            sources.append(entry)
        by_word[w] = entry
        changed.append(w)

    sources_path.write_text(json.dumps(sources, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    found = sum(1 for w in wanted if not by_word[w]["link"].startswith("없음"))
    print(f"찾기: {found}/{len(wanted)}개 찾음, {len(wanted) - found}개 없음 (기기 TTS)")
    return changed
