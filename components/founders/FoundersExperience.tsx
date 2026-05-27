"use client";

import { useState } from "react";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { useDevice } from "@/components/providers";
import { Eyebrow, RadialScore, StatPill } from "@/components/ui/atoms";
import { GradientButton } from "@/components/ui/GradientButton";
import { DecisionPanel } from "./DecisionPanel";
import { RevenueArchitecture } from "./RevenueArchitecture";
import { SevenLevelMap } from "./SevenLevelMap";
import { Snapshot, NextDeadline } from "./Snapshot";
import { StrategicScoring } from "./StrategicScoring";

export function FoundersExperience() {
  const { device } = useDevice();
  const [intro, setIntro] = useState(true);
  if (intro) return <Intro onStart={() => setIntro(false)} />;
  if (device === "phone") return <FoundersPhone />;
  if (device === "tablet") return <FoundersTablet />;
  return <FoundersDesktop />;
}

function Intro({ onStart }: { onStart: () => void }) {
  const { device } = useDevice();
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16 lg:py-20">
      <div className="flex flex-col gap-6 max-w-2xl">
        <Eyebrow accent="cool">Strategic Command</Eyebrow>
        <h1
          className={`wx-display ${
            device === "desktop"
              ? "text-6xl md:text-7xl"
              : device === "tablet"
                ? "text-5xl"
                : "text-4xl"
          } leading-[1.02]`}
        >
          See the{" "}
          <span className="wx-gradient-text">deal behind</span>
          <br />
          the deal.
        </h1>
        <p className="max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-fg-secondary">
          A view from the founder&rsquo;s seat. Strategic fit, market signal,
          the seven-level ladder, and the next move &mdash; surfaced together.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <GradientButton size="lg" onClick={onStart} iconRight={<ArrowRight size={16} />}>
            Enter command center
          </GradientButton>
          <button className="wx-focus inline-flex h-12 items-center gap-2 rounded-full border border-stroke px-5 text-[13.5px] text-fg-secondary hover:text-fg hover:border-wx-purple/40">
            <Compass size={14} /> View board memo
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl">
          <StatPill label="Live theses" value="14" delta="+3" />
          <StatPill label="Anchor logos" value="6" delta="+1 Q3" />
          <StatPill label="Ladder L≥3" value="32%" delta="+6pts" />
          <StatPill label="Runway" value="22mo" delta="extending" />
        </div>
      </div>
    </div>
  );
}

/* ────────────── PHONE ────────────── */

function FoundersPhone() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-24">
      <header>
        <Eyebrow accent="cool">Founders&rsquo; view</Eyebrow>
        <h2 className="wx-display text-3xl mt-1">
          <span className="wx-gradient-text">Aurora</span>
        </h2>
        <p className="text-[12px] text-fg-muted mt-1">
          UAE · shaping · $2.84M TCV · 41-day window
        </p>
      </header>
      <NextDeadline />
      <Snapshot dense />
      <StrategicScoring compact />
      <SevenLevelMap compact />
      <DecisionPanel />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stroke bg-page/95 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-3">
          <GradientButton size="md" fullWidth iconRight={<Sparkles size={14} />}>
            Greenlight & schedule
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

/* ────────────── TABLET ────────────── */

function FoundersTablet() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-6 flex flex-col gap-5">
      <Snapshot />
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="flex flex-col gap-5 min-w-0">
          <StrategicScoring />
          <SevenLevelMap />
        </div>
        <aside className="flex flex-col gap-5 sticky top-20 self-start">
          <NextDeadline />
          <DecisionPanel />
        </aside>
      </div>
      <RevenueArchitecture />
    </div>
  );
}

/* ────────────── DESKTOP ────────────── */

function FoundersDesktop() {
  return (
    <div className="mx-auto max-w-[1700px] px-8 py-8 flex flex-col gap-6">
      <div className="grid grid-cols-[1fr_420px] gap-6">
        <Snapshot />
        <div className="flex items-center gap-4 wx-card p-5">
          <RadialScore value={74} size={88} thickness={9} label="Score" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Eyebrow accent="cool">Composite signal</Eyebrow>
            <p className="text-[13px] text-fg-secondary leading-relaxed">
              The deal lands in the <strong className="text-fg">accelerate</strong>{" "}
              band with strong strategic fit and signal. Margin needs shaping
              via cross-sell of chronic care in Y2.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_420px] gap-6">
        <div className="flex flex-col gap-6 min-w-0">
          <StrategicScoring />
          <RevenueArchitecture />
        </div>
        <aside className="flex flex-col gap-6 sticky top-24 self-start">
          <NextDeadline />
          <SevenLevelMap />
        </aside>
      </div>

      <DecisionPanel />
    </div>
  );
}
