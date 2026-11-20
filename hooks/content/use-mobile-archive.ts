import { useSyncExternalStore } from "react";

const subscribe = (notify: () => void) => {
  const media = window.matchMedia("(max-width: 700px)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getSnapshot = () => window.matchMedia("(max-width: 700px)").matches;
const getServerSnapshot = () => false;

export function useMobileArchive() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
