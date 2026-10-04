"use client";

import { useEffect, useSyncExternalStore } from "react";

function readTheme() {
  const stored = localStorage.getItem("sr-theme");
  return stored
    ? stored === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
}
function subscribe(notify: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("sr-theme-change", notify);
  window.addEventListener("storage", notify);
  media.addEventListener("change", notify);
  return () => {
    window.removeEventListener("sr-theme-change", notify);
    window.removeEventListener("storage", notify);
    media.removeEventListener("change", notify);
  };
}
function setTheme(dark: boolean) {
  localStorage.setItem("sr-theme", dark ? "dark" : "light");
  document.documentElement.dataset.srTheme = dark ? "dark" : "light";
  window.dispatchEvent(new Event("sr-theme-change"));
}
export function useSiteTheme() {
  const dark = useSyncExternalStore(subscribe, readTheme, () => false);
  useEffect(() => {
    document.documentElement.dataset.srTheme = dark ? "dark" : "light";
  }, [dark]);
  return [dark, setTheme] as const;
}
