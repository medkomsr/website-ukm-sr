export type MagnetRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type MagnetBounds = { width: number; height: number };

export function magnetsOverlap(a: MagnetRect, b: MagnetRect, gap = 8) {
  return (
    a.x < b.x + b.width + gap - 0.01 &&
    a.x + a.width + gap > b.x + 0.01 &&
    a.y < b.y + b.height + gap - 0.01 &&
    a.y + a.height + gap > b.y + 0.01
  );
}

/** Push neighbours in the nearest available direction, propagating through a chain.
 * If the board is packed, retain the last valid layout instead of allowing overlap.
 */
export function placeMagnet(
  previous: MagnetRect[],
  active: number,
  x: number,
  y: number,
  bounds: MagnetBounds,
  gap = 8,
): MagnetRect[] {
  let layout = previous.map((rect) => ({ ...rect }));
  const moving = layout[active];
  moving.x = Math.max(0, Math.min(bounds.width - moving.width, x));
  moving.y = Math.max(0, Math.min(bounds.height - moving.height, y));
  let budget = 600;

  const push = (
    index: number,
    obstacle: number,
    chain: Set<number>,
  ): boolean => {
    if (chain.has(index) || --budget < 0) return false;
    const item = layout[index],
      other = layout[obstacle];
    const candidates = [
      { x: other.x - item.width - gap, y: item.y },
      { x: other.x + other.width + gap, y: item.y },
      { x: item.x, y: other.y - item.height - gap },
      { x: item.x, y: other.y + other.height + gap },
    ]
      .filter(
        (p) =>
          p.x >= 0 &&
          p.y >= 0 &&
          p.x + item.width <= bounds.width &&
          p.y + item.height <= bounds.height,
      )
      .sort(
        (a, b) =>
          Math.hypot(a.x - item.x, a.y - item.y) -
          Math.hypot(b.x - item.x, b.y - item.y),
      );
    const snapshot = layout.map((rect) => ({ ...rect }));
    const nextChain = new Set([...chain, index]);
    for (const candidate of candidates) {
      layout = snapshot.map((rect) => ({ ...rect }));
      Object.assign(layout[index], candidate);
      let clear = true;
      for (let i = 0; i < layout.length; i++) {
        if (
          i !== index &&
          magnetsOverlap(layout[index], layout[i], gap) &&
          !push(i, index, nextChain)
        ) {
          clear = false;
          break;
        }
      }
      if (clear) return true;
    }
    layout = snapshot;
    return false;
  };

  for (let i = 0; i < layout.length; i++) {
    if (
      i !== active &&
      magnetsOverlap(layout[active], layout[i], gap) &&
      !push(i, active, new Set([active]))
    )
      return previous;
  }
  return layout;
}
