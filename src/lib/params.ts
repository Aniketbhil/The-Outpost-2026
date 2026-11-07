import type {
  EducationLevel,
  FieldOfStudy,
  ScholarshipType,
  CoverageType,
} from "./types";

export const ALLOWED_LEVELS: readonly EducationLevel[] = [
  "High School",
  "Undergraduate",
  "Postgraduate",
  "PhD",
];

export const ALLOWED_FIELDS: readonly FieldOfStudy[] = [
  "STEM",
  "Arts",
  "Business",
  "Medicine",
  "Law",
  "Social Sciences",
  "Any",
];

export const ALLOWED_COUNTRIES: readonly string[] = [
  "India",
  "USA",
  "UK",
  "Germany",
  "Canada",
  "Global",
];

export const ALLOWED_TYPES: readonly ScholarshipType[] = [
  "Merit",
  "Need-based",
  "Diversity",
  "Sports",
  "Research",
];

export const ALLOWED_COVERAGES: readonly CoverageType[] = [
  "Full tuition",
  "Partial tuition",
  "Stipend",
  "Full ride",
];

export const ALLOWED_DEADLINE_WINDOWS = ["7", "30", "90", "any"] as const;
export type DeadlineWindow = (typeof ALLOWED_DEADLINE_WINDOWS)[number];

export const ALLOWED_SORTS = [
  "match",
  "deadline-soonest",
  "amount-high",
  "easiest",
] as const;
export type SortOption = (typeof ALLOWED_SORTS)[number];

export interface ValidatedParams {
  q: string;
  level: EducationLevel[];
  field: FieldOfStudy[];
  country: string[];
  type: ScholarshipType[];
  coverage: CoverageType[];
  minAmount: number;
  deadlineWindow: DeadlineWindow;
  renewable: boolean | null;
  sort: SortOption;
  page: number;
}

export const DEFAULT_PARAMS: ValidatedParams = {
  q: "",
  level: [],
  field: [],
  country: [],
  type: [],
  coverage: [],
  minAmount: 0,
  deadlineWindow: "any",
  renewable: null,
  sort: "deadline-soonest",
  page: 1,
};

/**
 * Validates and sanitizes apply URLs (strictly http or https)
 */
export function isValidApplyUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Sanitizes search queries: trims, limits to 100 characters, removes control chars
 */
export function sanitizeSearchQuery(q: unknown): string {
  if (typeof q !== "string") return "";
  return q
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim()
    .slice(0, 100);
}

/**
 * Pure function: parses and validates raw search parameters against strict allowlists.
 * Guarantees a fully typed, valid result with zero crashes.
 */
export function parseSearchParams(
  input: URLSearchParams | Record<string, unknown>
): ValidatedParams {
  const getParam = (key: string): string | null => {
    if (input instanceof URLSearchParams) {
      return input.get(key);
    }
    const val = input[key];
    if (Array.isArray(val)) {
      const first = val[0];
      return typeof first === "string" ? first : null;
    }
    return typeof val === "string" ? val : null;
  };

  const getArrayParam = (key: string): string[] => {
    if (input instanceof URLSearchParams) {
      const all = input.getAll(key);
      const first = all[0];
      if (all.length === 1 && first !== undefined && first.includes(",")) {
        return first.split(",").map((s) => s.trim()).filter(Boolean);
      }
      return all.filter(Boolean);
    }
    const val = input[key];
    if (Array.isArray(val)) {
      return val.filter((item): item is string => typeof item === "string" && Boolean(item));
    }
    if (typeof val === "string") {
      return val.includes(",")
        ? val.split(",").map((s) => s.trim()).filter(Boolean)
        : [val.trim()].filter(Boolean);
    }
    return [];
  };

  // 1. Text Search Query
  const rawQ = getParam("q");
  const q = sanitizeSearchQuery(rawQ);

  // 2. Levels
  const rawLevels = getArrayParam("level");
  const level = rawLevels.filter((l): l is EducationLevel =>
    (ALLOWED_LEVELS as readonly string[]).includes(l)
  );

  // 3. Fields
  const rawFields = getArrayParam("field");
  const field = rawFields.filter((f): f is FieldOfStudy =>
    (ALLOWED_FIELDS as readonly string[]).includes(f)
  );

  // 4. Countries
  const rawCountries = getArrayParam("country");
  const country = rawCountries.filter((c) => ALLOWED_COUNTRIES.includes(c));

  // 5. Types
  const rawTypes = getArrayParam("type");
  const type = rawTypes.filter((t): t is ScholarshipType =>
    (ALLOWED_TYPES as readonly string[]).includes(t)
  );

  // 6. Coverages
  const rawCoverages = getArrayParam("coverage");
  const coverage = rawCoverages.filter((c): c is CoverageType =>
    (ALLOWED_COVERAGES as readonly string[]).includes(c)
  );

  // 7. Min Amount (must be non-negative integer <= 100,000)
  const rawMinAmount = getParam("minAmount");
  let minAmount = 0;
  if (rawMinAmount) {
    const parsed = parseInt(rawMinAmount, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      minAmount = Math.min(parsed, 100000);
    }
  }

  // 8. Deadline Window
  const rawDeadline = getParam("deadline");
  const deadlineWindow: DeadlineWindow = (
    ALLOWED_DEADLINE_WINDOWS as readonly string[]
  ).includes(rawDeadline || "")
    ? (rawDeadline as DeadlineWindow)
    : "any";

  // 9. Renewable
  const rawRenewable = getParam("renewable");
  let renewable: boolean | null = null;
  if (rawRenewable === "true" || rawRenewable === "1") renewable = true;
  else if (rawRenewable === "false" || rawRenewable === "0") renewable = false;

  // 10. Sort
  const rawSort = getParam("sort");
  const sort: SortOption = (ALLOWED_SORTS as readonly string[]).includes(
    rawSort || ""
  )
    ? (rawSort as SortOption)
    : "deadline-soonest";

  // 11. Page
  const rawPage = getParam("page");
  let page = 1;
  if (rawPage) {
    const parsed = parseInt(rawPage, 10);
    if (!Number.isNaN(parsed) && parsed >= 1) {
      page = Math.min(parsed, 50);
    }
  }

  return {
    q,
    level,
    field,
    country,
    type,
    coverage,
    minAmount,
    deadlineWindow,
    renewable,
    sort,
    page,
  };
}
