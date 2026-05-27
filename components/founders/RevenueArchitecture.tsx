"use client";

import { motion } from "motion/react";
import { Panel } from "@/components/ui/Panel";

type Source = { id: string; label: string; share: number; trend: string };

const SOURCES: Source[] = [
  { id: "stack-pmpm", label: "Stack PMPM", share: 56, trend: "+18% YoY" },
  { id: "modules", label: "Module add-ons", share: 18, trend: "+24%" },
  { id: "concierge", label: "Concierge premium", share: 11, trend: "+9%" },
  { id: "setup", label: "Setup + onboarding", share: 6, trend: "flat" },
  { id: "data", label: "Data + insights", share: 5, trend: "+38%" },
  { id: "network", label: "Network rents", share: 4, trend: "future" },
];

export function RevenueArchitecture() {
  return (
    <Panel
      eyebrow="Revenue architecture"
      title="Where every Wellx dollar comes from"
    >
      <div className="flex flex-col gap-4">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-fg-faint">
          {SOURCES.reduce<{ width: number; node: React.ReactNode[] }>(
            (acc, s, i) => {
              const left = acc.width;
              acc.node.push(
                <motion.div
                  key={s.id}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 origin-left"
                  style={{
                    left: `${left}%`,
                    width: `${s.share}%`,
                    background: GRADIENTS[i % GRADIENTS.length],
                  }}
                />,
              );
              acc.width += s.share;
              return acc;
            },
            { width: 0, node: [] as React.ReactNode[] },
          ).node}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SOURCES.map((s, i) => (
            <div
              key={s.id}
              className="rounded-xl border border-rule bg-card-elev px-3 py-2.5 flex items-start gap-3"
            >
              <span
                className="mt-0.5 h-2.5 w-2.5 rounded-full shrink-0"
                style={{
                  background: GRADIENTS[i % GRADIENTS.length],
                  boxShadow: `0 0 12px ${GRADIENT_GLOWS[i % GRADIENT_GLOWS.length]}`,
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-fg">{s.label}</div>
                <div className="text-[11px] text-fg-muted">{s.trend}</div>
              </div>
              <span className="wx-mono text-[13px] text-fg">{s.share}%</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

const GRADIENTS = [
  "linear-gradient(135deg,#fb9b35,#f1517b)",
  "linear-gradient(135deg,#f1517b,#b43082)",
  "linear-gradient(135deg,#b43082,#8431cb)",
  "linear-gradient(135deg,#8431cb,#35c5fc)",
  "linear-gradient(135deg,#35c5fc,#003780)",
  "linear-gradient(135deg,#003780,#5e788a)",
];
const GRADIENT_GLOWS = ["#fb9b3580", "#f1517b80", "#b4308280", "#8431cb80", "#35c5fc80", "#00378080"];
