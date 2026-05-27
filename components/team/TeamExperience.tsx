"use client";

import { useCallback, useState } from "react";
import { ArrowRight, FileText, Share2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useDevice } from "@/components/providers";
import { Eyebrow, StatPill } from "@/components/ui/atoms";
import { GradientButton } from "@/components/ui/GradientButton";
import { Tag } from "@/components/ui/Panel";
import { CommercialBuilder } from "./CommercialBuilder";
import { DealIntake } from "./DealIntake";
import { Guardrails } from "./Guardrails";
import { PricingOutput } from "./PricingOutput";
import { calcDeal, evaluateGuardrails, initialDeal, type DealState } from "./deal";

export function TeamExperience() {
  const { device } = useDevice();
  const [deal, setDeal] = useState<DealState>(initialDeal);
  const [intro, setIntro] = useState(true);
  const set = useCallback(
    (p: Partial<DealState>) => setDeal((d) => ({ ...d, ...p })),
    [],
  );

  if (intro) {
    return <Intro onStart={() => setIntro(false)} />;
  }

  if (device === "phone") return <TeamPhone deal={deal} set={set} />;
  if (device === "tablet") return <TeamTablet deal={deal} set={set} />;
  return <TeamDesktop deal={deal} set={set} />;
}

function Intro({ onStart }: { onStart: () => void }) {
  const { device } = useDevice();
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16 lg:py-20">
      <div className="flex flex-col gap-6 max-w-2xl">
        <Eyebrow accent="warm">Pricing Cockpit</Eyebrow>
        <h1
          className={`wx-display ${
            device === "desktop"
              ? "text-6xl md:text-7xl"
              : device === "tablet"
                ? "text-5xl"
                : "text-4xl"
          } leading-[1.02]`}
        >
          Price any{" "}
          <span className="wx-gradient-text-cool">Wellx</span>
          <br />
          opportunity.
        </h1>
        <p className="max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-fg-secondary">
          Shape commercials, surface guardrails, and see net Wellx revenue
          before you send a single proposal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <GradientButton size="lg" onClick={onStart} iconRight={<ArrowRight size={16} />}>
            Open cockpit
          </GradientButton>
          <button className="wx-focus inline-flex h-12 items-center justify-center gap-2 rounded-full border border-stroke px-5 text-[13.5px] text-fg-secondary hover:text-fg hover:border-wx-purple/40">
            Load deal from CRM
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl">
          <StatPill label="Live deals" value="38" delta="+5" />
          <StatPill label="Median GM" value="44%" delta="+3pts" />
          <StatPill label="Win rate" value="62%" delta="+7%" />
          <StatPill label="Avg cycle" value="34d" delta="−6d" />
        </div>
      </div>
    </div>
  );
}

/* ────────────── PHONE ────────────── */

function TeamPhone({
  deal,
  set,
}: {
  deal: DealState;
  set: (p: Partial<DealState>) => void;
}) {
  const result = calcDeal(deal);
  const rails = evaluateGuardrails(deal);
  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-5">
      <header className="flex items-center justify-between">
        <div>
          <Eyebrow accent="warm">Pricing cockpit</Eyebrow>
          <h2 className="wx-display text-2xl mt-1">
            <span className="wx-gradient-text">{deal.account}</span>
          </h2>
          <p className="text-[12px] text-fg-muted mt-1">
            {deal.region} · {deal.members.toLocaleString()} members
          </p>
        </div>
        <Tag tone={result.grossMargin > 0.45 ? "success" : "warm"}>
          GM {(result.grossMargin * 100).toFixed(0)}%
        </Tag>
      </header>

      <DealIntake deal={deal} set={set} />
      <CommercialBuilder deal={deal} set={set} />
      <PricingOutput deal={deal} />
      <Guardrails deal={deal} />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stroke bg-page/95 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-3">
          <button className="wx-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-stroke text-fg-secondary">
            <Share2 size={15} />
          </button>
          <GradientButton
            size="md"
            fullWidth
            iconRight={<ArrowRight size={14} />}
            disabled={rails.some((r) => r.severity === "danger")}
          >
            {rails.some((r) => r.severity === "danger")
              ? "Escalation required"
              : "Send proposal"}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

/* ────────────── TABLET ────────────── */

function TeamTablet({
  deal,
  set,
}: {
  deal: DealState;
  set: (p: Partial<DealState>) => void;
}) {
  const result = calcDeal(deal);
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_400px] gap-5 px-5 py-6">
      <main className="flex flex-col gap-5 min-w-0">
        <DealHeader deal={deal} />
        <DealIntake deal={deal} set={set} />
        <CommercialBuilder deal={deal} set={set} />
      </main>
      <aside className="sticky top-20 self-start flex flex-col gap-5">
        <PricingOutput deal={deal} />
        <Guardrails deal={deal} />
        <SendBar deal={deal} margin={result.grossMargin} />
      </aside>
    </div>
  );
}

/* ────────────── DESKTOP ────────────── */

function TeamDesktop({
  deal,
  set,
}: {
  deal: DealState;
  set: (p: Partial<DealState>) => void;
}) {
  const result = calcDeal(deal);
  return (
    <div className="mx-auto grid max-w-[1700px] grid-cols-[360px_1fr_400px] gap-6 px-8 py-8">
      <aside className="flex flex-col gap-5">
        <DealHeader deal={deal} variant="compact" />
        <DealIntake deal={deal} set={set} />
      </aside>

      <main className="flex flex-col gap-5 min-w-0">
        <CommercialBuilder deal={deal} set={set} />
        <PricingOutput deal={deal} />
      </main>

      <aside className="sticky top-24 self-start flex flex-col gap-5">
        <Guardrails deal={deal} />
        <SendBar deal={deal} margin={result.grossMargin} />
      </aside>
    </div>
  );
}

function DealHeader({
  deal,
  variant = "wide",
}: {
  deal: DealState;
  variant?: "wide" | "compact";
}) {
  const result = calcDeal(deal);
  return (
    <div className="wx-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow accent="warm">Active opportunity</Eyebrow>
          <h2 className="wx-display text-2xl mt-1 sm:text-3xl">
            <span className="wx-gradient-text">{deal.account}</span>
          </h2>
          <p className="text-[12.5px] text-fg-muted mt-1.5">
            {deal.region} · {deal.members.toLocaleString()} members · {deal.contractMonths}mo
          </p>
        </div>
        <Tag tone={result.grossMargin > 0.45 ? "success" : "warm"}>
          GM {(result.grossMargin * 100).toFixed(0)}%
        </Tag>
      </div>
      {variant === "wide" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatPill label="Per member / mo" value={`$${result.pmpm}`} />
          <StatPill label="Net monthly" value={`$${result.netMonthly.toLocaleString()}`} />
          <StatPill label="Annual net" value={`$${result.annualWellxNet.toLocaleString()}`} />
          <StatPill label="TCV" value={`$${result.tcv.toLocaleString()}`} delta="+commit" />
        </div>
      )}
    </div>
  );
}

function SendBar({ deal, margin }: { deal: DealState; margin: number }) {
  const rails = evaluateGuardrails(deal);
  const blocking = rails.some((r) => r.severity === "danger");
  return (
    <motion.div
      layout
      className="wx-card p-4 flex flex-col gap-3"
      style={{
        background: blocking
          ? "linear-gradient(135deg, rgba(224,52,91,0.08), var(--wx-card-bg))"
          : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <Eyebrow>Action</Eyebrow>
        <span className="text-[11px] text-fg-muted">
          {blocking ? "Blocked by guardrail" : `GM ${(margin * 100).toFixed(0)}% · ready`}
        </span>
      </div>
      <GradientButton
        size="md"
        iconRight={<ArrowRight size={14} />}
        disabled={blocking}
        variant={blocking ? "danger" : "primary"}
      >
        {blocking ? "Escalate to Council" : "Send proposal"}
      </GradientButton>
      <div className="flex gap-1.5">
        <button className="wx-focus flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-stroke text-[12px] text-fg-secondary hover:text-fg">
          <FileText size={12} /> PDF
        </button>
        <button className="wx-focus flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-stroke text-[12px] text-fg-secondary hover:text-fg">
          <Sparkles size={12} /> Co-pilot
        </button>
        <button className="wx-focus flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-stroke text-[12px] text-fg-secondary hover:text-fg">
          <Share2 size={12} /> Share
        </button>
      </div>
    </motion.div>
  );
}
