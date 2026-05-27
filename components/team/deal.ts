export type DealStage =
  | "qualified"
  | "discovery"
  | "shaping"
  | "pricing"
  | "redlines"
  | "won";

export type DealType = "direct" | "broker" | "white-label" | "embedded";

export type DealState = {
  account: string;
  region: string;
  stage: DealStage;
  type: DealType;
  members: number;
  segment: "executive" | "professional" | "frontline" | "mixed";
  stack: "essentials" | "elevate" | "executive" | "custom";
  contractMonths: 12 | 24 | 36;
  discountPct: number;
  brokerSharePct: number;
  setupFee: number;
  modules: string[];
};

export const STAGES: { id: DealStage; label: string }[] = [
  { id: "qualified", label: "Qualified" },
  { id: "discovery", label: "Discovery" },
  { id: "shaping", label: "Shaping" },
  { id: "pricing", label: "Pricing" },
  { id: "redlines", label: "Redlines" },
  { id: "won", label: "Won" },
];

export const initialDeal: DealState = {
  account: "Aurora Capital",
  region: "UAE",
  stage: "pricing",
  type: "broker",
  members: 480,
  segment: "professional",
  stack: "elevate",
  contractMonths: 24,
  discountPct: 6,
  brokerSharePct: 8,
  setupFee: 12000,
  modules: ["primary-care", "mental-health", "chronic-care", "women-health"],
};

export const BASE_PRICES: Record<DealState["stack"], number> = {
  essentials: 38,
  elevate: 62,
  executive: 108,
  custom: 84,
};

export const SEGMENT_MULT: Record<DealState["segment"], number> = {
  executive: 1.22,
  professional: 1.04,
  frontline: 0.92,
  mixed: 1.0,
};

export const TERM_MULT: Record<DealState["contractMonths"], number> = {
  12: 1.0,
  24: 0.96,
  36: 0.92,
};

export function calcDeal(d: DealState) {
  const base = BASE_PRICES[d.stack];
  const moduleDelta = d.modules.length * 7;
  const pmpm =
    (base + moduleDelta) *
    SEGMENT_MULT[d.segment] *
    TERM_MULT[d.contractMonths];
  const list = pmpm * d.members;
  const discount = list * (d.discountPct / 100);
  const net = list - discount;
  const brokerFee = net * (d.brokerSharePct / 100);
  const wellxNet = net - brokerFee;
  const annualWellxNet = wellxNet * 12;
  const tcv = annualWellxNet * (d.contractMonths / 12) + d.setupFee;
  const grossMargin = 0.42 + (d.stack === "executive" ? 0.06 : 0) -
    (d.discountPct > 10 ? 0.04 : 0);

  return {
    pmpm: Math.round(pmpm),
    listMonthly: Math.round(list),
    discountAmount: Math.round(discount),
    netMonthly: Math.round(net),
    brokerFee: Math.round(brokerFee),
    wellxNetMonthly: Math.round(wellxNet),
    annualWellxNet: Math.round(annualWellxNet),
    tcv: Math.round(tcv),
    grossMargin,
  };
}

export type Guardrail = {
  id: string;
  severity: "info" | "warning" | "danger";
  title: string;
  body: string;
};

export function evaluateGuardrails(d: DealState): Guardrail[] {
  const out: Guardrail[] = [];
  if (d.discountPct > 12) {
    out.push({
      id: "discount-cap",
      severity: "danger",
      title: "Discount exceeds delegated authority",
      body: `Discount of ${d.discountPct}% is above the 12% AE cap. Escalate to Commercial Council before sending.`,
    });
  } else if (d.discountPct > 8) {
    out.push({
      id: "discount-warn",
      severity: "warning",
      title: "Discount in review band",
      body: `${d.discountPct}% triggers mandatory deal-desk review. Capture justification in the deal log.`,
    });
  }
  if (d.brokerSharePct > 10) {
    out.push({
      id: "broker-share",
      severity: "warning",
      title: "Broker share above benchmark",
      body: `Broker share of ${d.brokerSharePct}% is above the typical 6–10% band for ${d.region}.`,
    });
  }
  if (d.members < 100 && d.stack === "executive") {
    out.push({
      id: "stack-fit",
      severity: "info",
      title: "Small population on Executive stack",
      body: "Executive stack typically lands best at 200+ members. Confirm fit with the customer.",
    });
  }
  if (d.contractMonths === 12 && d.stack !== "essentials") {
    out.push({
      id: "term",
      severity: "info",
      title: "Short term on full stack",
      body: "12-month term limits clinical pathway maturity. Offer a 24-month bonus module to lift NRR.",
    });
  }
  return out;
}

export const MODULES_TEAM = [
  { id: "primary-care", label: "Primary Care", delta: 18 },
  { id: "mental-health", label: "Mental Wellbeing", delta: 14 },
  { id: "chronic-care", label: "Chronic Care", delta: 22 },
  { id: "women-health", label: "Women's Health", delta: 16 },
  { id: "musculoskeletal", label: "Musculoskeletal", delta: 12 },
  { id: "occupational", label: "Occupational", delta: 9 },
  { id: "global-coverage", label: "Global Coverage", delta: 26 },
  { id: "executive-health", label: "Executive Health", delta: 38 },
];
