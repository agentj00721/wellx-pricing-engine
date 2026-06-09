/**
 * Customer flow — lead capture.
 *
 * The customer sees indicative pricing (Wellx Core + add-ons). They tell
 * us about their team, and the Wellx team picks it up to apply the actual
 * price (including any discounts) before sending a proposal.
 */

export type ForWho = "self" | "team";

export type BusinessGoal =
  | "know-team"
  | "retention"
  | "engagement"
  | "claims"
  | "differentiation"
  | "change-provider";

export type SourcingMethod = "insurer" | "broker" | "direct";

export type Country = "uae" | "ksa" | "ph";

export type InsurerId = "qic" | "liva" | "dni" | "salama" | "adnt" | "other";

export type KsaBrokerId = "elite" | "marsh" | "other";

export type CustomerLead = {
  forWho?: ForWho;

  // shared
  goals: BusinessGoal[];
  country?: Country;
  sourcing?: SourcingMethod;
  insurer?: InsurerId;
  insurerOtherName?: string;
  ksaBroker?: KsaBrokerId;
  brokerName?: string;
  brokerEmail?: string;
  brokerPhone?: string;
  companyName?: string;
  authorizeWellxContact?: boolean;
  totalPeople: number;
  employeeCount?: number;
  dependantCount?: number;
  addOnModules: string[];

  // contact (collected at review for team path; on self path it's collected
  // upfront on the self-contact step)
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactRole?: string;
  hrContactEmail?: string;
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
  {
    id: "change-provider",
    title: "Change provider",
    description:
      "I already have a wellbeing platform — I'm looking for a better one.",
    badge: "Switch",
    accent: "cool",
  },
];

/* ────────────── Country + sourcing arrangements ────────────── */

export const COUNTRIES: { id: Country; label: string; flag: string }[] = [
  { id: "uae", label: "United Arab Emirates", flag: "🇦🇪" },
  { id: "ksa", label: "Saudi Arabia", flag: "🇸🇦" },
  { id: "ph", label: "Philippines", flag: "🇵🇭" },
];

export const KSA_BROKERS: {
  id: KsaBrokerId;
  label: string;
  short: string;
  arranged: boolean;
}[] = [
  { id: "elite", label: "Elite", short: "Elite", arranged: true },
  { id: "marsh", label: "Marsh", short: "Marsh", arranged: true },
  { id: "other", label: "Other", short: "Other", arranged: false },
];

/**
 * Returns true if we have an arrangement with insurer-channel partners in
 * the given country. Today only the UAE has insurer arrangements.
 */
export function hasInsurerArrangements(country: Country | undefined): boolean {
  return country === "uae";
}

/**
 * Returns true if we have an arrangement with broker-channel partners in
 * the given country. Today only KSA has broker arrangements.
 */
export function hasBrokerArrangements(country: Country | undefined): boolean {
  return country === "ksa";
}

/* ────────────── Insurer options (UAE only) ────────────── */

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
  | "self-contact"
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
      { id: "welcome", label: "Start", description: "Tell us who this is for" },
      { id: "self-contact", label: "About you", description: "Your details" },
      { id: "self-end", label: "Next steps", description: "Get your HR involved" },
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
    case "self-contact":
      return (
        !!lead.contactName?.trim() &&
        !!lead.companyName?.trim() &&
        isValidEmail(lead.contactEmail) &&
        (!lead.contactPhone || isValidPhone(lead.contactPhone)) &&
        (!lead.hrContactEmail || isValidEmail(lead.hrContactEmail))
      );
    case "self-end":
      return false; // terminal
    case "goal":
      return lead.goals.length > 0;
    case "sourcing": {
      if (!lead.country) return false;
      if (!lead.sourcing) return false;
      if (lead.sourcing === "direct") return true;

      const optionalEmailOk = !lead.brokerEmail || isValidEmail(lead.brokerEmail);
      const optionalPhoneOk = !lead.brokerPhone || isValidPhone(lead.brokerPhone);

      if (lead.sourcing === "insurer") {
        if (hasInsurerArrangements(lead.country)) {
          if (!lead.insurer) return false;
          if (lead.insurer === "other") {
            return (
              !!lead.insurerOtherName?.trim() &&
              !!lead.brokerName?.trim() &&
              isValidEmail(lead.brokerEmail) &&
              isValidPhone(lead.brokerPhone)
            );
          }
          // Listed insurer: broker fields optional, but well-formed if typed
          return optionalEmailOk && optionalPhoneOk;
        }
        // No insurer arrangements in this country — free entry of insurer name
        return (
          !!lead.insurerOtherName?.trim() &&
          optionalEmailOk &&
          optionalPhoneOk
        );
      }

      if (lead.sourcing === "broker") {
        if (hasBrokerArrangements(lead.country)) {
          if (!lead.ksaBroker) return false;
          if (lead.ksaBroker === "other") {
            return (
              !!lead.brokerName?.trim() &&
              isValidEmail(lead.brokerEmail) &&
              isValidPhone(lead.brokerPhone)
            );
          }
          // Listed broker: still want their specific rep's contact details
          return (
            !!lead.brokerName?.trim() &&
            isValidEmail(lead.brokerEmail) &&
            isValidPhone(lead.brokerPhone)
          );
        }
        // No broker arrangements in this country — full broker details
        return (
          !!lead.brokerName?.trim() &&
          isValidEmail(lead.brokerEmail) &&
          isValidPhone(lead.brokerPhone)
        );
      }
      return false;
    }
    case "modules":
      return true; // add-ons are optional
    case "people":
      return (
        (lead.totalPeople ?? 0) >= 10 &&
        (lead.totalPeople ?? 0) <= 10000
      );
    case "review":
      return (
        !!lead.contactName?.trim() &&
        !!lead.companyName?.trim() &&
        isValidEmail(lead.contactEmail) &&
        (!lead.contactPhone || isValidPhone(lead.contactPhone))
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
    country: lead.country ?? null,
    sourcing: lead.sourcing ?? null,
    insurer: lead.insurer ?? null,
    insurer_other_name: lead.insurerOtherName ?? null,
    ksa_broker: lead.ksaBroker ?? null,
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
    contact_phone: lead.contactPhone ?? null,
    contact_role: lead.contactRole ?? null,
    hr_contact_email: lead.hrContactEmail ?? null,
    notes: lead.notes ?? null,
  };
}
