import { describe, it, expect, beforeEach } from "vitest";
import { store, DEMO_TRACKED_ITEMS } from "@/lib/store";

describe("LocalStorage Store & State Manager", () => {
  beforeEach(() => {
    window.localStorage.clear();
    store.resetTracker();
  });

  it("adds and tracks a scholarship properly", () => {
    store.addTracked("sch-100", "saved");
    const snapshot = store.getSnapshot();
    expect(snapshot.tracked["sch-100"]).toBeDefined();
    expect(snapshot.tracked["sch-100"].status).toBe("saved");
  });

  it("updates status of a tracked scholarship", () => {
    store.addTracked("sch-101", "saved");
    store.setStatus("sch-101", "preparing");
    expect(store.getSnapshot().tracked["sch-101"].status).toBe("preparing");
  });

  it("toggles document checklist items", () => {
    store.addTracked("sch-102", "preparing");
    store.toggleDoc("sch-102", "Transcript");
    expect(store.getSnapshot().tracked["sch-102"].checklist["Transcript"]).toBe(true);

    store.toggleDoc("sch-102", "Transcript");
    expect(store.getSnapshot().tracked["sch-102"].checklist["Transcript"]).toBe(false);
  });

  it("sets application notes with automatic length limiting", () => {
    store.addTracked("sch-103", "preparing");
    const longNotes = "a".repeat(6000);
    store.setNotes("sch-103", longNotes);
    expect(store.getSnapshot().tracked["sch-103"].notes.length).toBe(5000);
  });

  it("removes a tracked scholarship", () => {
    store.addTracked("sch-104", "saved");
    expect(store.getSnapshot().tracked["sch-104"]).toBeDefined();
    store.removeTracked("sch-104");
    expect(store.getSnapshot().tracked["sch-104"]).toBeUndefined();
  });

  it("loads demo data and resets tracker", () => {
    store.loadDemo();
    expect(Object.keys(store.getSnapshot().tracked).length).toBe(
      Object.keys(DEMO_TRACKED_ITEMS).length
    );

    store.resetTracker();
    expect(Object.keys(store.getSnapshot().tracked).length).toBe(0);
  });

  it("safely recovers from corrupted localStorage JSON", () => {
    window.localStorage.setItem("grantly:v1:data", "INVALID_NOT_JSON{{{");
    const snapshot = store.getSnapshot();
    expect(snapshot.version).toBe(1);
    expect(snapshot.tracked).toBeDefined();
  });

  it("safely resets state when storage version mismatches", () => {
    window.localStorage.setItem(
      "grantly:v1:data",
      JSON.stringify({ version: 999, tracked: "corrupted" })
    );
    const snapshot = store.getSnapshot();
    expect(snapshot.version).toBe(1);
  });
});
