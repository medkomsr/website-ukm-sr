"""Verify all expected awards and their competition level in the returned HTML."""
import sys
from html.parser import HTMLParser
from urllib.request import urlopen

class ArchiveRows(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active = None
        self.rows = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "button" and "data-result" in attrs:
            self.active = attrs["aria-label"].removeprefix("Lihat prestasi: ")
            self.rows[self.active] = []

    def handle_endtag(self, tag):
        if tag == "button":
            self.active = None

    def handle_data(self, data):
        if self.active and data.strip():
            self.rows[self.active].append(data.strip())

expected = {
    "MYCC – MSQ": "Juara 1",
    "MYCC – MTQ": "Juara 2",
    "MUFI – MTQ": "Juara 1",
    "GBQN UB – MSQ": "Juara 2",
    "GSRA UNAIR – Banjari": "Juara 1",
    "Ma’had Al-Jami’ah UIN Syekh Washil Kediri – MSQ": "Juara 2",
    "MTQ UB – MSQ": "Juara 1",
    "Gebyar Tafsir ISQI – MSQ": "Juara 1",
    "UIN Ponorogo – MSQ": "Juara Harapan 2",
}
html = urlopen(sys.argv[1] + "/prestasi", timeout=30).read().decode("utf-8")
archive = ArchiveRows()
archive.feed(html)
for title, place in expected.items():
    assert title in archive.rows, f"missing award: {title}"
    fields = archive.rows[title]
    assert all(x in fields for x in ("2026", "-", place)), title
print(f"Verified {len(expected)} archive entries, their respective awards, year 2026, and dash in rendered HTML")
