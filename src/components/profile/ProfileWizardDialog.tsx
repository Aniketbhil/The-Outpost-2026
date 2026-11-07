"use client";

import * as React from "react";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Globe,
  Award,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
} from "lucide-react";
import type { EducationLevel, StudyField } from "@/lib/types";

interface ProfileWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileSaved?: () => void;
}

const EDUCATION_LEVELS: { label: EducationLevel; desc: string }[] = [
  { label: "High School", desc: "Grade 11-12 or secondary school completion" },
  { label: "Undergraduate", desc: "Bachelor's degree or 4-year college diploma" },
  { label: "Postgraduate", desc: "Master's degree (M.S., M.Tech, M.A., MBA, LLM)" },
  { label: "PhD", desc: "Doctoral research fellowship or candidate" },
];

const FIELDS_OF_STUDY: { label: StudyField; desc: string }[] = [
  { label: "STEM", desc: "Engineering, Computer Science, Math, Physics, Tech" },
  { label: "Business", desc: "Finance, Management, Economics, Accounting" },
  { label: "Medicine", desc: "Biomedical, Health Sciences, Pharmacy, Clinical" },
  { label: "Social Sciences", desc: "Public Policy, Education, Sociology, Politics" },
  { label: "Law", desc: "Legal Studies, Human Rights, Jurisprudence" },
  { label: "Arts", desc: "Design, Visual Arts, Literature, Humanities" },
  { label: "Any", desc: "Open or interdisciplinary degree" },
];

const COUNTRIES = [
  { code: "India", label: "India", desc: "Eligible for Tata, Reliance, Jindal, Dr. Reddy's & Global" },
  { code: "USA", label: "United States", desc: "Eligible for Gates, Stanford, Columbia & Global" },
  { code: "UK", label: "United Kingdom", desc: "Eligible for Rhodes, Turing, Clarendon & Commonwealth" },
  { code: "Germany", label: "Germany", desc: "Eligible for DAAD, Max Planck, Humboldt, ETH & Global" },
  { code: "Canada", label: "Canada", desc: "Eligible for Toronto, Waterloo IQC & Global" },
  { code: "Global", label: "Other / International", desc: "Access to all open international awards" },
];

const GPA_OPTIONS = [
  { value: "3.90", label: "3.80 – 4.00 (High Distinction / Top 5%)" },
  { value: "3.60", label: "3.50 – 3.79 (Distinction / Top 15%)" },
  { value: "3.20", label: "3.00 – 3.49 (First Class / Above Average)" },
  { value: "2.80", label: "Below 3.00 (Focus on need & non-GPA awards)" },
];

function ProfileWizardForm({
  onClose,
  onProfileSaved,
}: {
  onClose: () => void;
  onProfileSaved?: () => void;
}) {
  const { profile, updateProfile, resetProfile } = useProfile();

  const [step, setStep] = React.useState(1);
  const [level, setLevel] = React.useState<string>(profile.educationLevel || "Undergraduate");
  const [field, setField] = React.useState<string>(profile.fieldOfStudy || "STEM");
  const [country, setCountry] = React.useState<string>(profile.country || "India");
  const [gpa, setGpa] = React.useState<string>(profile.gpa || "3.60");
  const [need, setNeed] = React.useState<boolean>(profile.financialNeed ?? true);

  const handleSave = () => {
    updateProfile({
      educationLevel: level,
      fieldOfStudy: field,
      country,
      gpa,
      financialNeed: need,
    });
    toast.success("Profile saved! Best match scoring activated.");
    onClose();
    onProfileSaved?.();
  };

  const handleClear = () => {
    resetProfile();
    toast.info("Profile cleared. Default view restored.");
    onClose();
  };

  const progressPercent = (step / 4) * 100;

  return (
    <>
      <DialogHeader className="flex flex-col gap-2 pb-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-xs font-semibold text-foreground">
            <Sparkles className="size-3.5 text-accent" />
            <span>Step {step} of 4</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            100% In-Browser Privacy
          </span>
        </div>

        <DialogTitle className="font-heading text-2xl font-bold tracking-tight text-foreground">
          {step === 1 && "What is your current education level?"}
          {step === 2 && "Which academic field are you in?"}
          {step === 3 && "What is your country of residence or citizenship?"}
          {step === 4 && "GPA range & financial need"}
        </DialogTitle>

        <DialogDescription className="text-sm text-muted-foreground">
          {step === 1 && "Matches requirements like high school awards, bachelor's grants, or doctoral fellowships."}
          {step === 2 && "Filters disciplinary scholarships tailored for STEM, business, medicine, law, or arts."}
          {step === 3 && "Unlocks nation-specific trusts (e.g. India, USA, UK) and global applicant pools."}
          {step === 4 && "Tunes cutoffs and highlights need-based versus merit-based funding options."}
        </DialogDescription>

        <Progress value={progressPercent} className="mt-2 h-1.5 bg-muted" />
      </DialogHeader>

      {/* Step 1: Education Level */}
      {step === 1 && (
        <div className="grid grid-cols-1 gap-2.5 py-4">
          {EDUCATION_LEVELS.map((item) => {
            const isSelected = level === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setLevel(item.label)}
                className={`flex items-start justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10 text-foreground ring-1 ring-accent"
                    : "border-border bg-background text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <GraduationCap className={`size-5 mt-0.5 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
                {isSelected ? <Check className="size-4 text-accent mt-0.5" /> : null}
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Field of Study */}
      {step === 2 && (
        <div className="grid grid-cols-1 gap-2.5 py-4 max-h-[50vh] overflow-y-auto pr-1">
          {FIELDS_OF_STUDY.map((item) => {
            const isSelected = field === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setField(item.label)}
                className={`flex items-start justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10 text-foreground ring-1 ring-accent"
                    : "border-border bg-background text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <BookOpen className={`size-5 mt-0.5 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
                {isSelected ? <Check className="size-4 text-accent mt-0.5" /> : null}
              </button>
            );
          })}
        </div>
      )}

      {/* Step 3: Country */}
      {step === 3 && (
        <div className="grid grid-cols-1 gap-2.5 py-4 max-h-[50vh] overflow-y-auto pr-1">
          {COUNTRIES.map((item) => {
            const isSelected = country === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setCountry(item.code)}
                className={`flex items-start justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10 text-foreground ring-1 ring-accent"
                    : "border-border bg-background text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Globe className={`size-5 mt-0.5 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
                {isSelected ? <Check className="size-4 text-accent mt-0.5" /> : null}
              </button>
            );
          })}
        </div>
      )}

      {/* Step 4: GPA & Financial Need */}
      {step === 4 && (
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Award className="size-4 text-accent" />
              <span>Estimated Cumulative GPA (or equivalent)</span>
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {GPA_OPTIONS.map((opt) => {
                const isSelected = gpa === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGpa(opt.value)}
                    className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10 font-semibold text-foreground ring-1 ring-accent"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected ? <Check className="size-4 text-accent" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <Label className="text-sm font-semibold text-foreground">
              Do you have demonstrated financial hardship / Pell / BPL eligibility?
            </Label>
            <RadioGroup
              value={need ? "yes" : "no"}
              onValueChange={(val) => setNeed(val === "yes")}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="need-yes" />
                <Label htmlFor="need-yes" className="cursor-pointer text-sm font-medium">
                  Yes, prioritize need-based grants
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="need-no" />
                <Label htmlFor="need-no" className="cursor-pointer text-sm font-medium">
                  No, open to merit &amp; general
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}

      {/* Action Controls & Footer */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div>
          {step > 1 ? (
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              className="min-h-[44px] gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={handleClear}
              className="min-h-[44px] gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              <span>Clear Profile</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (step < 4) {
                setStep((s) => s + 1);
              } else {
                handleSave();
              }
            }}
            className="min-h-[44px] border-border text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Skip Step
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="min-h-[44px] gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <span>Continue</span>
              <ArrowRight className="size-4 text-accent" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              className="min-h-[44px] gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="size-4 text-accent" />
              <span>Save &amp; Find Matches</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export function ProfileWizardDialog({
  open,
  onOpenChange,
  onProfileSaved,
}: ProfileWizardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl border-border bg-card p-6 sm:p-8">
        {open ? (
          <ProfileWizardForm
            onClose={() => onOpenChange(false)}
            onProfileSaved={onProfileSaved}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
