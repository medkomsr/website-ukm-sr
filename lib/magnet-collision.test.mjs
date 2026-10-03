import assert from "node:assert/strict";
import { magnetsOverlap, placeMagnet } from "./magnet-collision.ts";

const rect = (x, y, width = 100, height = 50) => ({ x, y, width, height });
const valid = (items, bounds) => {
  for (let i = 0; i < items.length; i++) {
    const r = items[i];
    assert.ok(
      r.x >= 0 &&
        r.y >= 0 &&
        r.x + r.width <= bounds.width &&
        r.y + r.height <= bounds.height,
    );
    for (let j = i + 1; j < items.length; j++)
      assert.equal(magnetsOverlap(r, items[j]), false);
  }
};
const bounds = { width: 600, height: 300 };
const initial = [rect(0, 0), rect(120, 0), rect(240, 0)];
const shifted = placeMagnet(initial, 0, 70, 0, bounds);
assert.equal(shifted[0].x, 70);
assert.ok(shifted[1].x > initial[1].x);
assert.ok(shifted[2].x > initial[2].x);
assert.equal(initial[0].x, 0, "input stays immutable");
valid(shifted, bounds);
const corner = placeMagnet([rect(0, 0), rect(120, 0)], 0, 80, 0, {
  width: 220,
  height: 180,
});
assert.ok(corner[1].y > 0, "neighbour moves down when right edge is blocked");
valid(corner, { width: 220, height: 180 });
const packed = [rect(0, 0), rect(108, 0)];
assert.deepEqual(
  placeMagnet(packed, 0, 40, 0, { width: 208, height: 50 }),
  packed,
  "packed board keeps last safe position",
);
let sequence = [
  rect(0, 0),
  rect(130, 0),
  rect(260, 0),
  rect(0, 80),
  rect(130, 80),
  rect(260, 80),
];
for (let step = 0; step < 300; step++) {
  const i = step % sequence.length;
  sequence = placeMagnet(
    sequence,
    i,
    (step * 37) % 520,
    (step * 17) % 250,
    bounds,
  );
  valid(sequence, bounds);
}
console.log(
  "PASS: chain push, blocked edge, packed board, immutability, 300 sequential moves",
);
