import { test } from "node:test";
import assert from "node:assert/strict";
import { companyVideoSource, videoTime } from "../features/home/lib/company-video.ts";

test("company video accepts supported YouTube URL formats", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=5pfoL7XtUzg&feature=shared",
    "https://youtu.be/5pfoL7XtUzg?si=example",
    "https://m.youtube.com/shorts/5pfoL7XtUzg",
    "https://www.youtube-nocookie.com/embed/5pfoL7XtUzg",
  ])
    assert.deepEqual(companyVideoSource(url), { kind: "youtube", id: "5pfoL7XtUzg" });
});
test("company video rejects unsafe or unsupported CMS values", () => {
  for (const url of [
    undefined,
    "",
    "not a URL",
    "javascript:alert(1)",
    "http://example.org/video.mp4",
    "https://youtube.com.evil.test/watch?v=5pfoL7XtUzg",
    "https://youtu.be/invalid",
    "https://example.org/page",
  ])
    assert.equal(companyVideoSource(url), null);
});
test("company video keeps direct media query parameters", () => {
  for (const extension of ["mp4", "webm"]) {
    const url = `https://cdn.example.org/reel.${extension}?version=2`;
    assert.deepEqual(companyVideoSource(url), { kind: "file", url });
  }
});
test("player timestamps handle unknown durations", () => {
  assert.equal(videoTime(NaN), "00:00");
  assert.equal(videoTime(Infinity), "00:00");
  assert.equal(videoTime(-5), "00:00");
  assert.equal(videoTime(874.9), "14:34");
});
