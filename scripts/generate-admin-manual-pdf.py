from __future__ import annotations

import html
import re
import shutil
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "panduan-admin-sanity.md"
OUTPUT = ROOT / "output" / "pdf" / "panduan-admin-sanity.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "panduan-admin-sanity.pdf"

GREEN = colors.HexColor("#165B42")
GREEN_DARK = colors.HexColor("#103D2D")
GREEN_PALE = colors.HexColor("#ECF5F0")
MAROON = colors.HexColor("#7B263D")
INK = colors.HexColor("#202A25")
MUTED = colors.HexColor("#5E6B64")
LINE = colors.HexColor("#CCD9D1")
PAPER = colors.HexColor("#FAFCFB")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Manual", r"C:\Windows\Fonts\arial.ttf"))
    pdfmetrics.registerFont(TTFont("Manual-Bold", r"C:\Windows\Fonts\arialbd.ttf"))
    pdfmetrics.registerFont(TTFont("Manual-Mono", r"C:\Windows\Fonts\consola.ttf"))


def inline_markup(text: str) -> str:
    escaped = html.escape(text.strip())
    escaped = re.sub(r"`([^`]+)`", r'<font name="Manual-Mono" color="#7B263D">\1</font>', escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", escaped)
    escaped = escaped.replace("  ", "<br/>")
    return escaped


def styles():
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "CoverTitle",
            parent=base["Title"],
            fontName="Manual-Bold",
            fontSize=29,
            leading=34,
            textColor=colors.white,
            alignment=TA_LEFT,
            spaceAfter=8,
        ),
        "cover_subtitle": ParagraphStyle(
            "CoverSubtitle",
            fontName="Manual",
            fontSize=13,
            leading=19,
            textColor=colors.HexColor("#DCEBE3"),
            alignment=TA_LEFT,
        ),
        "h2": ParagraphStyle(
            "H2",
            fontName="Manual-Bold",
            fontSize=18,
            leading=23,
            textColor=GREEN_DARK,
            spaceBefore=16,
            spaceAfter=8,
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "H3",
            fontName="Manual-Bold",
            fontSize=13,
            leading=17,
            textColor=MAROON,
            spaceBefore=8,
            spaceAfter=9,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body",
            fontName="Manual",
            fontSize=9.5,
            leading=14.2,
            textColor=INK,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName="Manual",
            fontSize=9.5,
            leading=14.2,
            textColor=INK,
            leftIndent=14,
            firstLineIndent=-9,
            bulletIndent=0,
            bulletFontName="Manual-Bold",
            bulletFontSize=8,
            bulletColor=GREEN,
            spaceAfter=4,
        ),
        "numbered": ParagraphStyle(
            "Numbered",
            parent=base["BodyText"],
            fontName="Manual",
            fontSize=9.5,
            leading=14.2,
            textColor=INK,
            leftIndent=17,
            firstLineIndent=-13,
            bulletIndent=0,
            bulletFontName="Manual-Bold",
            bulletFontSize=9,
            bulletColor=GREEN,
            spaceAfter=4,
        ),
        "small": ParagraphStyle(
            "Small",
            fontName="Manual",
            fontSize=8.2,
            leading=11.5,
            textColor=MUTED,
        ),
        "quote": ParagraphStyle(
            "Quote",
            fontName="Manual-Bold",
            fontSize=10,
            leading=15,
            textColor=GREEN_DARK,
            leftIndent=4,
            rightIndent=4,
        ),
        "table_header": ParagraphStyle(
            "TableHeader",
            fontName="Manual-Bold",
            fontSize=8.2,
            leading=10.5,
            textColor=colors.white,
        ),
        "table_body": ParagraphStyle(
            "TableBody",
            fontName="Manual",
            fontSize=7.9,
            leading=10.5,
            textColor=INK,
        ),
        "code": ParagraphStyle(
            "Code",
            fontName="Manual-Mono",
            fontSize=7.8,
            leading=10.5,
            textColor=INK,
        ),
    }


def draw_page(canvas, doc) -> None:
    page = canvas.getPageNumber()
    width, height = A4
    canvas.saveState()
    if page == 1:
        canvas.setFillColor(GREEN_DARK)
        canvas.rect(0, 0, width, height, stroke=0, fill=1)
        canvas.setFillColor(MAROON)
        canvas.rect(0, 0, 14 * mm, height, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#CFAE72"))
        canvas.circle(width - 32 * mm, 32 * mm, 16 * mm, stroke=0, fill=1)
    else:
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, width, height, stroke=0, fill=1)
        canvas.setStrokeColor(LINE)
        canvas.line(18 * mm, 15 * mm, width - 18 * mm, 15 * mm)
        canvas.setFont("Manual", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(18 * mm, 9.5 * mm, "Panduan Admin Sanity · Seni Religi UB")
        canvas.drawRightString(width - 18 * mm, 9.5 * mm, f"Halaman {page}")
    canvas.restoreState()


def table_from_rows(rows: list[list[str]], style_map: dict) -> Table:
    columns = max(len(row) for row in rows)
    if columns == 3:
        widths = [48 * mm, 57 * mm, 60 * mm]
    elif columns == 2:
        widths = [82.5 * mm, 82.5 * mm]
    else:
        widths = [165 * mm / columns] * columns

    normalized = []
    for row_index, row in enumerate(rows):
        cells = row + [""] * (columns - len(row))
        cell_style = style_map["table_header"] if row_index == 0 else style_map["table_body"]
        normalized.append([Paragraph(inline_markup(cell), cell_style) for cell in cells])

    table = Table(normalized, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), GREEN),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, GREEN_PALE]),
    ]))
    return table


def parse_markdown(source: str, style_map: dict):
    lines = source.splitlines()
    story = []
    index = 0

    while index < len(lines):
        line = lines[index].rstrip()
        stripped = line.strip()

        if not stripped:
            index += 1
            continue

        if stripped.startswith("# "):
            title = stripped[2:].strip()
            story.extend([
                Spacer(1, 57 * mm),
                Paragraph(title, style_map["cover_title"]),
                Spacer(1, 4 * mm),
                Paragraph("Manual operasional untuk admin nonteknis", style_map["cover_subtitle"]),
                Spacer(1, 68 * mm),
                Paragraph("Website Seni Religi Universitas Brawijaya", style_map["cover_subtitle"]),
                Paragraph("Versi 1.0 · September 2026", style_map["cover_subtitle"]),
                PageBreak(),
            ])
            index += 1
            while index < len(lines) and not lines[index].strip():
                index += 1
            if index < len(lines) and lines[index].strip().startswith("**Website Seni Religi"):
                index += 1
            if index < len(lines) and lines[index].strip().startswith("Versi 1.0"):
                index += 1
            continue

        if stripped.startswith("## "):
            story.append(Paragraph(inline_markup(stripped[3:]), style_map["h2"]))
            index += 1
            continue

        if stripped.startswith("### "):
            story.append(Paragraph(inline_markup(stripped[4:]), style_map["h3"]))
            index += 1
            continue

        if stripped.startswith("> "):
            note = Table(
                [[Paragraph(inline_markup(stripped[2:]), style_map["quote"])]],
                colWidths=[165 * mm],
            )
            note.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), GREEN_PALE),
                ("BOX", (0, 0), (-1, -1), 0.8, GREEN),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]))
            story.extend([note, Spacer(1, 5)])
            index += 1
            continue

        if stripped.startswith("```"):
            code_lines = []
            index += 1
            while index < len(lines) and not lines[index].strip().startswith("```"):
                code_lines.append(lines[index])
                index += 1
            index += 1
            code = Preformatted("\n".join(code_lines), style_map["code"])
            box = Table([[code]], colWidths=[165 * mm])
            box.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0F3F1")),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]))
            story.extend([box, Spacer(1, 5)])
            continue

        if stripped.startswith("|") and index + 1 < len(lines) and re.match(r"^\s*\|?[\s|:-]+\|?\s*$", lines[index + 1]):
            rows = []
            rows.append([cell.strip() for cell in stripped.strip("|").split("|")])
            index += 2
            while index < len(lines) and lines[index].strip().startswith("|"):
                rows.append([cell.strip() for cell in lines[index].strip().strip("|").split("|")])
                index += 1
            story.extend([table_from_rows(rows, style_map), Spacer(1, 7)])
            continue

        if re.match(r"^- \[[ xX]\] ", stripped) or stripped.startswith("- "):
            while index < len(lines):
                item = lines[index].strip()
                if not (re.match(r"^- \[[ xX]\] ", item) or item.startswith("- ")):
                    break
                if re.match(r"^- \[[ xX]\] ", item):
                    checked = item[3].lower() == "x"
                    label = ("[x] - " if checked else "[ ] - ") + item[6:]
                    bullet = ""
                else:
                    label = item[2:]
                    bullet = "•"
                story.append(Paragraph(inline_markup(label), style_map["bullet"], bulletText=bullet))
                index += 1
            continue

        if re.match(r"^\d+\. ", stripped):
            item_number = 1
            while index < len(lines) and re.match(r"^\d+\. ", lines[index].strip()):
                label = re.sub(r"^\d+\. ", "", lines[index].strip())
                story.append(Paragraph(
                    inline_markup(label),
                    style_map["numbered"],
                    bulletText=str(item_number),
                ))
                index += 1
                item_number += 1
            continue

        if stripped == "---":
            story.append(Spacer(1, 10))
            index += 1
            continue

        paragraph_lines = [stripped]
        index += 1
        while index < len(lines):
            candidate = lines[index].strip()
            if not candidate:
                break
            if (
                candidate.startswith("#")
                or candidate.startswith("> ")
                or candidate.startswith("|")
                or candidate.startswith("- ")
                or candidate.startswith("```")
                or re.match(r"^\d+\. ", candidate)
            ):
                break
            paragraph_lines.append(candidate)
            index += 1
        story.append(Paragraph(inline_markup(" ".join(paragraph_lines)), style_map["body"]))

    return story


def build_pdf() -> None:
    register_fonts()
    style_map = styles()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    document = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=22.5 * mm,
        leftMargin=22.5 * mm,
        topMargin=18 * mm,
        bottomMargin=22 * mm,
        title="Panduan Admin Sanity — Seni Religi UB",
        author="Seni Religi Universitas Brawijaya",
        subject="Manual pengelolaan konten Sanity Studio",
    )
    frame = Frame(document.leftMargin, document.bottomMargin, document.width, document.height, id="normal")
    document.addPageTemplates([PageTemplate(id="manual", frames=[frame], onPage=draw_page)])

    story = parse_markdown(SOURCE.read_text(encoding="utf-8"), style_map)
    document.build(story)
    shutil.copyfile(OUTPUT, PUBLIC_OUTPUT)

    print(f"Generated: {OUTPUT}")
    print(f"Public copy: {PUBLIC_OUTPUT}")


if __name__ == "__main__":
    build_pdf()
