"use client";
import s from "@/styles/experience.module.scss";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
function Eyebrow({ number, children }: { number: string; children: ReactNode }) {
  return (
    <p className={s.eyebrow}>
      <span>{number}</span>
      <i />
      {children}
    </p>
  );
}

export function SectionTitle({
  number,
  label,
  title,
  children,
}: {
  number?: string;
  label?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={s.sectionTitle}>
      <div>
        {number && label && <Eyebrow number={number}>{label}</Eyebrow>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className={s.textLink} href={href}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
