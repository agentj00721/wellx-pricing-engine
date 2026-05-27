"use client";

import { motion } from "motion/react";
import { Panel } from "@/components/ui/Panel";
import { Eyebrow, RadialScore } from "@/components/ui/atoms";
import { OPPORTUNITY } from "./opportunity";

const ROWS: { id: keyof typeof OPPORTUNITY.scores; label: string; rationale: string }[] = [
  {
    id: "strategicFit",
    label: "Strategic fit",
    rationale: "Anchors UAE corporate-broker channel; opens KSA-replicable shape.",
  },
  {
    id: "marketSignal",
    label: "Market signal",
    rationale: "Marquee logo unlocks 5–7 lookalikes in the regional broker book.",
  },
  {
    id: "economicQuality",
    label: "Economic quality",
    rationale: "Margin compressed by broker share; rescue via cross-sell of chronic.",
  },
  {
    id: "executionRisk",
    label: "Execution risk",
    rationale: "Network gap in Abu Dhabi; resolves with Q3 partner agreement.",
  },
  {
    id: "boardOptics",
    label: "Board optics",
    rationale: "Strengthens the regional enterprise narrative for next raise.",
  },
];

export function StrategicScoring({ compact }: { compact?: boolean }) {
  const o = OPPORTUNITY;
  const overall =
    Math.round(
      (o.scores.strategicFit +
        o.scores.marketSignal +
        o.scores.economicQuality +
        (100 - o.scores.executionRisk) +
        o.scores.boardOptics) /
        5,
    );
  return (
    <Panel
      eyebrow="Strategic scoring"
      title={<>The deal behind the deal</>}
      trailing={
        !compact && (
          <RadialScore value={overall} size={64} thickness={6} label="Score" />
        )
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROWS.map((r) => {
          const raw = o.scores[r.id];
          const displayed = r.id === "executionRisk" ? 100 - raw : raw;
          return (
            <div
              key={r.id}
              className="rounded-xl border border-rule bg-card-elev p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <Eyebrow>{r.label}</Eyebrow>
                <span
                  className="wx-mono text-[13px] font-semibold"
                  style={{
                    color:
                      displayed > 75
                        ? "var(--wx-success)"
                        : displayed > 55
                          ? "var(--wx-orange)"
                          : "var(--wx-danger)",
                  }}
                >
                  {displayed}
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-fg-faint">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: displayed / 100 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 origin-left rounded-full"
                  style={{ background: "var(--wx-gradient-warm)" }}
                />
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-fg-secondary">
                {r.rationale}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
