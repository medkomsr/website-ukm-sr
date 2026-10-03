"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import s from "./replica-home.module.css";

/** Short, fading ribbons; the real pointer and all hit targets remain untouched. */
export function HeroPointerTrail() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const surface = canvas.current!;
          const hero = surface.parentElement!;
          const ctx = surface.getContext("2d");
          if (!ctx) return;
          const colors = ["#376fcb", "#f7bd20", "#fa3d45", "#07865f"];
          let points: { x: number; y: number; time: number }[] = [];
          let sparks: {
            x: number;
            y: number;
            vx: number;
            vy: number;
            time: number;
            color: string;
          }[] = [];
          let running = false;
          const resize = () => {
            const ratio = Math.min(devicePixelRatio, 2);
            surface.width = hero.clientWidth * ratio;
            surface.height = hero.clientHeight * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
          };
          const draw = () => {
            const now = performance.now();
            points = points.filter((p) => now - p.time < 340);
            sparks = sparks.filter((p) => now - p.time < 650);
            ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
            ctx.lineCap = "round";
            colors.slice(0, 3).forEach((color, colorIndex) => {
              ctx.strokeStyle = color;
              for (let i = 1; i < points.length; i++) {
                const age = (now - points[i].time) / 340;
                ctx.globalAlpha = (1 - age) * 0.2;
                ctx.lineWidth = (1 - age) * 2.5;
                ctx.beginPath();
                ctx.moveTo(
                  points[i - 1].x,
                  points[i - 1].y + (colorIndex - 1) * 4,
                );
                ctx.lineTo(points[i].x, points[i].y + (colorIndex - 1) * 4);
                ctx.stroke();
              }
            });
            sparks.forEach((p) => {
              const t = (now - p.time) / 650;
              ctx.globalAlpha = 1 - t;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(
                p.x + p.vx * t,
                p.y + p.vy * t + 20 * t * t,
                3 * (1 - t),
                0,
                Math.PI * 2,
              );
              ctx.fill();
            });
            ctx.globalAlpha = 1;
            if (!points.length && !sparks.length) {
              gsap.ticker.remove(draw);
              running = false;
            }
          };
          const start = () => {
            if (!running) {
              running = true;
              gsap.ticker.add(draw);
            }
          };
          const position = (event: PointerEvent) => {
            const rect = hero.getBoundingClientRect();
            return {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              time: performance.now(),
            };
          };
          const move = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            points.push(position(event));
            points = points.slice(-32);
            start();
          };
          const burst = (event: PointerEvent) => {
            if (!(event.target as Element).closest("a")) return;
            const point = position(event);
            for (let i = 0; i < 8; i++) {
              const angle = (i * Math.PI) / 4;
              sparks.push({
                ...point,
                vx: Math.cos(angle) * 34,
                vy: Math.sin(angle) * 34,
                color: colors[i % 4],
              });
            }
            sparks = sparks.slice(-32);
            start();
          };
          const observer = new ResizeObserver(resize);
          observer.observe(hero);
          resize();
          hero.addEventListener("pointermove", move, { passive: true });
          hero.addEventListener("pointerover", burst, { passive: true });
          return () => {
            observer.disconnect();
            hero.removeEventListener("pointermove", move);
            hero.removeEventListener("pointerover", burst);
            gsap.ticker.remove(draw);
            ctx.clearRect(0, 0, surface.width, surface.height);
          };
        },
      );
      return () => media.revert();
    },
    { scope: canvas },
  );
  return <canvas ref={canvas} className={s.pointerTrail} aria-hidden="true" />;
}
