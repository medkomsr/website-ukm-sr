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
    "MYCC \u2013 MSQ": "Juara 1",
    "MYCC \u2013 MTQ": "Juara 2",
    "MUFI \u2013 MTQ": "Juara 1",
    "GBQN UB \u2013 MSQ": "Juara 2",
    "GSRA UNAIR \u2013 Banjari": "Juara 1",
    "Ma\u2019had Al-Jami\u2019ah UIN Syekh Washil Kediri \u2013 MSQ": "Juara 2",
    "MTQ UB \u2013 MSQ": "Juara 1",
    "Gebyar Tafsir ISQI \u2013 MSQ": "Juara 1",
    "UIN Ponorogo \u2013 MSQ": "Juara Harapan 2",
}
html = urlopen(sys.argv[1] + "/prestasi", timeout=30).read().decode("utf-8")
archive = ArchiveRows()
archive.feed(html)

assert set(archive.rows) == set(expected), ("HTML titles", sorted(archive.rows))
for title, place in expected.items():
    level = "Kampus" if title == "MTQ UB – MSQ" else "Nasional"
    assert all(x in archive.rows[title] for x in ("2026", level, place)), (title, archive.rows[title])
print("Cold HTML verified: nine achievements, eight Nasional and one Kampus, with 2026 titles and placings.")
