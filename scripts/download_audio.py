#!/usr/bin/env python3
"""단어 녹음(Wikimedia Commons / Lingua Libre, CC0) 내려받기와 검사. 표준 라이브러리만 쓴다.

    python3 scripts/download_audio.py --limit 1   # 수박 하나만 먼저
    python3 scripts/download_audio.py             # 전체
    python3 scripts/download_audio.py --check     # 내려받지 않고 있는 파일만 검사
    python3 scripts/download_audio.py --delay 5   # 파일 사이 5초 간격

목록: src/content/word-audio-sources.json  저장: public/audio/words/<file>
목록의 url(사용자가 준 Special:FilePath 링크)을 먼저 쓰고, 실패하면 Special:Redirect/file로 한 번 더 시도한다.
link가 '후보'인 단어(고양이·곰·당근)는 파일이 실제로 있는지부터 이 요청으로 확인된다. 없으면 실패로 기록 → 게임은 TTS.
link가 '없음'인 단어(공룡·가방: 404 확인)는 요청하지 않는다.
upload.wikimedia.org가 429(요청 제한)를 돌려주면 우회하지 않고 실패로 기록한다. 나중에 다시 실행하면 이미 받은 파일은 건너뛴다.
접근 제한·요청 제한은 우회하지 않는다: 실패하면 그 파일만 실패로 기록하고 다음으로 넘어간다.
"""
import argparse
import json
import pathlib
import struct
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = ROOT / "src/content/word-audio-sources.json"
OUT = ROOT / "public/audio/words"
REPORT = OUT / "download-report.json"
UA = "inwoo-hangul-robot/0.1 (children's Hangul game; https://github.com/trams-repus/learningkoreanrobot)"


def urls_for(s: dict) -> list[str]:
    """목록의 url(사용자가 준 Special:FilePath 링크)을 그대로 먼저 쓰고, 실패하면 Special:Redirect로 한 번 더.
    urllib은 HTTP 리다이렉트(upload.wikimedia.org 실제 파일)를 자동으로 따라간다 (curl -L과 같음)."""
    enc = urllib.parse.quote(s["commonsFile"], safe="")
    return [s["url"], f"https://commons.wikimedia.org/wiki/Special:Redirect/file/{enc}"]


def page_url(commons_file: str) -> str:
    return "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(commons_file, safe="")


def inspect_wav(data: bytes) -> dict:
    """RIFF/WAVE 헤더와 fmt·data 조각을 읽어 형식을 확인한다. 문제가 있으면 ValueError."""
    if len(data) < 44:
        raise ValueError(f"너무 작음 ({len(data)} 바이트)")
    head = data[:64].lower()
    if head.startswith(b"<!doctype") or head.startswith(b"<html"):
        raise ValueError("WAV가 아니라 HTML 페이지를 받음")
    if data[0:4] != b"RIFF" or data[8:12] != b"WAVE":
        raise ValueError(f"RIFF/WAVE 헤더 없음 (앞부분 {data[:12]!r})")
    pos, fmt, data_len = 12, None, None
    while pos + 8 <= len(data):
        cid, size = data[pos : pos + 4], struct.unpack("<I", data[pos + 4 : pos + 8])[0]
        if cid == b"fmt ":
            audio_format, channels, rate, _, _, bits = struct.unpack("<HHIIHH", data[pos + 8 : pos + 24])
            fmt = {"format": audio_format, "channels": channels, "sampleRate": rate, "bits": bits}
        elif cid == b"data":
            data_len = min(size, len(data) - pos - 8)
            break
        pos += 8 + size + (size & 1)
    if not fmt or data_len is None:
        raise ValueError("fmt 또는 data 조각 없음")
    bytes_per_sec = fmt["sampleRate"] * fmt["channels"] * max(1, fmt["bits"] // 8)
    fmt["seconds"] = round(data_len / bytes_per_sec, 2) if bytes_per_sec else None
    fmt["bytes"] = len(data)
    return fmt


def _valid_wav(data: bytes) -> bool:
    try:
        inspect_wav(data)
        return True
    except ValueError:
        return False


def fetch(url: str) -> bytes:
    """429(요청 제한)이면 서버가 알려 준 Retry-After(120초 이하)만큼 기다렸다가 한 번만 다시 요청한다.
    더 길게 기다리라고 하거나 두 번째도 429면 그 파일은 실패로 둔다 (다른 경로로 우회하지 않는다)."""
    for attempt in range(2):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=30) as res:
                if res.status != 200:
                    raise ValueError(f"HTTP {res.status}")
                return res.read()
        except urllib.error.HTTPError as e:
            wait = e.headers.get("Retry-After", "")
            if e.code == 429 and attempt == 0 and wait.isdigit() and int(wait) <= 120:
                print(f"     429 요청 제한: 서버 안내대로 {wait}초 기다린 뒤 한 번 더", file=sys.stderr)
                time.sleep(int(wait))
                continue
            raise
    raise ValueError("요청 제한")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="앞에서부터 이 개수만")
    ap.add_argument("--check", action="store_true", help="내려받지 않고 있는 파일만 검사")
    ap.add_argument("--delay", type=float, default=0.5, help="파일 사이 간격(초)")
    args = ap.parse_args()

    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    if args.limit:
        sources = sources[: args.limit]
    OUT.mkdir(parents=True, exist_ok=True)
    report, ok = [], 0
    for s in sources:
        if s["link"].startswith("없음"):
            print(f"SKIP {s['word']}: {s['link']}")
            continue
        dest = OUT / s["file"]
        entry = {"word": s["word"], "file": s["file"], "commonsFile": s["commonsFile"], "link": s["link"], "page": page_url(s["commonsFile"]), "license": s["license"]}
        try:
            if args.check:
                if not dest.exists():
                    raise ValueError("파일 없음")
                data = dest.read_bytes()
            elif dest.exists() and _valid_wav(dest.read_bytes()):
                data = dest.read_bytes()  # 이미 받아 둔 정상 파일은 다시 요청하지 않는다
                entry["url"] = "(이미 있음)"
            else:
                data, errors = None, []
                for url in urls_for(s):
                    try:
                        data = fetch(url)
                        inspect_wav(data)
                        entry["url"] = url
                        break
                    except (urllib.error.URLError, ValueError, TimeoutError, OSError) as e:
                        errors.append(f"{url}: {e}")
                        data = None
                        time.sleep(1)  # 서버에 연달아 요청하지 않는다
                if data is None:
                    raise ValueError(" / ".join(errors))
                dest.write_bytes(data)
            entry["wav"] = inspect_wav(data)
            entry["status"] = "ok"
            ok += 1
            print(f"OK   {s['word']} → {dest.relative_to(ROOT)}  {entry['wav']}")
        except Exception as e:  # noqa: BLE001 - 파일 하나 실패가 전체를 멈추지 않게
            entry["status"] = "failed"
            entry["error"] = str(e)
            print(f"FAIL {s['word']}: {e}", file=sys.stderr)
        report.append(entry)
        if not args.check and entry.get("url") != "(이미 있음)":
            time.sleep(args.delay)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{ok}/{len(report)}개 성공. 보고: {REPORT.relative_to(ROOT)}")
    return 0 if ok == len(report) else 1


if __name__ == "__main__":
    sys.exit(main())
