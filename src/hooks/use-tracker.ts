"use client";

import { useSyncExternalStore, useMemo } from "react";
import { store } from "@/lib/store";
import type { TrackedItem, TrackingStatus } from "@/lib/types";

export function useTracker() {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const tracked = state.tracked;
  const trackedList = useMemo(() => Object.values(tracked), [tracked]);
  const count = trackedList.length;

  return {
    tracked,
    trackedList,
    count,
    isSaved: (id: string) => Boolean(tracked[id]),
    getItem: (id: string): TrackedItem | null => tracked[id] ?? null,
    add: (scholarshipId: string, initialStatus?: TrackingStatus) =>
      store.addTracked(scholarshipId, initialStatus),
    remove: (scholarshipId: string) => store.removeTracked(scholarshipId),
    setStatus: (scholarshipId: string, status: TrackingStatus) =>
      store.setStatus(scholarshipId, status),
    toggleDoc: (scholarshipId: string, docName: string) =>
      store.toggleDoc(scholarshipId, docName),
    setNotes: (scholarshipId: string, notes: string) =>
      store.setNotes(scholarshipId, notes),
    loadDemo: () => store.loadDemo(),
    reset: () => store.resetTracker(),
  };
}
