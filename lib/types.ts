export type Mode = "customer" | "team" | "founders";

export type Theme = "light" | "dark";

export type Device = "phone" | "tablet" | "desktop";

export const MODES: { id: Mode; label: string; tagline: string; longLabel: string }[] = [
  {
    id: "customer",
    label: "Customer",
    longLabel: "Customer Studio",
    tagline: "Build your Wellx stack.",
  },
  {
    id: "team",
    label: "Wellx Team",
    longLabel: "Pricing Cockpit",
    tagline: "Price any Wellx opportunity.",
  },
  {
    id: "founders",
    label: "Founders",
    longLabel: "Strategic Command",
    tagline: "See the deal behind the deal.",
  },
];
