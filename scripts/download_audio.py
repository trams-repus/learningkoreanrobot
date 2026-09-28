#!/usr/bin/env python3
"""단어 녹음(Wikimedia Commons / Lingua Libre, CC0) 내려받기와 검사. 표준 라이브러리만 쓴다.

    python3 scripts/download_audio.py --limit 1   # 수박 하나만 먼저
    python3 scripts/download_audio.py             # 전체
    python3 scripts/download_audio.py --check     # 내려받지 않고 있는 파일만 검사

목록: src/content/word-audio-sources.json  저장: public/audio/words/<file>
원본 주소(Special:Redirect/file)를 먼저 쓰고, 실패하면 Special:FilePath로 한 번 더 시도한다.
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


def urls_for(commons_file: str) -> list[str]:
    enc = urllib.parse.quote(commons_file, safe="")
    return [
        f"https://commons.wikimedia.org/wiki/Special:Redirect/file/{enc}",
        "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(commons_file, safe="()_-"),
    ]


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


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as res:
        if res.status != 200:
            raise ValueError(f"HTTP {res.status}")
        return res.read()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="앞에서부터 이 개수만")
    ap.add_argument("--check", action="store_true", help="내려받지 않고 있는 파일만 검사")
    args = ap.parse_args()

    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    if args.limit:
        sources = sources[: args.limit]
    OUT.mkdir(parents=True, exist_ok=True)
    report, ok = [], 0
    for s in sources:
        dest = OUT / s["file"]
        entry = {"word": s["word"], "file": s["file"], "commonsFile": s["commonsFile"], "page": page_url(s["commonsFile"]), "license": s["license"]}
        try:
            if args.check:
                if not dest.exists():
                    raise ValueError("파일 없음")
                data = dest.read_bytes()
            else:
                data, errors = None, []
                for url in urls_for(s["commonsFile"]):
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
        time.sleep(0.5)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{ok}/{len(sources)}개 성공. 보고: {REPORT.relative_to(ROOT)}")
    return 0 if ok == len(sources) else 1


if __name__ == "__main__":
    sys.exit(main())
