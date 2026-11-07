export type TrackingStatus =
  | "saved"
  | "preparing"
  | "applied"
  | "awarded"
  | "closed";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: number;
  currency: CurrencyCode;
  deadline: string; // ISO date string: YYYY-MM-DD
  description: string;
  educationLevels: string[];
  fieldOfStudy: string[];
  eligibility: string[];
  requiredDocuments: string[];
  country: string;
  applicationUrl: string;
  isNeedBased: boolean;
  isMeritBased: boolean;
  isFeatured?: boolean;
}

export interface TrackedItem {
  scholarshipId: string;
  status: TrackingStatus;
  checklist: Record<string, boolean>;
  notes: string;
  addedAt: string; // ISO timestamp
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  educationLevel: string;
  fieldOfStudy: string;
  country: string;
  gpa?: string;
  financialNeed: boolean;
  interests: string[];
}

export interface ScholarshipFilters {
  search: string;
  educationLevels: string[];
  fieldsOfStudy: string[];
  currencies: CurrencyCode[];
  minAmount: number;
  maxAmount: number;
  onlyEligible: boolean;
  status?: TrackingStatus | "all";
  sortBy: "deadline-soonest" | "amount-high" | "amount-low" | "match-score" | "title-az";
}

export interface TrackerStoreState {
  version: number;
  profile: UserProfile;
  tracked: Record<string, TrackedItem>;
}
