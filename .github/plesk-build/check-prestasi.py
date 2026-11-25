"""Verify all expected awards and their competition level in the returned HTML."""
import sys
import json
import time
import subprocess
from urllib.parse import urlencode
from urllib.request import Request
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
    "MYCC â€“ MSQ": "Juara 1",
    "MYCC â€“ MTQ": "Juara 2",
    "MUFI â€“ MTQ": "Juara 1",
    "GBQN UB â€“ MSQ": "Juara 2",
    "GSRA UNAIR â€“ Banjari": "Juara 1",
    "Maâ€™had Al-Jamiâ€™ah UIN Syekh Washil Kediri â€“ MSQ": "Juara 2",
    "MTQ UB â€“ MSQ": "Juara 1",
    "Gebyar Tafsir ISQI â€“ MSQ": "Juara 1",
    "UIN Ponorogo â€“ MSQ": "Juara Harapan 2",
}
html = urlopen(sys.argv[1] + "/prestasi", timeout=30).read().decode("utf-8")
archive = ArchiveRows()
archive.feed(html)
print("First HTML load:", len(html), "bytes;", len(archive.rows), "archive buttons;", sorted(archive.rows), flush=True)
print("Page markers:", {key: html.count(key) for key in ["data-result", "prestasi-2026-", "MYCC", "Arsip belum", "Menyiapkan", "Arsip Prestasi"]}, flush=True)
endpoint = "https://yzaa35ug.api.sanity.io/v2024-01-01/data/query/production?"
source = json.load(urlopen(endpoint + urlencode({"query": 'count(*[_type == "prestasi" && year == 2026 && level == "-"])'}), timeout=30))["result"]
print("Public CMS count with 2026 and temporary level:", source, flush=True)
assert source == len(expected), source

# Exercise the rendered client view as a desktop visitor on the released Linux bundle.
from urllib.error import URLError
driver = subprocess.Popen(["chromedriver", "--port=9515", "--log-level=WARNING"], stdout=subprocess.DEVNULL)
url = "http://localhost:9515"
def command(path, payload=None):
    req = Request(url + path, data=None if payload is None else json.dumps(payload).encode(),
                  headers={"Content-Type": "application/json"})
    return json.load(urlopen(req, timeout=30))["value"]
try:
    for _ in range(40):
        try:
            if command("/status")["ready"]:
                break
        except URLError:
            time.sleep(.25)
    session = command("/session", {"capabilities": {"alwaysMatch": {"browserName": "chrome",
       "goog:chromeOptions": {"args":["--headless=new","--no-sandbox","--disable-dev-shm-usage","--window-size=1366,900"]},
       "goog:loggingPrefs":{"browser":"ALL"}}}})["sessionId"]
    prefix = "/session/" + session
    command(prefix + "/url", {"url": sys.argv[1] + "/prestasi"})
    for _ in range(30):
        html = command(prefix + "/source")
        archive = ArchiveRows()
        archive.feed(html)
        if set(expected) <= archive.rows.keys():
            break
        time.sleep(1)
    print("Hydrated visitor page:", len(archive.rows), "buttons;", sorted(archive.rows), flush=True)
    if set(expected) - archive.rows.keys():
        for entry in command(prefix + "/se/log", {"type":"browser"}):
            print("Browser message:", entry.get("message","")[:240])
        print("Visible words:", command(prefix + "/execute/sync", {"script":"return document.body.innerText","args":[]})[-1100:])
    command(prefix + "/url", {"url":"about:blank"})
finally:
    driver.terminate()
    driver.wait(timeout=10)
for title, place in expected.items():
    assert title in archive.rows, f"missing award: {title}"
    fields = archive.rows[title]
    assert all(x in fields for x in ("2026", "-", place)), title
print(f"Verified {len(expected)} archive entries, their respective awards, year 2026, and dash in rendered HTML")
