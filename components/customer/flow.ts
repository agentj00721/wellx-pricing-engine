import type { Step } from "@/components/ui/Stepper";

export type CustomerPersona = "employer" | "broker" | "tpa" | "insurer";
export type CustomerGoal = "retention" | "claims" | "engagement" | "differentiation";
export type CustomerModel = "essentials" | "elevate" | "executive" | "white-label";
export type CustomerExperience = "concierge" | "blended" | "self-serve";

export const STEPS: Step[] = [
  { id: "welcome", label: "Welcome", description: "Start your Wellx stack" },
  { id: "persona", label: "About you", description: "Tell us who you are" },
  { id: "goal", label: "Primary goal", description: "What you want most" },
  { id: "model", label: "Stack model", description: "Pick a foundation" },
  { id: "population", label: "Population", description: "Who's covered" },
  { id: "experience", label: "Experience", description: "Service touch-points" },
  { id: "modules", label: "Modules", description: "Build out the system" },
  { id: "quote", label: "Quote", description: "Your stack summary" },
];

export type CustomerState = {
  persona?: CustomerPersona;
  goal?: CustomerGoal;
  model?: CustomerModel;
  populationSize?: number;
  populationProfile?: "executive" | "professional" | "blue-collar" | "mixed";
  experience?: CustomerExperience;
  modules: string[];
};

export const initialState: CustomerState = {
  populationSize: 250,
  modules: ["primary-care", "mental-health"],
};

export const MODULES = [
  {
    id: "primary-care",
    label: "Primary Care",
    description: "Telehealth + in-clinic GP network, 24/7 access",
    tier: "core",
    delta: 18,
  },
  {
    id: "mental-health",
    label: "Mental Wellbeing",
    description: "Therapy, coaching, EAP, mindfulness",
    tier: "core",
    delta: 14,
  },
  {
    id: "chronic-care",
    label: "Chronic Care",
    description: "Diabetes, cardiometabolic, hypertension programs",
    tier: "advanced",
    delta: 22,
  },
  {
    id: "executive-health",
    label: "Executive Health",
    description: "Full-spectrum executive screening + concierge",
    tier: "premium",
    delta: 38,
  },
  {
    id: "women-health",
    label: "Women's Health",
    description: "Fertility, maternity, menopause, pelvic care",
    tier: "advanced",
    delta: 16,
  },
  {
    id: "musculoskeletal",
    label: "Musculoskeletal",
    description: "Physio-led MSK pathways with imaging",
    tier: "advanced",
    delta: 12,
  },
  {
    id: "occupational",
    label: "Occupational Health",
    description: "Pre-employment, fitness-for-work, surveillance",
    tier: "core",
    delta: 9,
  },
  {
    id: "global-coverage",
    label: "Global Coverage",
    description: "Cross-border care + medical evacuation",
    tier: "premium",
    delta: 26,
  },
];

export const PERSONAS = [
  {
    id: "employer" as const,
    title: "Employer",
    description: "I'm building benefits for my team or company.",
    icon: "🏢",
  },
  {
    id: "broker" as const,
    title: "Broker / Consultant",
    description: "I'm shaping a stack for one of my clients.",
    icon: "🤝",
  },
  {
    id: "tpa" as const,
    title: "TPA / Administrator",
    description: "I'm administering plans and want a unified stack.",
    icon: "🧭",
  },
  {
    id: "insurer" as const,
    title: "Insurer",
    description: "I'm embedding Wellx alongside our cover.",
    icon: "🛡️",
  },
];

export const GOALS = [
  {
    id: "retention" as const,
    title: "Retain talent",
    description: "Reduce churn, lift employer brand, win the talent war.",
    accent: "warm" as const,
  },
  {
    id: "claims" as const,
    title: "Bend the claims curve",
    description: "Lower medical inflation and downstream catastrophic claims.",
    accent: "cool" as const,
  },
  {
    id: "engagement" as const,
    title: "Drive engagement",
    description: "Get high utilisation across your population, not just the worried-well.",
    accent: "warm" as const,
  },
  {
    id: "differentiation" as const,
    title: "Differentiate",
    description: "Stand out — premium employer brand or insurance proposition.",
    accent: "cool" as const,
  },
];

export const MODELS = [
  {
    id: "essentials" as const,
    title: "Essentials",
    description: "The Wellx foundation. Primary care + mental health + occupational.",
    basePrice: 38,
    tier: "Starter",
    badge: undefined,
  },
  {
    id: "elevate" as const,
    title: "Elevate",
    description: "Pro stack with chronic care, MSK, women's health pathways.",
    basePrice: 62,
    tier: "Most popular",
    badge: "Most picked",
  },
  {
    id: "executive" as const,
    title: "Executive",
    description: "Full concierge + executive screening + premium access.",
    basePrice: 108,
    tier: "Premium",
    badge: undefined,
  },
  {
    id: "white-label" as const,
    title: "White-Label",
    description: "Wellx engine, your brand. Embedded into your offering.",
    basePrice: 0,
    tier: "Custom",
    badge: "Custom",
  },
];

export const EXPERIENCES = [
  {
    id: "concierge" as const,
    title: "Concierge",
    description: "Human-led navigation. Care coordinators for every member.",
    accent: "warm" as const,
  },
  {
    id: "blended" as const,
    title: "Blended",
    description: "AI-first triage with human handoff for clinical complexity.",
    accent: "warm" as const,
  },
  {
    id: "self-serve" as const,
    title: "Self-Serve",
    description: "App-led journey. Members drive their own care path.",
    accent: "cool" as const,
  },
];

export function calcQuote(state: CustomerState) {
  const base =
    MODELS.find((m) => m.id === state.model)?.basePrice ??
    MODELS[1].basePrice;

  const moduleDelta = state.modules.reduce((acc, id) => {
    const m = MODULES.find((mm) => mm.id === id);
    return acc + (m?.delta ?? 0);
  }, 0);

  const experienceMultiplier =
    state.experience === "concierge"
      ? 1.18
      : state.experience === "blended"
        ? 1.06
        : 0.94;

  const profileMultiplier =
    state.populationProfile === "executive"
      ? 1.22
      : state.populationProfile === "professional"
        ? 1.04
        : state.populationProfile === "blue-collar"
          ? 0.92
          : 1.0;

  const perMember = Math.round(
    (base + moduleDelta) * experienceMultiplier * profileMultiplier,
  );
  const monthly = perMember * (state.populationSize ?? 0);

  return {
    perMember,
    monthly,
    annual: monthly * 12,
    moduleDelta,
    base,
  };
}
