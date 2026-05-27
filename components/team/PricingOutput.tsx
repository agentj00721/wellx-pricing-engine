"use client";

import { motion } from "motion/react";
import { Sparkles, Wallet } from "lucide-react";
import { Panel, PanelRow, Tag } from "@/components/ui/Panel";
import { Eyebrow, GradientBar } from "@/components/ui/atoms";
import { type DealState, calcDeal } from "./deal";

export function PricingOutput({ deal }: { deal: DealState }) {
  const r = calcDeal(deal);
  return (
    <Panel
      eyebrow="Pricing engine output"
      title={
        <span className="inline-flex items-baseline gap-2">
          <Sparkles size={13} className="text-wx-orange relative top-0.5" />
          <span className="wx-display wx-mono text-3xl">${r.pmpm}</span>
          <span className="text-[12px] text-fg-muted">per member / month</span>
        </span>
      }
      trailing={
        <Tag tone={r.grossMargin > 0.45 ? "success" : r.grossMargin > 0.38 ? "warm" : "warning"}>
          GM {(r.grossMargin * 100).toFixed(0)}%
        </Tag>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Tile label="List monthly" value={r.listMonthly} />
          <Tile label="Discount" value={r.discountAmount} negative />
          <Tile label="Net monthly" value={r.netMonthly} emphasis />
          <Tile label="TCV" value={r.tcv} accent />
        </div>

        <div className="wx-card-quiet p-4 flex flex-col gap-3">
          <Eyebrow>Net revenue waterfall</Eyebrow>
          <Waterfall
            steps={[
              { label: "List monthly", value: r.listMonthly, color: "var(--wx-orange)" },
              { label: "− Discount", value: -r.discountAmount, color: "var(--wx-pink)" },
              { label: "− Broker fee", value: -r.brokerFee, color: "var(--wx-purple)" },
              { label: "Wellx net", value: r.wellxNetMonthly, color: "var(--wx-sky)" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <PanelRow label="Annual Wellx net" value={`$${r.annualWellxNet.toLocaleString()}`} emphasis />
          <PanelRow label="Broker fee / mo" value={`$${r.brokerFee.toLocaleString()}`} />
          <PanelRow label="Margin band" trailing={
            <span className="flex items-center gap-2 w-32">
              <GradientBar value={r.grossMargin * 100} variant="warm" />
              <span className="wx-mono text-[12px] text-fg-secondary">
                {(r.grossMargin * 100).toFixed(0)}%
              </span>
            </span>
          } />
        </div>
      </div>
    </Panel>
  );
}

function Tile({
  label,
  value,
  negative,
  emphasis,
  accent,
}: {
  label: string;
  value: number;
  negative?: boolean;
  emphasis?: boolean;
  accent?: boolean;
}) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 0.985, opacity: 0.6 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-rule bg-card-elev px-3 py-2.5"
    >
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-fg-muted flex items-center gap-1.5">
        {accent && <Wallet size={11} className="text-wx-orange" />}
        {label}
      </div>
      <div
        className={`wx-display wx-mono mt-1 text-[18px] ${
          emphasis ? "text-fg" : negative ? "text-[color:var(--wx-danger)]" : "text-fg"
        }`}
      >
        {negative ? "−" : ""}${Math.abs(value).toLocaleString()}
      </div>
    </motion.div>
  );
}

function Waterfall({
  steps,
}: {
  steps: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...steps.map((s) => Math.abs(s.value)), 1);
  return (
    <div className="flex flex-col gap-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[12px] text-fg-secondary w-28 shrink-0">
            {s.label}
          </span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-fg-faint">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.abs(s.value) / max }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 origin-left rounded-full"
              style={{ background: s.color }}
            />
          </div>
          <span className="wx-mono text-[12px] w-24 text-right text-fg">
            ${Math.round(s.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
