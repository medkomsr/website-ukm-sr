import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

// Interactive controls start accepting input once React is listening on the client.
export function useHydrated() {
  return useSyncExternalStore(subscribe, onClient, onServer);
}
