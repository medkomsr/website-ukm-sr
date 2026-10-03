"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { RotateCcw } from "lucide-react";
import styles from "./magnet-board.module.css";

gsap.registerPlugin(useGSAP, Draggable);

const values = [
  ["Berkarya.", "Menuangkan rasa menjadi sesuatu yang bermakna.", "✳"],
  ["Belajar.", "Memberi ruang untuk mencoba, salah, dan mencoba lagi.", "◒"],
  ["Berbagi.", "Mengalirkan kebaikan melalui bakat yang kita miliki.", "✦"],
  ["Merawat.", "Menjaga nilai dalam setiap langkah dan setiap karya.", "◈"],
  ["Bersama.", "Saling mendengar. Saling mendukung. Saling menguatkan.", "✺"],
  ["Bertumbuh.", "Menjadi sedikit lebih baik, satu proses setiap hari.", "↗"],
] as const;

export default function MagnetBoard() {
  const board = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState<string | null>(null);
  const { contextSafe } = useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLButtonElement>(
        "[data-magnet]",
        board.current!,
      );
      const drags = cards.flatMap((card) =>
        Draggable.create(card, {
          type: "x,y",
          bounds: board.current!,
          edgeResistance: 0.85,
          dragClickables: true,
          minimumMovement: 7,
          cursor: "grab",
          activeCursor: "grabbing",
          onPress() {
            gsap.killTweensOf(card);
          },
        }),
      );
      const observer = new ResizeObserver(() =>
        drags.forEach((drag) => drag.applyBounds(board.current!)),
      );
      observer.observe(board.current!);
      return () => {
        observer.disconnect();
        drags.forEach((drag) => drag.kill());
      };
    },
    { scope: board },
  );

  useGSAP(
    () => {
      gsap.utils
        .toArray<HTMLElement>("[data-magnet-face]", board.current!)
        .forEach((face) => {
          gsap.to(face, {
            rotateY: face.dataset.magnetFace === flipped ? 180 : 0,
            duration: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? 0
              : 0.55,
            ease: "power2.inOut",
            overwrite: true,
          });
        });
    },
    { scope: board, dependencies: [flipped] },
  );

  const reset = () =>
    contextSafe(() => {
      setFlipped(null);
      gsap.to("[data-magnet]", {
        x: 0,
        y: 0,
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 0.65,
        ease: "power3.out",
        overwrite: true,
        onUpdate() {
          gsap.utils
            .toArray<HTMLElement>("[data-magnet]", board.current!)
            .forEach((card) => Draggable.get(card)?.update());
        },
      });
    })();
  const move = contextSafe((event: KeyboardEvent<HTMLButtonElement>) => {
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-18, 0],
      ArrowRight: [18, 0],
      ArrowUp: [0, -18],
      ArrowDown: [0, 18],
    };
    if (!delta[event.key] && event.key !== "Home") return;
    event.preventDefault();
    const card = event.currentTarget;
    const drag = Draggable.get(card);
    const [dx, dy] = delta[event.key] ?? [0, 0];
    const x =
      event.key === "Home" ? 0 : Number(gsap.getProperty(card, "x")) + dx;
    const y =
      event.key === "Home" ? 0 : Number(gsap.getProperty(card, "y")) + dy;
    gsap.set(card, {
      x: gsap.utils.clamp(drag?.minX ?? 0, drag?.maxX ?? 0, x),
      y: gsap.utils.clamp(drag?.minY ?? 0, drag?.maxY ?? 0, y),
    });
    drag?.update();
  });

  return (
    <section className={styles.section} aria-labelledby="values-title">
      <div className={styles.heading}>
        <span>SEMANGAT YANG MENGGERAKKAN KAMI</span>
        <h2 id="values-title" data-split>
          Berawal dari <em>rasa ingin.</em>
        </h2>
        <p id="magnet-help">
          Geser kartunya. Ketuk untuk menemukan maknanya.
          <span>
            {" "}
            Gunakan tombol panah untuk menggeser, Home untuk mengembalikan.
          </span>
        </p>
      </div>
      <div ref={board} className={styles.board}>
        {values.map(([label, description, symbol], index) => (
          <button
            key={label}
            data-magnet
            className={styles.card}
            data-color={index % 3}
            aria-pressed={flipped === label}
            aria-describedby="magnet-help"
            aria-label={`${label} ${flipped === label ? description : "Balik kartu untuk membaca maknanya."}`}
            onClick={(event) => {
              if (
                event.detail &&
                (Draggable.get(event.currentTarget)?.timeSinceDrag() ?? 1) < 0.2
              )
                return;
              setFlipped(flipped === label ? null : label);
            }}
            onKeyDown={move}
          >
            <span data-magnet-face={label} className={styles.inner}>
              <span className={styles.front} aria-hidden="true">
                <span>{label}</span>
                <i>{symbol}</i>
                <small>0{index + 1} / SENI RELIGI</small>
              </span>
              <span className={styles.back} aria-hidden="true">
                <i>{symbol}</i>
                <span>{description}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.boardFooter}>
        <span>BERBEDA BENTUK. SATU SEMANGAT.</span>
        <button onClick={reset}>
          <RotateCcw size={13} /> Rapikan kembali
        </button>
      </div>
    </section>
  );
}
