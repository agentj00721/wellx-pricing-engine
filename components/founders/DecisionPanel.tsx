"use client";

import { ArrowRight, ArrowUpRight, ScrollText, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Panel } from "@/components/ui/Panel";
import { Eyebrow } from "@/components/ui/atoms";
import { GradientButton } from "@/components/ui/GradientButton";
import { ARCHITECTURE, OPPORTUNITY } from "./opportunity";

export function DecisionPanel() {
  const o = OPPORTUNITY;
  return (
    <Panel
      eyebrow="Founders' decision"
      title="What we do next"
      trailing={
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white"
          style={{
            background:
              o.decision === "accelerate"
                ? "var(--wx-gradient-warm)"
                : o.decision === "pass"
                  ? "var(--wx-danger)"
                  : "var(--wx-gradient-cool)",
            boxShadow: "0 4px 14px var(--wx-glow-shadow-warm)",
          }}
        >
          <Sparkles size={11} /> {o.decision}
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="wx-card-quiet p-4 flex flex-col gap-2"
        >
          <Eyebrow>Thesis</Eyebrow>
          <p className="text-[13px] leading-relaxed text-fg">
            {o.decisionNote}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ActionCard
            label="Move now"
            title="Lock pricing committee"
            hint="Thursday 14:00 GST"
          />
          <ActionCard
            label="Within 7 days"
            title="Secure Abu Dhabi network"
            hint="Resolves L3 unlock"
          />
          <ActionCard
            label="Within 14 days"
            title="Draft anchor case study"
            hint="For broker book replication"
          />
          <ActionCard
            label="Watch"
            title="Track competitor RFP"
            hint="Aurora hasn't formally invited"
          />
        </div>

        <div className="wx-card-quiet p-4 flex flex-col gap-3">
          <Eyebrow>Wellx architecture impact</Eyebrow>
          {ARCHITECTURE.map((a) => (
            <div key={a.layer} className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{
                  background:
                    a.status === "live"
                      ? "var(--wx-success)"
                      : a.status === "shaping"
                        ? "var(--wx-orange)"
                        : "var(--wx-text-muted)",
                  boxShadow:
                    a.status === "live"
                      ? "0 0 10px var(--wx-success)"
                      : a.status === "shaping"
                        ? "0 0 10px var(--wx-orange)"
                        : "none",
                }}
              />
              <span className="text-[12.5px] text-fg-secondary flex-1">
                {a.layer}
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-fg-muted">
                {a.status}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <GradientButton size="md" iconRight={<ArrowRight size={14} />}>
            Greenlight
          </GradientButton>
          <button className="wx-focus inline-flex h-11 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg">
            <ScrollText size={13} /> Full memo
          </button>
        </div>
      </div>
    </Panel>
  );
}

function ActionCard({
  label,
  title,
  hint,
}: {
  label: string;
  title: string;
  hint: string;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="wx-focus group flex flex-col items-start gap-1 rounded-xl border border-stroke bg-card p-3 text-left transition-colors hover:border-wx-purple/40"
    >
      <Eyebrow>{label}</Eyebrow>
      <div className="flex items-center justify-between w-full">
        <span className="text-[13px] font-semibold text-fg">{title}</span>
        <ArrowUpRight
          size={13}
          className="text-fg-muted group-hover:text-fg transition-colors"
        />
      </div>
      <span className="text-[11.5px] text-fg-muted">{hint}</span>
    </motion.button>
  );
}
