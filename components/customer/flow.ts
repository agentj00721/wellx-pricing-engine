/**
 * Customer flow — B2B lead capture.
 *
 * The customer doesn't see pricing. They tell us about their team and what
 * they need, and the Wellx team picks it up to apply pricing from the grid.
 */

export type ForWho = "self" | "team";

export type BusinessGoal =
  | "know-team"
  | "retention"
  | "engagement"
  | "claims"
  | "differentiation";

export type SourcingMethod = "insurer" | "direct";

export type InsurerId = "qic" | "liva" | "dni" | "salama" | "adnt" | "other";

export type CustomerLead = {
  forWho?: ForWho;

  // team path
  goals: BusinessGoal[];
  sourcing?: SourcingMethod;
  insurer?: InsurerId;
  insurerOtherName?: string;
  brokerName?: string;
  brokerEmail?: string;
  brokerPhone?: string;
  companyName?: string;
  authorizeWellxContact?: boolean;
  totalPeople: number;
  employeeCount?: number;
  dependantCount?: number;
  addOnModules: string[];

  // contact (collected at review)
  contactName?: string;
  contactEmail?: string;
  contactRole?: string;
  notes?: string;
};

export const initialLead: CustomerLead = {
  totalPeople: 50,
  employeeCount: 25,
  dependantCount: 25,
  goals: [],
  addOnModules: [],
};

/* ────────────── Goal options ────────────── */

export type GoalOption = {
  id: BusinessGoal;
  title: string;
  description: string;
  badge: string;
  accent: "warm" | "cool";
  featured?: boolean;
};

export const GOALS: GoalOption[] = [
  {
    id: "know-team",
    title: "Get to know my team better",
    description:
      "A behavioural layer that surfaces how people actually feel — so you can act on it.",
    badge: "Most popular",
    accent: "warm",
    featured: true,
  },
  {
    id: "retention",
    title: "Retain talent",
    description:
      "Reduce churn, lift employer brand, win the talent war.",
    badge: "Talent",
    accent: "warm",
  },
  {
    id: "engagement",
    title: "Drive engagement",
    description:
      "Get high utilisation across your whole population, not just the worried-well.",
    badge: "Adoption",
    accent: "warm",
  },
  {
    id: "claims",
    title: "Bend the claims curve",
    description:
      "Lower medical inflation and the downstream catastrophic claims.",
    badge: "Economics",
    accent: "cool",
  },
  {
    id: "differentiation",
    title: "Differentiate",
    description: "Stand out as an employer — a real premium benefits proposition.",
    badge: "Brand",
    accent: "cool",
  },
];

/* ────────────── Insurer options ────────────── */

export const INSURERS: {
  id: InsurerId;
  label: string;
  short: string;
  arranged: boolean;
}[] = [
  { id: "qic", label: "Qatar Insurance Company", short: "QIC", arranged: true },
  { id: "liva", label: "Liva", short: "Liva", arranged: true },
  { id: "dni", label: "Dubai National Insurance", short: "DNI", arranged: true },
  { id: "salama", label: "Salama UAE", short: "Salama", arranged: true },
  {
    id: "adnt",
    label: "Abu Dhabi National Takaful",
    short: "ADNT",
    arranged: true,
  },
  { id: "other", label: "Other", short: "Other", arranged: false },
];

/* ────────────── Add-on modules ────────────── */

export type AddOnModule = {
  id: string;
  label: string;
  description: string;
  available: boolean;
};

export const ADD_ON_MODULES: AddOnModule[] = [
  {
    id: "wellx-jr",
    label: "Wellx Jr",
    description:
      "Fun challenges and exercises for children ages 5–13. Make wellness a family thing.",
    available: true,
  },
  {
    id: "white-label",
    label: "White-Label",
    description:
      "The app becomes your own branded employee engagement and wellness ecosystem.",
    available: true,
  },
  {
    id: "care-paths",
    label: "Wellx Care Paths",
    description:
      "Clinical pathways for people managing diabetes, hypertension, and blood pressure.",
    available: false,
  },
  {
    id: "wellx-women",
    label: "Wellx for Women",
    description:
      "Support across the full lifecycle — from first cycle through menopause and everything in between.",
    available: false,
  },
  {
    id: "wellx-pet",
    label: "Wellx Pet",
    description:
      "Family includes the furry ones too — wellbeing for pets, alongside the humans.",
    available: false,
  },
  {
    id: "benefits-mgmt",
    label: "Benefits Management System",
    description:
      "Manage employee benefits beyond traditional insurance — in one place.",
    available: false,
  },
];

/* ────────────── Step orchestration ────────────── */

export type StepId =
  | "welcome"
  | "self-end"
  | "goal"
  | "sourcing"
  | "modules"
  | "people"
  | "review";

export type StepDescriptor = {
  id: StepId;
  label: string;
  description?: string;
};

/** Steps for the active path, given current state. */
export function getSteps(lead: CustomerLead): StepDescriptor[] {
  if (!lead.forWho) {
    return [{ id: "welcome", label: "Start", description: "Tell us who this is for" }];
  }
  if (lead.forWho === "self") {
    return [
      { id: "welcome", label: "Start" },
      { id: "self-end", label: "About Wellx for individuals" },
    ];
  }
  return [
    { id: "welcome", label: "Start", description: "Who's this for" },
    { id: "goal", label: "Your goal", description: "What matters most" },
    {
      id: "sourcing",
      label: "Sourcing",
      description: "Insurer or direct",
    },
    { id: "modules", label: "Modules", description: "Standard + add-ons" },
    { id: "people", label: "Your people", description: "Size + breakdown" },
    { id: "review", label: "Review & submit", description: "Send to Wellx" },
  ];
}

/* ────────────── Validation ────────────── */

export function canAdvance(stepId: StepId, lead: CustomerLead): boolean {
  switch (stepId) {
    case "welcome":
      return !!lead.forWho;
    case "self-end":
      return false; // terminal
    case "goal":
      return lead.goals.length > 0;
    case "sourcing": {
      if (!lead.sourcing) return false;
      if (lead.sourcing === "direct") return true;
      // insurer path requires picking one
      if (!lead.insurer) return false;
      if (lead.insurer === "other") {
        return (
          !!lead.insurerOtherName?.trim() &&
          !!lead.brokerName?.trim() &&
          isValidEmail(lead.brokerEmail) &&
          isValidPhone(lead.brokerPhone)
        );
      }
      // Listed insurer: broker details optional, but if any email/phone is
      // provided it must be well-formed.
      if (lead.brokerEmail && !isValidEmail(lead.brokerEmail)) return false;
      if (lead.brokerPhone && !isValidPhone(lead.brokerPhone)) return false;
      return true;
    }
    case "modules":
      return true; // modules are optional
    case "people":
      return (
        (lead.totalPeople ?? 0) >= 10 &&
        (lead.totalPeople ?? 0) <= 10000
      );
    case "review":
      return (
        !!lead.contactName?.trim() &&
        !!lead.companyName?.trim() &&
        isValidEmail(lead.contactEmail)
      );
    default:
      return false;
  }
}

export function isValidEmail(v: string | undefined): boolean {
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function isValidPhone(v: string | undefined): boolean {
  if (!v) return false;
  // Accept digits, spaces, dashes, parentheses, leading +. Require at least 7 digits.
  const trimmed = v.trim();
  if (!/^\+?[\d\s\-().]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/* ────────────── Submission payload ────────────── */

export function leadToPayload(lead: CustomerLead) {
  return {
    for_who: lead.forWho ?? null,
    goals: lead.goals,
    sourcing: lead.sourcing ?? null,
    insurer: lead.insurer ?? null,
    insurer_other_name: lead.insurerOtherName ?? null,
    broker_name: lead.brokerName ?? null,
    broker_email: lead.brokerEmail ?? null,
    broker_phone: lead.brokerPhone ?? null,
    company_name: lead.companyName ?? null,
    authorize_wellx_contact: lead.authorizeWellxContact ?? false,
    total_people: lead.totalPeople,
    employee_count: lead.employeeCount ?? null,
    dependant_count: lead.dependantCount ?? null,
    add_on_modules: lead.addOnModules,
    contact_name: lead.contactName ?? null,
    contact_email: lead.contactEmail ?? null,
    contact_role: lead.contactRole ?? null,
    notes: lead.notes ?? null,
  };
}
