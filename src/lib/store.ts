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
      "Financial Assessment": true,
      "Proof of Enrollment": true,
      "Academic Reference": true,
    },
    notes: "Award notification received! Disbursement scheduled for Spring 2027.",
    addedAt: "2026-09-10T11:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
  },
  "sch-5": {
    scholarshipId: "sch-5",
    status: "closed",
    checklist: {
      "Research Proposal": true,
      "Faculty Letter": true,
    },
    notes: "Deadline passed for the 2026 cohort. Target for next cycle.",
    addedAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-09-15T12:00:00.000Z",
  },
};

export const DEFAULT_STATE: TrackerStoreState = {
  version: 1,
  profile: DEFAULT_PROFILE,
  tracked: DEMO_TRACKED_ITEMS,
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

export const VALID_STATUSES: readonly TrackingStatus[] = [
  "saved",
  "preparing",
  "applied",
  "awarded",
  "closed",
];

export function isValidTrackedItem(item: unknown): item is TrackedItem {
  if (!item || typeof item !== "object") return false;
  const o = item as Record<string, unknown>;
  return (
    typeof o.scholarshipId === "string" &&
    typeof o.status === "string" &&
    VALID_STATUSES.includes(o.status as TrackingStatus) &&
    typeof o.checklist === "object" &&
    o.checklist !== null &&
    typeof o.notes === "string"
  );
}

export function isValidProfile(profile: unknown): profile is UserProfile {
  if (!profile || typeof profile !== "object") return false;
  const p = profile as Record<string, unknown>;
  return (
    typeof p.educationLevel === "string" &&
    typeof p.fieldOfStudy === "string" &&
    typeof p.country === "string" &&
    typeof p.gpa === "string" &&
    typeof p.financialNeed === "boolean"
  );
}

export function isValidStoreState(state: unknown): state is TrackerStoreState {
  if (!state || typeof state !== "object") return false;
  const s = state as Record<string, unknown>;
  if (s.version !== 1 || !s.tracked || typeof s.tracked !== "object") {
    return false;
  }

  for (const [id, item] of Object.entries(s.tracked as Record<string, unknown>)) {
    if (typeof id !== "string" || !isValidTrackedItem(item)) {
      return false;
    }
  }

  if (s.profile && !isValidProfile(s.profile)) {
    return false;
  }

  return true;
}

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
    if (isValidStoreState(parsed)) {
      return parsed;
    }
    // Corrupted state or version mismatch: clear storage and return default
    window.localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_STATE;
  } catch {
    // Handled safely if localStorage is restricted (private browsing / quota exceeded)
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // In-memory fallback
    }
    return DEFAULT_STATE;
  }
}

function persistState(state: TrackerStoreState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Graceful in-memory operation if quota exceeded or storage disabled
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

      const currentChecked = Boolean(existing.checklist[docName]);
      return {
        ...prev,
        tracked: {
          ...prev.tracked,
          [scholarshipId]: {
            ...existing,
            checklist: {
              ...existing.checklist,
              [docName]: !currentChecked,
            },
            updatedAt: now,
          },
        },
      };
    });
  },

  setNotes(scholarshipId: string, notes: string) {
    const now = new Date().toISOString();
    // Safety: limit notes length to 5000 characters and ensure string type
    const sanitizedNotes = typeof notes === "string" ? notes.slice(0, 5000) : "";
    setState((prev) => {
      const existing = prev.tracked[scholarshipId];
      if (!existing) return prev;

      return {
        ...prev,
        tracked: {
          ...prev.tracked,
          [scholarshipId]: {
            ...existing,
            notes: sanitizedNotes,
            updatedAt: now,
          },
        },
      };
    });
  },

  // Profile Actions
  updateProfile(profile: Partial<UserProfile>) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profile,
      },
    }));
  },

  clearProfile() {
    setState((prev) => ({
      ...prev,
      profile: {
        name: "",
        educationLevel: "",
        fieldOfStudy: "",
        country: "",
        gpa: "",
        financialNeed: false,
        interests: [],
      },
    }));
  },

  resetProfile() {
    this.clearProfile();
  },

  // Bulk Operations
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
};
