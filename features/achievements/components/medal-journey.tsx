"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import SrMedal from "@/features/achievements/components/sr-medal";
import s from "@/features/achievements/components/achievements.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

/** One medal follows measured landmarks, so the path survives responsive reflow. */
export default function MedalJourney() {
  const medal = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const object = medal.current!;
        const stage = object.parentElement!;
        const points = () => {
          const bounds = stage.getBoundingClientRect();
          return Array.from(stage.querySelectorAll<HTMLElement>("[data-medal-point]")).map(
            (marker) => {
              const rect = marker.getBoundingClientRect();
              return { x: rect.left - bounds.left, y: rect.top - bounds.top };
            },
          );
        };
        gsap.set(object, { xPercent: -50, yPercent: -50, transformOrigin: "50% 64%" });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            endTrigger: stage.querySelector("[data-medal-stop]"),
            end: "center 65%",
            scrub: 1.6,
            invalidateOnRefresh: true,
          },
        });
        const segmentPath = (index: number) => {
          const nodes = points(),
            a = nodes[index],
            b = nodes[index + 1];
          return [a, { x: a.x + (b.x - a.x) * 0.3, y: a.y + (b.y - a.y) * 0.55 }, b];
        };
        const travels: gsap.core.Tween[] = [];
        points()
          .slice(1)
          .forEach((_, index) => {
            const nodes = points(),
              distance = nodes.at(-1)!.y - nodes[0].y;
            const travel = gsap.fromTo(
              object,
              { x: () => points()[index].x, y: () => points()[index].y },
              {
                motionPath: { path: segmentPath(index), curviness: 1.15 },
                duration: (nodes[index + 1].y - nodes[index].y) / distance,
                ease: "none",
                immediateRender: index === 0,
              },
            );
            timeline.add(travel, (nodes[index].y - nodes[0].y) / distance);
            travels.push(travel);
          });
        const refreshPath = () => {
          const nodes = points(),
            distance = nodes.at(-1)!.y - nodes[0].y;
          travels.forEach((travel, index) => {
            travel.vars.motionPath = { path: segmentPath(index), curviness: 1.15 };
            travel.duration((nodes[index + 1].y - nodes[index].y) / distance);
            travel.startTime((nodes[index].y - nodes[0].y) / distance);
            travel.invalidate();
          });
        };
        ScrollTrigger.addEventListener("refreshInit", refreshPath);
        // Hold the large left-hand silhouette before crossing to the manifesto.
        timeline.fromTo(
          "[data-medal-pose]",
          { scale: 1, rotation: -16, rotationY: -18 },
          {
            keyframes: [
              { scale: 0.96, rotation: -10, rotationY: 12, duration: 0.24 },
              { scale: 0.72, rotation: 12, rotationY: -14, duration: 0.24 },
              { scale: 0.43, rotation: 26, rotationY: 20, duration: 0.18 },
              { scale: 0.53, rotation: -12, rotationY: -16, duration: 0.18 },
              {
                scale: () => (matchMedia("(max-width:700px)").matches ? 0.65 : 0.45),
                rotation: 0,
                rotationY: 0,
                duration: 0.16,
              },
            ],
            ease: "none",
          },
          0,
        );
        gsap.from("[data-medal-enter]", {
          opacity: 0,
          y: 65,
          scale: 0.85,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: stage, start: "top 85%", once: true },
        });
        gsap.to("[data-medal-float]", {
          y: -10,
          rotation: 2,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        const tilt = object.querySelector("[data-medal-tilt]");
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          gsap.to(tilt, {
            rotationY: (event.clientX / innerWidth - 0.5) * 16,
            rotationX: -(event.clientY / innerHeight - 0.5) * 12,
            duration: 1,
            overwrite: true,
          });
        };
        const reset = () => {
          gsap.to(tilt, { rotationX: 0, rotationY: 0, duration: 1 });
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", reset);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", refreshPath);
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", reset);
          gsap.killTweensOf(tilt);
        };
      });
      return () => media.revert();
    },
    { scope: medal },
  );
  return (
    <div ref={medal} className={s.travelMedal} aria-hidden="true">
      <div data-medal-enter>
        <div data-medal-pose>
          <div data-medal-float>
            <div data-medal-tilt className={s.medalTilt}>
              <SrMedal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
