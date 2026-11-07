"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * SSR-safe hook to determine if component has mounted on the client.
 * Uses useSyncExternalStore to avoid hydration mismatches and eliminate
 * setState-in-effect cascading renders.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
