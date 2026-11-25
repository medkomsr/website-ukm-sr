"use client";

import { useSyncExternalStore, type ComponentProps } from "react";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export default function ArchiveSearchInput(props: ComponentProps<"input">) {
  // The HTML is visible before React can retain keystrokes in the search state.
  const hydrated = useSyncExternalStore(subscribe, onClient, onServer);
  return <input {...props} disabled={!hydrated || props.disabled} />;
}
