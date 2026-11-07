"use client";

import { useSyncExternalStore } from "react";
import { store } from "@/lib/store";
import type { UserProfile } from "@/lib/types";

export function useProfile() {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  return {
    profile: state.profile,
    updateProfile: (patch: Partial<UserProfile>) => store.updateProfile(patch),
    resetProfile: () => store.resetProfile(),
  };
}
