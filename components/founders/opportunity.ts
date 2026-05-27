export type Opportunity = {
  account: string;
  region: string;
  stage: string;
  type: string;
  tcv: number;
  membersK: number;
  closeWindow: string;
  scores: {
    strategicFit: number;
    marketSignal: number;
    economicQuality: number;
    executionRisk: number;
    boardOptics: number;
  };
  decision: "accelerate" | "shape" | "pass";
  decisionNote: string;
};

export const OPPORTUNITY: Opportunity = {
  account: "Aurora Capital",
  region: "UAE",
  stage: "Shaping",
  type: "Broker-led · embedded option",
  tcv: 2_840_000,
  membersK: 0.48,
  closeWindow: "Q3 · 41 days",
  scores: {
    strategicFit: 86,
    marketSignal: 72,
    economicQuality: 64,
    executionRisk: 38,
    boardOptics: 78,
  },
  decision: "accelerate",
  decisionNote:
    "Accelerate. Pricing committee on Thursday. Lever broker relationship into a regional anchor.",
};

export type Level = {
  id: number;
  label: string;
  what: string;
  here: string;
  unlock: string;
};

export const SEVEN_LEVELS: Level[] = [
  {
    id: 1,
    label: "Module",
    what: "A single Wellx clinical module is purchased — primary care, MSK, mental.",
    here: "Mental health + primary care attached",
    unlock: "Adoption + clinical efficacy",
  },
  {
    id: 2,
    label: "Stack",
    what: "Customer composes multiple modules into a coherent stack.",
    here: "Elevate stack, 4 modules live",
    unlock: "Stack economics — bundled PMPM",
  },
  {
    id: 3,
    label: "Pathway",
    what: "Wellx owns the end-to-end care pathway, not just the touch-points.",
    here: "Chronic care pathway under design",
    unlock: "Bend the cost curve",
  },
  {
    id: 4,
    label: "Plan",
    what: "Wellx becomes the underlying health plan layer.",
    here: "—",
    unlock: "Premium float + reserve economics",
  },
  {
    id: 5,
    label: "Network",
    what: "Wellx operates as the preferred provider network across plans.",
    here: "—",
    unlock: "Network rents + steering economics",
  },
  {
    id: 6,
    label: "Operating system",
    what: "The customer's whole benefits and care function runs on Wellx.",
    here: "—",
    unlock: "Margin expansion + retention compounding",
  },
  {
    id: 7,
    label: "Category",
    what: "Wellx is the category in the customer's mind.",
    here: "—",
    unlock: "Brand premium · pricing power",
  },
];

export type Architecture = {
  layer: string;
  status: "live" | "shaping" | "future";
  note: string;
};

export const ARCHITECTURE: Architecture[] = [
  { layer: "Member experience", status: "live", note: "App + concierge co-piloted" },
  { layer: "Care pathways", status: "live", note: "Primary, mental, women's, chronic" },
  { layer: "Clinical engine", status: "live", note: "Owned + partner network" },
  { layer: "Data + insights", status: "shaping", note: "Risk model + claims forecast" },
  { layer: "Cover + commercial", status: "shaping", note: "Broker + embedded layer" },
  { layer: "Network steerage", status: "future", note: "Year 2 unlock" },
];
