import type { MatchResult, Scholarship, UserProfile } from "./types";

const STEM_KEYWORDS = ["computer", "tech", "engineering", "stem", "math", "data", "science", "physics", "ai", "software"];
const BUSINESS_KEYWORDS = ["business", "management", "finance", "economics", "accounting", "mba"];
const MEDICINE_KEYWORDS = ["medicine", "medical", "health", "pharmacy", "biomedical", "clinical", "nursing", "doctor"];
const LAW_KEYWORDS = ["law", "legal", "justice", "human rights", "jurisprudence", "llm", "clat"];
const ARTS_KEYWORDS = ["art", "design", "humanities", "music", "literature", "theater", "creative", "film"];
const SOCIAL_KEYWORDS = ["social", "policy", "politics", "education", "development", "sociology", "government", "civic"];

function matchesField(userField: string, scholarshipField: string): boolean {
  if (scholarshipField === "Any") return true;
  const user = userField.toLowerCase();
  const sch = scholarshipField.toLowerCase();

  if (user === sch || user.includes(sch) || sch.includes(user)) return true;

  if (scholarshipField === "STEM") {
    return STEM_KEYWORDS.some((kw) => user.includes(kw));
  }
  if (scholarshipField === "Business") {
    return BUSINESS_KEYWORDS.some((kw) => user.includes(kw));
  }
  if (scholarshipField === "Medicine") {
    return MEDICINE_KEYWORDS.some((kw) => user.includes(kw));
  }
  if (scholarshipField === "Law") {
    return LAW_KEYWORDS.some((kw) => user.includes(kw));
  }
  if (scholarshipField === "Arts") {
    return ARTS_KEYWORDS.some((kw) => user.includes(kw));
  }
  if (scholarshipField === "Social Sciences") {
    return SOCIAL_KEYWORDS.some((kw) => user.includes(kw));
  }

  return false;
}

/**
 * Pure, dependency-free matching algorithm.
 * Scores a scholarship against a user profile (0 - 100) and returns structured reasons.
 */
export function scoreMatch(
  scholarship: Scholarship,
  profile?: UserProfile | null
): MatchResult {
  if (!profile) {
    return {
      score: 0,
      reasons: [],
    };
  }

  let totalScore = 0;
  const reasons: { label: string; met: boolean }[] = [];

  // 1. Education Level (25 points)
  const userLevel = (profile.educationLevel || "").toLowerCase();
  const schLevel = scholarship.level.toLowerCase();
  const levelMatch = userLevel.includes(schLevel) || schLevel.includes(userLevel);

  if (levelMatch) {
    totalScore += 25;
    reasons.push({
      label: `Matches your education level (${scholarship.level})`,
      met: true,
    });
  } else {
    reasons.push({
      label: `For ${scholarship.level} students (your profile: ${profile.educationLevel || "Not set"})`,
      met: false,
    });
  }

  // 2. Field of Study (25 points)
  const fieldMatch = matchesField(profile.fieldOfStudy || "", scholarship.field);
  if (fieldMatch) {
    totalScore += 25;
    reasons.push({
      label: scholarship.field === "Any"
        ? "Open to all disciplines and fields of study"
        : `Directly matches ${scholarship.field} focus`,
      met: true,
    });
  } else {
    reasons.push({
      label: `Requires ${scholarship.field} degree (your field: ${profile.fieldOfStudy || "Not set"})`,
      met: false,
    });
  }

  // 3. Country / Region (20 points)
  const userCountry = (profile.country || "").toLowerCase();
  const schCountry = scholarship.country.toLowerCase();
  const countryMatch = schCountry === "global" || userCountry === schCountry || userCountry.includes(schCountry);

  if (countryMatch) {
    totalScore += 20;
    reasons.push({
      label: scholarship.country === "Global"
        ? "Global citizenship eligibility"
        : `Citizenship or residence in ${scholarship.country}`,
      met: true,
    });
  } else {
    reasons.push({
      label: `Tenable in ${scholarship.country} (your profile: ${profile.country || "Not set"})`,
      met: false,
    });
  }

  // 4. GPA Evaluation (15 points)
  if (scholarship.minGpa === null) {
    totalScore += 15;
    reasons.push({
      label: "No minimum GPA cutoff required",
      met: true,
    });
  } else {
    const userGpaNum = profile.gpa ? parseFloat(profile.gpa) : null;
    if (userGpaNum !== null && !isNaN(userGpaNum)) {
      if (userGpaNum >= scholarship.minGpa) {
        totalScore += 15;
        reasons.push({
          label: `Your GPA (${userGpaNum.toFixed(2)}) meets minimum requirement (${scholarship.minGpa.toFixed(1)})`,
          met: true,
        });
      } else {
        reasons.push({
          label: `Minimum GPA ${scholarship.minGpa.toFixed(1)} required (your profile: ${userGpaNum.toFixed(2)})`,
          met: false,
        });
      }
    } else {
      totalScore += 8;
      reasons.push({
        label: `Minimum GPA ${scholarship.minGpa.toFixed(1)} required (GPA not recorded in profile)`,
        met: true,
      });
    }
  }

  // 5. Need & Scholarship Type (15 points)
  if (scholarship.type === "Need-based") {
    if (profile.financialNeed) {
      totalScore += 15;
      reasons.push({
        label: "Demonstrated financial need priority aligns with your profile",
        met: true,
      });
    } else {
      reasons.push({
        label: "Need-based grant requires demonstrated financial hardship",
        met: false,
      });
    }
  } else {
    totalScore += 15;
    reasons.push({
      label: `${scholarship.type} award open to qualifying candidates`,
      met: true,
    });
  }

  return {
    score: Math.min(100, Math.max(0, Math.round(totalScore))),
    reasons,
  };
}
