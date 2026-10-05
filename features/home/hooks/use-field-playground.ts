"use client";
import { useRef, type RefObject } from "react";
import { createFieldWorld, type FieldPose } from "@/features/home/lib/field-collisions";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, Draggable, ScrollTrigger);

export function useFieldPlayground(root: RefObject<HTMLDivElement | null>) {
  const resetRef = useRef<() => void>(() => {});
  const moveRef = useRef<(index: number, x: number, y: number) => void>(() => {});
  const ignoreClickUntil = useRef(0);
  useGSAP(
    (_context, contextSafe) => {
      const media = gsap.matchMedia();
      media.add("(min-width: 801px)", () => {
        const stage = root.current!;
        const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-field]"));
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const waves = cards.map((card, i) =>
          reduced
            ? null
            : gsap.fromTo(
                card.querySelector("[data-field-float]"),
                { y: -4 },
                {
                  y: 4,
                  duration: 2.8 + (i % 3) * 0.2,
                  delay: i * 0.18,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                  paused: true,
                },
              ),
        );
        let visible = false;
        ScrollTrigger.create({
          trigger: stage,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            waves.forEach((w) => (visible ? w?.resume() : w?.pause()));
          },
        });
        let homes: FieldPose[] = [],
          width = 0,
          height = 0;
        let world: ReturnType<typeof createFieldWorld>;
        let resetting = false,
          resetTween: gsap.core.Tween | undefined;
        const setters = cards.map((card) => ({
          x: gsap.quickSetter(card, "x", "px"),
          y: gsap.quickSetter(card, "y", "px"),
          rotation: gsap.quickSetter(card, "rotation", "deg"),
        }));
        const render = () =>
          world.bodies.forEach((body, i) => {
            setters[i].x(body.position.x - homes[i].x);
            setters[i].y(body.position.y - homes[i].y);
            setters[i].rotation((body.angle * 180) / Math.PI);
          });
        const measure = () => {
          // Breakpoint changes can briefly hide the board before styles settle.
          if (!stage.clientWidth || !stage.clientHeight) return;
          resetTween?.kill();
          resetting = false;
          world?.dispose();
          cards.forEach((card) => {
            card.style.rotate = "none";
          });
          gsap.set(cards, { x: 0, y: 0, rotation: 0 });
          width = stage.clientWidth;
          height = stage.clientHeight;
          homes = cards.map((card) => ({
            x: card.offsetLeft + card.offsetWidth / 2,
            y: card.offsetTop + card.offsetHeight / 2,
            width: card.offsetWidth,
            height: card.offsetHeight,
            angle:
              (parseFloat(getComputedStyle(card).getPropertyValue("--turn")) * Math.PI) / 180 || 0,
          }));
          world = createFieldWorld(homes, width, height, reduced);
          render();
        };
        measure();
        const tick = (_time: number, delta: number) => {
          if (!visible || resetting || !world) return;
          world.step(delta);
          render();
        };
        gsap.ticker.add(tick);
        const drags = cards.map((card, i) => {
          const proxy = document.createElement("div");
          let origin = { x: 0, y: 0 };
          return Draggable.create(proxy, {
            type: "x,y",
            trigger: card.querySelector("button")!,
            dragClickables: true,
            minimumMovement: 4,
            allowNativeTouchScrolling: true,
            onPress() {
              if (!world) measure();
              visible = true;
              resetTween?.kill();
              resetting = false;
              const rect = stage.getBoundingClientRect();
              origin = {
                x: this.pointerX - rect.left - window.scrollX,
                y: this.pointerY - rect.top - window.scrollY,
              };
              gsap.set(proxy, { x: 0, y: 0 });
              this.update();
            },
            onDragStart() {
              visible = true;
              card.dataset.dragging = "true";
              world.grab(i, origin);
            },
            onDrag() {
              world.move({ x: origin.x + this.x, y: origin.y + this.y });
            },
            onRelease() {
              card.dataset.dragging = "false";
              world.release();
            },
            onDragEnd() {
              ignoreClickUntil.current = performance.now() + 350;
            },
          })[0];
        });
        resetRef.current = contextSafe!(() => {
          world.release();
          resetTween?.kill();
          resetting = true;
          const starts = world.bodies.map((body) => ({
            x: body.position.x,
            y: body.position.y,
            angle: body.angle,
          }));
          const progress = { value: 0 };
          resetTween = gsap.to(progress, {
            value: 1,
            duration: reduced ? 0 : 1.1,
            ease: "power3.inOut",
            onUpdate: () => {
              homes.forEach((home, i) => {
                const from = starts[i],
                  t = progress.value;
                world.setPose(
                  i,
                  from.x + (home.x - from.x) * t,
                  from.y + (home.y - from.y) * t,
                  from.angle + (home.angle - from.angle) * t,
                );
              });
              render();
            },
            onComplete: () => {
              resetting = false;
            },
          });
        });
        moveRef.current = (i, x, y) => {
          if (resetting) return;
          visible = true;
          world.nudge(i, x, y);
        };
        const observer = new ResizeObserver(() => {
          if (stage.clientWidth !== width || stage.clientHeight !== height) measure();
        });
        observer.observe(stage);
        return () => {
          observer.disconnect();
          resetTween?.kill();
          gsap.ticker.remove(tick);
          drags.forEach((drag) => drag.kill());
          world?.dispose();
          cards.forEach((card) => {
            card.style.rotate = "";
          });
          resetRef.current = () => {};
          moveRef.current = () => {};
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return {
    reset: () => resetRef.current(),
    move: (i: number, x: number, y: number) => moveRef.current(i, x, y),
    suppressClick: () => performance.now() < ignoreClickUntil.current,
  };
}
