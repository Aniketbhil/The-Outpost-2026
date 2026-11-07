import type {
  ScholarshipFilters,
  TrackedItem,
  TrackingStatus,
  TrackerStoreState,
  UserProfile,
} from "./types";

const STORAGE_KEY = "grantly:v1:data";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Rivera",
  educationLevel: "Undergraduate",
  fieldOfStudy: "Computer Science",
  country: "United States",
  gpa: "3.85",
  financialNeed: true,
  interests: ["Artificial Intelligence", "Open Source", "Community Leadership"],
};

export const DEMO_TRACKED_ITEMS: Record<string, TrackedItem> = {
  "sch-1": {
    scholarshipId: "sch-1",
    status: "preparing",
    checklist: {
      "Resume / CV": true,
      "Official Transcript": true,
      "Essay 1 - Impact": false,
      "Letter of Recommendation": false,
    },
    notes: "First draft of the impact essay ready for peer review.",
    addedAt: "2026-10-15T10:00:00.000Z",
    updatedAt: "2026-11-01T14:30:00.000Z",
  },
  "sch-2": {
    scholarshipId: "sch-2",
    status: "applied",
    checklist: {
      "FAFSA / Student Aid Report": true,
      "Letters of Recommendation (x2)": true,
      "Leadership Portfolio": true,
    },
    notes: "Submitted via portal on Nov 2nd. Confirmation code: GR-88912.",
    addedAt: "2026-10-01T08:00:00.000Z",
    updatedAt: "2026-11-02T16:00:00.000Z",
  },
  "sch-3": {
    scholarshipId: "sch-3",
    status: "saved",
    checklist: {
      "Statement of Purpose": false,
      "GitHub / Project Link": false,
    },
    notes: "High award amount, great match for junior year.",
    addedAt: "2026-11-05T09:15:00.000Z",
    updatedAt: "2026-11-05T09:15:00.000Z",
  },
  "sch-4": {
    scholarshipId: "sch-4",
    status: "awarded",
    checklist: {
      "Acceptance Agreement": true,
      "Direct Deposit Verification": true,
    },
    notes: "Award confirmation received! $10,000 disbursed directly to university account.",
    addedAt: "2026-09-01T12:00:00.000Z",
    updatedAt: "2026-10-28T11:00:00.000Z",
  },
};

export const DEFAULT_STATE: TrackerStoreState = {
  version: 1,
  profile: DEFAULT_PROFILE,
  tracked: {},
};

export const DEFAULT_FILTERS: ScholarshipFilters = {
  search: "",
  levels: [],
  fields: [],
  countries: [],
  currencies: [],
  types: [],
  coverages: [],
  minAmount: 0,
  maxAmount: 50000,
  onlyEligible: false,
  sortBy: "deadline-soonest",
};

let currentState: TrackerStoreState = DEFAULT_STATE;
let initialized = false;
const listeners = new Set<() => void>();

function getStorageState(): TrackerStoreState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.version === 1) {
      return parsed as TrackerStoreState;
    }
    return DEFAULT_STATE;
  } catch (error) {
    console.warn("Grantly: Failed to read from localStorage", error);
    return DEFAULT_STATE;
  }
}

function persistState(state: TrackerStoreState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Grantly: Failed to save to localStorage", error);
  }
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function setState(updater: (prev: TrackerStoreState) => TrackerStoreState) {
  currentState = updater(currentState);
  persistState(currentState);
  notify();
}

export const store = {
  getSnapshot(): TrackerStoreState {
    if (!initialized && typeof window !== "undefined") {
      currentState = getStorageState();
      initialized = true;
    }
    return currentState;
  },

  getServerSnapshot(): TrackerStoreState {
    return DEFAULT_STATE;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (typeof window !== "undefined" && !initialized) {
      currentState = getStorageState();
      initialized = true;
      listener();
    }
    return () => {
      listeners.delete(listener);
    };
  },

  // Tracker Actions
  addTracked(scholarshipId: string, initialStatus: TrackingStatus = "saved") {
    const now = new Date().toISOString();
    setState((prev) => {
      if (prev.tracked[scholarshipId]) return prev;
      return {
        ...prev,
        tracked: {
          ...prev.tracked,
          [scholarshipId]: {
            scholarshipId,
            status: initialStatus,
            checklist: {},
            notes: "",
            addedAt: now,
            updatedAt: now,
          },
        },
      };
    });
  },

  removeTracked(scholarshipId: string) {
    setState((prev) => {
      if (!prev.tracked[scholarshipId]) return prev;
      const nextTracked = { ...prev.tracked };
      delete nextTracked[scholarshipId];
      return {
        ...prev,
        tracked: nextTracked,
      };
    });
  },

  setStatus(scholarshipId: string, status: TrackingStatus) {
    const now = new Date().toISOString();
    setState((prev) => {
      const existing = prev.tracked[scholarshipId];
      if (!existing) {
        return {
          ...prev,
          tracked: {
            ...prev.tracked,
            [scholarshipId]: {
              scholarshipId,
              status,
              checklist: {},
              notes: "",
              addedAt: now,
              updatedAt: now,
            },
          },
        };
      }
      return {
        ...prev,
        tracked: {
          ...prev.tracked,
          [scholarshipId]: {
            ...existing,
            status,
            updatedAt: now,
          },
        },
      };
    });
  },

  toggleDoc(scholarshipId: string, docName: string) {
    const now = new Date().toISOString();
    setState((prev) => {
      const existing = prev.tracked[scholarshipId];
      if (!existing) return prev;
      return {
        ...prev,
        tracked: {
          ...prev.tracked,
          [scholarshipId]: {
            ...existing,
            checklist: {
              ...existing.checklist,
              [docName]: !existing.checklist[docName],
            },
            updatedAt: now,
          },
        },
      };
    });
  },

  setNotes(scholarshipId: string, notes: string) {
    const now = new Date().toISOString();
    setState((prev) => {
      const existing = prev.tracked[scholarshipId];
      if (!existing) return prev;
      return {
        ...prev,
        tracked: {
          ...prev.tracked,
          [scholarshipId]: {
            ...existing,
            notes,
            updatedAt: now,
          },
        },
      };
    });
  },

  loadDemo() {
    setState((prev) => ({
      ...prev,
      tracked: { ...DEMO_TRACKED_ITEMS },
    }));
  },

  resetTracker() {
    setState((prev) => ({
      ...prev,
      tracked: {},
    }));
  },

  // Profile Actions
  updateProfile(patch: Partial<UserProfile>) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...patch,
      },
    }));
  },

  resetProfile() {
    setState((prev) => ({
      ...prev,
      profile: DEFAULT_PROFILE,
    }));
  },
};

// Cross-tab synchronization
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      currentState = getStorageState();
      notify();
    }
  });
}
