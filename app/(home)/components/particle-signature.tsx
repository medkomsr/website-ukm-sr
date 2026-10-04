"use client";

import { useEffect, useRef, useState } from "react";
import s from "./sr-home.module.css";

type Dot = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  floor: number;
  release: number;
  glyph: string;
};
const phases = ["tersusun", "terurai", "jatuh"];

export function ParticleSignature() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const advance = useRef<() => void>(() => {});
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const el = canvas.current!,
      ctx = el.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let dots: Dot[] = [],
      width = 0,
      height = 0,
      frame = 0,
      visible = false,
      disposed = false,
      mode = 0;
    let pointer = { x: -1000, y: -1000 },
      last = 0;
    const draw = (time = performance.now()) => {
      const dt = Math.min(2, Math.max(0.5, (time - last) / 16.67));
      last = time;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(el).color;
      ctx.font = `${width < 600 ? 4 : 6}px monospace`;
      let moving = false;
      dots.forEach((d, i) => {
        if (reduced.matches) {
          d.x = mode === 1 ? d.sx : d.ox;
          d.y = mode === 2 ? d.floor : mode === 1 ? d.sy : d.oy;
        } else if (mode === 2) {
          if (time < d.release) moving = true;
          else {
            d.vy += 0.3 * dt;
            d.x += d.vx * dt;
            d.y += d.vy * dt;
            d.vx *= 0.99;
            if (d.x < 3 || d.x > width - 3) {
              d.vx *= -0.4;
              d.x = Math.max(3, Math.min(width - 3, d.x));
            }
            if (d.y >= d.floor) {
              d.y = d.floor;
              d.vy = Math.abs(d.vy) < 1 ? 0 : -Math.abs(d.vy) * 0.3;
              d.vx *= 0.82;
            }
            if (d.y < d.floor || Math.abs(d.vx) + Math.abs(d.vy) > 0.08)
              moving = true;
          }
        } else {
          const tx = mode === 1 ? d.sx + Math.sin(time * 0.001 + i) * 7 : d.ox;
          const ty = mode === 1 ? d.sy + Math.cos(time * 0.0008 + i) * 7 : d.oy;
          const dx = d.x - pointer.x,
            dy = d.y - pointer.y,
            distance = Math.hypot(dx, dy);
          if (distance < 90 && distance > 0) {
            d.vx += (dx / distance) * (90 - distance) * 0.012;
            d.vy += (dy / distance) * (90 - distance) * 0.012;
          }
          d.vx += (tx - d.x) * 0.022 * dt;
          d.vy += (ty - d.y) * 0.022 * dt;
          d.vx *= 0.86;
          d.vy *= 0.86;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          if (mode === 1 || Math.abs(d.vx) + Math.abs(d.vy) > 0.03)
            moving = true;
        }
        ctx.fillText(d.glyph, d.x, d.y);
      });
      frame = visible && moving ? requestAnimationFrame(draw) : 0;
    };
    const wake = () => {
      if (visible && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const setup = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      el.width = width * dpr;
      el.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mask = document.createElement("canvas");
      mask.width = width;
      mask.height = height;
      const m = mask.getContext("2d")!;
      m.font = `500 ${width / 6.5}px ${getComputedStyle(el).fontFamily}`;
      m.textAlign = "center";
      m.textBaseline = "middle";
      m.fillText("SENI RELIGI", width / 2, height * 0.42, width * 0.96);
      const pixels = m.getImageData(0, 0, width, height).data;
      dots = [];
      const step = width < 600 ? 4 : 6;
      for (let y = 0; y < height; y += step)
        for (let x = 0; x < width; x += step) {
          if (pixels[(y * width + x) * 4 + 3] > 120)
            dots.push({
              x,
              y,
              ox: x,
              oy: y,
              sx: Math.max(
                4,
                Math.min(width - 4, x + (Math.random() - 0.5) * width * 0.18),
              ),
              sy: Math.max(
                8,
                Math.min(height - 25, y + (Math.random() - 0.5) * height * 0.5),
              ),
              vx: 0,
              vy: 0,
              floor: height - 8 - Math.random() * 15,
              release: 0,
              glyph: "SENIRELIGI+"[dots.length % 10],
            });
        }
      cancelAnimationFrame(frame);
      frame = 0;
      draw();
    };
    advance.current = () => {
      mode = (mode + 1) % 3;
      setPhase(mode);
      pointer = { x: -1000, y: -1000 };
      dots.forEach((d) => {
        d.vx =
          mode === 1
            ? (Math.random() - 0.5) * 14
            : mode === 2
              ? (Math.random() - 0.5) * 3
              : 0;
        d.vy = mode === 1 ? (Math.random() - 0.5) * 14 : 0;
        d.release = performance.now() + Math.random() * 450;
      });
      if (reduced.matches) draw();
      else wake();
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      wake();
    };
    const leave = () => {
      pointer = { x: -1000, y: -1000 };
      wake();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    const resize = new ResizeObserver(setup);
    resize.observe(el);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(el);
    document.fonts.ready.then(() => {
      if (!disposed) setup();
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <button
      className={s.signature}
      onClick={() => advance.current()}
      data-phase={phases[phase]}
      aria-label="Ubah kondisi partikel Seni Religi"
    >
      <canvas ref={canvas} aria-hidden="true" />
      <span className={s.srOnly} aria-live="polite">
        Partikel {phases[phase]}
      </span>
    </button>
  );
}
