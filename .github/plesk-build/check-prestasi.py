import json
import sys
from html.parser import HTMLParser
from urllib.request import urlopen


class ResultButtons(HTMLParser):
    def __init__(self):
        super().__init__()
        self.titles = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "button" and "data-result" in attrs:
            self.titles.append(attrs["aria-label"].removeprefix("Lihat prestasi: "))


base = sys.argv[1]
result = ResultButtons()
result.feed(urlopen(f"{base}/prestasi", timeout=30).read().decode("utf-8"))
batches = [json.load(urlopen(f"{base}/api/arsip/prestasi?page={page}&pageSize=9", timeout=30)) for page in [1, 2]]
total = batches[0]["total"]
assert total == 12 and all(batch["total"] == total and batch["pages"] == 2 for batch in batches), batches
first, second = ([item["title"] for item in batch["items"]] for batch in batches)
assert result.titles == first and len(first) == 9 and len(second) == 3 and len(set(first + second)) == total
assert "GBQN UB – MSQ" in first and "Gebyar Tafsir ISQI – MSQ" in first
print("Cold HTML and both JSON pages agree: 12 achievements, 9 + 3.", flush=True)
