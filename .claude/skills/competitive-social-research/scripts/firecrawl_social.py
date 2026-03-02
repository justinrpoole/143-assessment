#!/usr/bin/env python3
"""
Firecrawl batch scraper for competitor social research.

Usage examples:
  python3 scripts/firecrawl_social.py --competitor "Acme Coaching" \
    --urls "https://facebook.com/acmecoaching" "https://instagram.com/acmecoaching"

  python3 scripts/firecrawl_social.py --competitor "Acme Coaching" \
    --file urls.txt --include-json --sleep 1
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path
from urllib import request, error

DEFAULT_FORMATS = ["markdown", "links"]

DEFAULT_JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "topics": {"type": "array", "items": {"type": "string"}},
        "content_pillars": {"type": "array", "items": {"type": "string"}},
        "hooks": {"type": "array", "items": {"type": "string"}},
        "offers": {"type": "array", "items": {"type": "string"}},
        "calls_to_action": {"type": "array", "items": {"type": "string"}},
        "proof_types": {"type": "array", "items": {"type": "string"}},
        "tools_mentioned": {"type": "array", "items": {"type": "string"}},
        "audience": {"type": "array", "items": {"type": "string"}},
        "research_mentions": {"type": "array", "items": {"type": "string"}},
        "post_types": {"type": "array", "items": {"type": "string"}},
        "cadence": {"type": "string"},
        "quotes": {"type": "array", "items": {"type": "string"}},
    },
    "required": [],
}


def slugify(value):
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "item"


def load_urls(args):
    urls = []
    if args.urls:
        urls.extend(args.urls)
    if args.file:
        try:
            with open(args.file, "r", encoding="utf-8") as handle:
                for line in handle:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        urls.append(line)
        except FileNotFoundError:
            print(f"[error] URL file not found: {args.file}")
            sys.exit(1)
    deduped = []
    seen = set()
    for url in urls:
        if url not in seen:
            deduped.append(url)
            seen.add(url)
    return deduped


def load_schema(path):
    if not path:
        return DEFAULT_JSON_SCHEMA
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def build_formats(args):
    if args.formats:
        formats = [item.strip() for item in args.formats.split(",") if item.strip()]
    else:
        formats = list(DEFAULT_FORMATS)
    if args.include_json:
        schema = load_schema(args.schema)
        formats.append({"type": "json", "schema": schema})
    return formats


def firecrawl_scrape(api_key, payload, timeout_seconds):
    endpoint = "https://api.firecrawl.dev/v2/scrape"
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    req = request.Request(endpoint, data=data, headers=headers)
    try:
        with request.urlopen(req, timeout=timeout_seconds) as resp:
            return json.load(resp)
    except error.HTTPError as http_err:
        try:
            body = http_err.read().decode("utf-8")
        except Exception:
            body = ""
        raise RuntimeError(f"HTTP {http_err.code}: {body}")
    except Exception as err:
        raise RuntimeError(str(err))


def write_json(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=True, indent=2)


def main():
    parser = argparse.ArgumentParser(description="Batch scrape competitor social URLs with Firecrawl.")
    parser.add_argument("--competitor", help="Competitor name (used for folder naming)")
    parser.add_argument("--urls", nargs="+", help="One or more URLs to scrape")
    parser.add_argument("--file", help="Path to a newline-separated URL list")
    parser.add_argument(
        "--out-dir",
        default="./06_Research_Library/Research_Dossiers/Competitor_Social",
        help="Base output directory",
    )
    parser.add_argument(
        "--formats",
        help="Comma-separated formats for Firecrawl (default: markdown,links)",
    )
    parser.add_argument(
        "--include-json",
        action="store_true",
        help="Include JSON extraction using a schema (default schema or --schema)",
    )
    parser.add_argument("--schema", help="Path to a JSON schema file for extraction")
    parser.add_argument(
        "--only-main-content",
        action="store_true",
        default=True,
        help="Tell Firecrawl to focus on main content (default: true)",
    )
    parser.add_argument(
        "--full-content",
        action="store_true",
        help="Disable onlyMainContent and request full page extraction",
    )
    parser.add_argument("--wait-for", type=int, default=0, help="Wait time in ms")
    parser.add_argument("--timeout", type=int, default=30000, help="Timeout in ms")
    parser.add_argument("--sleep", type=float, default=0.5, help="Seconds to sleep between calls")

    args = parser.parse_args()
    urls = load_urls(args)
    if not urls:
        print("[error] Provide --urls or --file with at least one URL.")
        sys.exit(1)

    api_key = os.getenv("FIRECRAWL_API_KEY") or os.getenv("FIRECRAWL_API_TOKEN")
    if not api_key:
        print("[error] Missing FIRECRAWL_API_KEY or FIRECRAWL_API_TOKEN in environment.")
        sys.exit(1)

    base_dir = Path(args.out_dir)
    competitor_slug = slugify(args.competitor) if args.competitor else None
    if competitor_slug:
        base_dir = base_dir / competitor_slug
    raw_dir = base_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    formats = build_formats(args)
    timeout_seconds = max(1, args.timeout / 1000)
    only_main_content = False if args.full_content else args.only_main_content

    sources_path = base_dir / "sources.jsonl"
    timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")

    for idx, url in enumerate(urls, start=1):
        payload = {
            "url": url,
            "formats": formats,
            "onlyMainContent": only_main_content,
            "waitFor": args.wait_for,
            "timeout": args.timeout,
        }
        try:
            result = firecrawl_scrape(api_key, payload, timeout_seconds)
            filename = f"{timestamp}_{idx:02d}_{slugify(url)}.json"
            output_path = raw_dir / filename
            write_json(output_path, result)
            with open(sources_path, "a", encoding="utf-8") as handle:
                record = {
                    "url": url,
                    "saved": str(output_path),
                    "timestamp": timestamp,
                }
                handle.write(json.dumps(record, ensure_ascii=True) + "\n")
            print(f"[ok] {url} -> {output_path}")
        except Exception as err:
            print(f"[error] {url}: {err}")
        if idx < len(urls):
            time.sleep(max(0, args.sleep))


if __name__ == "__main__":
    main()
