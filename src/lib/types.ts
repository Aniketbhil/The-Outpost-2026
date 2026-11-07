export type TrackingStatus =
  | "saved"
  | "preparing"
  | "applied"
  | "awarded"
  | "closed";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

export type CoverageType =
  | "Full tuition"
  | "Partial tuition"
  | "Stipend"
  | "Full ride";

export type EducationLevel =
  | "High School"
  | "Undergraduate"
  | "Postgraduate"
  | "PhD";

export type StudyField =
  | "STEM"
  | "Arts"
  | "Business"
  | "Medicine"
  | "Law"
  | "Social Sciences"
  | "Any";

export type FieldOfStudy = StudyField;

export type ScholarshipType =
  | "Merit"
  | "Need-based"
  | "Diversity"
  | "Sports"
  | "Research";

export interface Scholarship {
  id: string;
  slug: string;
  name: string;
  provider: string;
  amount: number;
  currency: CurrencyCode;
  coverage: CoverageType;
  level: EducationLevel;
  field: StudyField;
  country: string;
  type: ScholarshipType;
  deadline: string; // FIXED ISO date: YYYY-MM-DD
  renewable: boolean;
  minGpa: number | null;
  summary: string;
  description: string;
  eligibility: string[];
  documents: string[];
  steps: string[];
  estimatedMinutes: number;
  applyUrl: string;
  featured: boolean;
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
  educationLevel: EducationLevel | string;
  fieldOfStudy: StudyField | string;
  country: string;
  gpa?: string;
  financialNeed: boolean;
  interests: string[];
}

export interface MatchReason {
  label: string;
  met: boolean;
}

export interface MatchResult {
  score: number; // 0 - 100
  reasons: MatchReason[];
}

export interface ScholarshipFilters {
  search: string;
  levels: EducationLevel[];
  fields: StudyField[];
  countries: string[];
  currencies: CurrencyCode[];
  types: ScholarshipType[];
  coverages: CoverageType[];
  minAmount: number;
  maxAmount: number;
  onlyEligible: boolean;
  status?: TrackingStatus | "all";
  sortBy: "deadline-soonest" | "amount-high" | "amount-low" | "match-score" | "name-az";
}

export interface TrackerStoreState {
  version: number;
  profile: UserProfile;
  tracked: Record<string, TrackedItem>;
}
