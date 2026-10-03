"use client";

import { useRef, useState, type ReactNode, type PointerEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import s from "./replica-home.module.css";

type Motion =
  | "square"
  | "toggle"
  | "triangle"
  | "bounce"
  | "cross"
  | "burst"
  | "leaves"
  | "star"
  | "hourglass"
  | "logo"
  | "text";

/** Separate click motion from entrance/floating motion on the parent. */
export function MotionPiece({
  kind,
  label,
  className = "",
  children,
  hero = false,
}: {
  kind: Motion;
  label: string;
  className?: string;
  children: ReactNode;
  hero?: boolean;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const [pressed, setPressed] = useState(false);
  const toggleState = useRef(false);
  const isToggle = [
    "toggle",
    "square",
    "triangle",
    "burst",
    "leaves",
    "hourglass",
  ].includes(kind);
  const { contextSafe } = useGSAP(
    () => {
      const parts = button.current?.querySelectorAll("[data-part]");
      if (parts?.length)
        gsap.set(parts, { svgOrigin: "50 50", smoothOrigin: false });
    },
    { scope: button },
  );
  const play = () =>
    contextSafe(() => {
      const element = button.current!;
      const target = element.querySelector<HTMLElement>(
        "[data-motion-visual]",
      )!;
      animation.current?.kill();
      const parts = target.querySelectorAll("[data-part]");
      const bits = element.querySelectorAll("[data-burst]");
      // Stateful pieces continue from their current pose, including an interrupted tween.
      // Only the text/logo/one-shot effects restart from their resting pose.
      if (!isToggle) {
        gsap.set(target, { clearProps: "transform,filter,opacity" });
      }
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({
        onComplete: () => {
          element.dataset.animating = "false";
        },
      });
      animation.current = tl;
      element.dataset.animating = "true";
      const next = isToggle ? !toggleState.current : false;
      if (isToggle) {
        toggleState.current = next;
        setPressed(next);
      }
      if (kind === "toggle") {
        // One SVG coordinate, no CSS translation or easing overshoot.
        // Knob radius including stroke is 41, so both endpoints stay in the track.
        tl.to(target.querySelector("[data-knob]"), {
          attr: { cx: next ? 45 : 175 },
          duration: reduced ? 0 : 0.48,
          ease: "power3.inOut",
        });
        tl.to(
          target.querySelector("[data-track]"),
          {
            attr: { fill: next ? "#9aa1ab" : "#fa3d45" },
            duration: reduced ? 0 : 0.35,
          },
          0,
        );
      } else if (isToggle) {
        const duration = reduced ? 0 : 0.6;
        if (kind === "burst") {
          tl.to(
            target,
            {
              scale: next ? 0 : 1,
              opacity: next ? 0 : 1,
              duration,
              ease: "power3.inOut",
            },
            0,
          ).to(
            bits,
            {
              xPercent: (i) => (next ? (i % 2 ? 140 : -140) : 0),
              yPercent: (i) => (next ? (i < 2 ? -140 : 140) : 0),
              scale: next ? 1 : 0,
              opacity: next ? 1 : 0,
              duration,
              ease: "power3.inOut",
            },
            0,
          );
        } else if (kind === "leaves") {
          tl.to(parts, {
            rotation: (i) => (next ? (i % 2 ? -65 : 65) : 0),
            x: (i) => (next ? (i < 2 ? -7 : 7) : 0),
            duration,
            stagger: reduced ? 0 : 0.035,
            ease: "power3.inOut",
          });
        } else if (kind === "hourglass") {
          tl.to(parts, {
            y: (i) => (next ? (i ? 12 : -12) : 0),
            rotation: (i) => (next ? (i ? 9 : -9) : 0),
            scaleY: next ? 0.85 : 1,
            duration,
            ease: "power3.inOut",
          });
        } else if (kind === "triangle") {
          gsap.set(target, { transformPerspective: 650 });
          tl.to(target, {
            rotationY: next ? 180 : 0,
            duration,
            ease: "power3.inOut",
          });
        } else if (kind === "square") {
          tl.to(target, {
            rotation: next ? -18 : 0,
            scale: next ? 1.05 : 1,
            y: next ? -8 : 0,
            duration,
            ease: "power3.inOut",
          });
        }
      } else if (reduced) {
        tl.to(target, { opacity: 0.65, duration: 0.08 }).to(target, {
          opacity: 1,
          duration: 0.12,
        });
      } else if (kind === "bounce") {
        tl.to(target, { scaleX: 1.18, scaleY: 0.7, y: 6, duration: 0.2 })
          .to(target, { scaleX: 0.88, scaleY: 1.13, y: -10, duration: 0.22 })
          .to(target, {
            scaleX: 1,
            scaleY: 1,
            y: 0,
            duration: 0.85,
            ease: "elastic.out(1,0.35)",
          });
      } else if (kind === "logo") {
        gsap.set(target, { transformPerspective: 700 });
        tl.to(target, {
          rotationY: 720,
          rotationZ: 8,
          duration: 1.65,
          ease: "power2.inOut",
        }).to(target, { rotationZ: 0, duration: 0.35, ease: "back.out(2)" });
      } else if (kind === "text") {
        const chars = target.querySelectorAll(".hero-char");
        gsap.killTweensOf(chars);
        gsap.set(chars, { y: 0, rotation: 0, rotationX: 0 });
        tl.to(chars.length ? chars : target, {
          y: (i) => (i % 2 ? -18 : 12),
          rotation: (i) => (i % 2 ? 14 : -10),
          stagger: 0.025,
          duration: 0.2,
          ease: "power2.out",
        }).to(
          chars.length ? chars : target,
          {
            y: 0,
            rotation: 0,
            rotationX: 0,
            stagger: 0.025,
            duration: 0.55,
            ease: "elastic.out(1,0.5)",
          },
          0.18,
        );
      } else if (kind === "cross" || kind === "star") {
        tl.to(target, {
          rotation: 90,
          scale: kind === "star" ? 0.72 : 1.05,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        }).to(target, {
          rotation: 0,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1,0.45)",
        });
      }
    })();
  const rippleText = (event: PointerEvent<HTMLButtonElement>) => {
    if (
      kind !== "text" ||
      event.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const char = (event.target as HTMLElement).closest<HTMLElement>(
      ".hero-char",
    );
    if (!char || gsap.isTweening(char)) return;
    contextSafe(() => {
      gsap
        .timeline()
        .to(char, {
          y: -16,
          rotation: 12,
          scale: 1.12,
          duration: 0.2,
          overwrite: true,
        })
        .to(char, {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.7,
          ease: "elastic.out(1,0.4)",
        });
    })();
  };
  return (
    <button
      ref={button}
      type="button"
      className={`${s.motionPiece} ${className}`}
      data-hero-shape={hero || undefined}
      data-motion={kind}
      aria-label={label}
      aria-pressed={isToggle ? pressed : undefined}
      onClick={play}
      onPointerMove={rippleText}
    >
      <span className={s.motionVisual} data-motion-visual>
        {kind === "toggle" ? (
          <svg viewBox="0 0 220 90" aria-hidden="true">
            <rect
              data-track
              x="4"
              y="4"
              width="212"
              height="82"
              rx="41"
              fill="#fa3d45"
            />
            <circle
              data-knob
              cx="175"
              cy="45"
              r="32"
              fill="var(--bg)"
              stroke="#f7bd20"
              strokeWidth="18"
            />
          </svg>
        ) : kind === "leaves" ? (
          <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
            <path data-part d="M0 0C28 0 50 22 50 50 22 50 0 28 0 0Z" />
            <path data-part d="M0 100C0 72 22 50 50 50 50 78 28 100 0 100Z" />
            <path data-part d="M50 0C78 0 100 22 100 50 72 50 50 28 50 0Z" />
            <path
              data-part
              d="M50 100C50 72 72 50 100 50 100 78 78 100 50 100Z"
            />
          </svg>
        ) : kind === "hourglass" ? (
          <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
            <path data-part d="M0 0H100C100 28 78 50 50 50 22 50 0 28 0 0Z" />
            <path
              data-part
              d="M0 100H100C100 72 78 50 50 50 22 50 0 72 0 100Z"
            />
          </svg>
        ) : (
          children
        )}
      </span>
      {kind === "burst" &&
        [0, 1, 2, 3].map((i) => (
          <i key={i} className={s.burstBit} data-burst aria-hidden="true" />
        ))}
    </button>
  );
}
