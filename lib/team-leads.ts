import {
  calcIndicativeMonthly,
  type PricingConfig,
} from "@/lib/pricing";

/** Mirror of the leads.status enum. Order matters — it's the pipeline. */
export const LEAD_STATUSES = [
  "submitted",
  "triaged",
  "qualified",
  "priced",
  "proposed",
  "won",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number] | "lost" | "archived";

export type Lead = {
  id: string;
  reference: string;
  status: LeadStatus;
  for_who: "self" | "team" | null;
  country: "uae" | "ksa" | "ph" | null;
  goals: string[] | null;
  sourcing: "insurer" | "broker" | "direct" | null;
  insurer: string | null;
  insurer_other_name: string | null;
  ksa_broker: string | null;
  broker_name: string | null;
  broker_email: string | null;
  broker_phone: string | null;
  company_name: string | null;
  authorize_wellx_contact: boolean | null;
  total_people: number;
  employee_count: number | null;
  dependant_count: number | null;
  add_on_modules: string[];
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_role: string | null;
  hr_contact_email: string | null;
  notes: string | null;
  discount_pct: number;
  pricing_pmpm: number | null;
  pricing_monthly: number | null;
  internal_notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  priced_at: string | null;
  proposed_at: string | null;
};

/** Team-side discount cap (mirrors the API). Will move to Founders config. */
export const TEAM_DISCOUNT_CAP_PCT = 10;

/** Columns by status label for the kanban view. */
export const STATUS_META: Record<
  (typeof LEAD_STATUSES)[number],
  { label: string; tone: "neutral" | "warm" | "cool" | "success" }
> = {
  submitted: { label: "Submitted", tone: "neutral" },
  triaged: { label: "Triaged", tone: "neutral" },
  qualified: { label: "Qualified", tone: "cool" },
  priced: { label: "Priced", tone: "warm" },
  proposed: { label: "Proposed", tone: "warm" },
  won: { label: "Won", tone: "success" },
};

export type ProposalNumbers = {
  /** Per-member-per-month BEFORE discount. */
  listPmpm: number;
  /** Per-member-per-month AFTER discount. */
  netPmpm: number;
  /** Monthly subscription before discount. */
  listMonthly: number;
  /** Monthly subscription after discount. */
  netMonthly: number;
  /** Annual subscription after discount. */
  annualNet: number;
  /** One-time fees (e.g. white-label). */
  oneTime: number;
  /** Annual + one-time (TCV proxy for a 1-year deal). */
  tcv: number;
  /** Discount applied as % */
  discountPct: number;
  /** Discount amount in monthly terms */
  discountMonthly: number;
};

/** Computes the proposal numbers given a lead + pricing + discount. */
export function calcProposal(
  lead: Pick<Lead, "total_people" | "add_on_modules">,
  pricing: PricingConfig,
  discountPct: number,
): ProposalNumbers {
  const { monthlyPmpm, oneTime } = calcIndicativeMonthly(
    lead.total_people,
    lead.add_on_modules ?? [],
    pricing,
  );
  const discountClamped = Math.max(0, Math.min(TEAM_DISCOUNT_CAP_PCT, discountPct));
  const netPmpm = monthlyPmpm * (1 - discountClamped / 100);
  const listMonthly = monthlyPmpm * lead.total_people;
  const netMonthly = netPmpm * lead.total_people;
  const annualNet = netMonthly * 12;
  return {
    listPmpm: round2(monthlyPmpm),
    netPmpm: round2(netPmpm),
    listMonthly: round2(listMonthly),
    netMonthly: round2(netMonthly),
    annualNet: round2(annualNet),
    oneTime: round2(oneTime),
    tcv: round2(annualNet + oneTime),
    discountPct: discountClamped,
    discountMonthly: round2(listMonthly - netMonthly),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function shortLabel(lead: Lead): string {
  if (lead.company_name?.trim()) return lead.company_name;
  if (lead.contact_name?.trim()) return lead.contact_name;
  return lead.reference;
}

export function countryFlag(c: Lead["country"]): string {
  if (c === "uae") return "🇦🇪";
  if (c === "ksa") return "🇸🇦";
  if (c === "ph") return "🇵🇭";
  return "";
}

export function sourcingLabel(lead: Lead): string {
  if (!lead.sourcing) return "—";
  if (lead.sourcing === "direct") return "Direct";
  if (lead.sourcing === "insurer") {
    if (lead.insurer && lead.insurer !== "other") return lead.insurer.toUpperCase();
    if (lead.insurer_other_name) return lead.insurer_other_name;
    return "Insurer";
  }
  if (lead.ksa_broker && lead.ksa_broker !== "other") {
    return lead.ksa_broker.charAt(0).toUpperCase() + lead.ksa_broker.slice(1);
  }
  if (lead.broker_name) return lead.broker_name;
  return "Broker";
}

export function daysSince(iso: string): number {
  const ts = new Date(iso).getTime();
  if (!Number.isFinite(ts)) return 0;
  return Math.max(0, Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24)));
}
