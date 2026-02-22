#!/usr/bin/env python3
"""Extract key website requirements from a DOCX Copy Bible into Markdown."""

from __future__ import annotations

import argparse
import pathlib
import xml.etree.ElementTree as ET
import zipfile

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def read_paragraphs(docx_path: pathlib.Path) -> list[str]:
    with zipfile.ZipFile(docx_path) as zf:
        xml = zf.read("word/document.xml")
    root = ET.fromstring(xml)
    lines: list[str] = []
    for para in root.findall(".//w:p", NS):
        text = "".join((node.text or "") for node in para.findall(".//w:t", NS)).strip()
        if text:
            lines.append(text)
    return lines


def block(lines: list[str], needle: str, count: int) -> list[str]:
    lowered = [line.lower() for line in lines]
    try:
        index = lowered.index(needle.lower())
    except ValueError:
        return []
    return lines[index : index + count]


def render_markdown(lines: list[str], source: str) -> str:
    sitemap = block(lines, "Recommended Sitemap (7 Core Pages)", 12)
    nav = block(lines, "Navigation Structure", 8)
    tone = block(lines, "Tone Rules", 10)
    banned = block(lines, "Banned Words and Phrases", 12)
    glossary = block(lines, "Glossary (What We Call Things)", 14)
    home = block(lines, "PAGE 1: HOME", 16)
    assessment = block(lines, "PAGE 2: THE ASSESSMENT", 14)

    sections = [
        "# Extracted Copy Bible Requirements",
        "",
        f"Source: `{source}`",
        "",
        "## Recommended Sitemap",
        *[f"- {line}" for line in sitemap],
        "",
        "## Navigation",
        *[f"- {line}" for line in nav],
        "",
        "## Tone",
        *[f"- {line}" for line in tone],
        "",
        "## Banned Terms",
        *[f"- {line}" for line in banned],
        "",
        "## Glossary",
        *[f"- {line}" for line in glossary],
        "",
        "## Home Page Requirements",
        *[f"- {line}" for line in home],
        "",
        "## Assessment Page Requirements",
        *[f"- {line}" for line in assessment],
        "",
    ]
    return "\n".join(sections)


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract website copy bible requirements")
    parser.add_argument("--input", required=True, help="Path to input docx")
    parser.add_argument("--output", required=True, help="Path to output markdown")
    args = parser.parse_args()

    input_path = pathlib.Path(args.input).expanduser().resolve()
    output_path = pathlib.Path(args.output).expanduser().resolve()

    lines = read_paragraphs(input_path)
    markdown = render_markdown(lines, str(input_path))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(markdown, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
