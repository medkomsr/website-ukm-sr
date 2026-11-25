"use client";

import type { ComponentProps } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

export default function ArchiveSearchInput(props: ComponentProps<"input">) {
  const hydrated = useHydrated();
  return <input {...props} disabled={!hydrated || props.disabled} />;
}
