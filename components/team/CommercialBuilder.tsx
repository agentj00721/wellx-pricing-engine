"use client";

import { motion } from "motion/react";
import { Panel } from "@/components/ui/Panel";
import { Eyebrow } from "@/components/ui/atoms";
import { cn } from "@/lib/cn";
import { MODULES_TEAM, type DealState } from "./deal";

export function CommercialBuilder({
  deal,
  set,
}: {
  deal: DealState;
  set: (p: Partial<DealState>) => void;
}) {
  return (
    <Panel eyebrow="Commercial builder" title="Shape the offer">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SliderField
            label="Discount"
            suffix="%"
            value={deal.discountPct}
            min={0}
            max={25}
            step={0.5}
            onChange={(v) => set({ discountPct: v })}
            tone={
              deal.discountPct > 12
                ? "danger"
                : deal.discountPct > 8
                  ? "warning"
                  : "ok"
            }
          />
          <SliderField
            label="Broker share"
            suffix="%"
            value={deal.brokerSharePct}
            min={0}
            max={15}
            step={0.5}
            onChange={(v) => set({ brokerSharePct: v })}
            tone={deal.brokerSharePct > 10 ? "warning" : "ok"}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Stack">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(
                [
                  "essentials",
                  "elevate",
                  "executive",
                  "custom",
                ] as DealState["stack"][]
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set({ stack: s })}
                  className={cn(
                    "wx-focus rounded-full border px-2 py-1.5 text-[11.5px] font-medium capitalize transition-colors",
                    deal.stack === s
                      ? "border-transparent text-white"
                      : "border-stroke text-fg-secondary hover:text-fg",
                  )}
                  style={
                    deal.stack === s
                      ? { background: "var(--wx-gradient-warm)" }
                      : undefined
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Term">
            <div className="grid grid-cols-3 gap-1.5">
              {[12, 24, 36].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    set({ contractMonths: t as DealState["contractMonths"] })
                  }
                  className={cn(
                    "wx-focus rounded-full border px-2 py-1.5 text-[11.5px] font-medium transition-colors",
                    deal.contractMonths === t
                      ? "border-transparent text-white"
                      : "border-stroke text-fg-secondary hover:text-fg",
                  )}
                  style={
                    deal.contractMonths === t
                      ? { background: "var(--wx-gradient-warm)" }
                      : undefined
                  }
                >
                  {t} mo
                </button>
              ))}
            </div>
          </Field>
        </div>

        <Field label={`Modules · ${deal.modules.length}`}>
          <div className="flex flex-wrap gap-1.5">
            {MODULES_TEAM.map((m) => {
              const active = deal.modules.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    set({
                      modules: active
                        ? deal.modules.filter((id) => id !== m.id)
                        : [...deal.modules, m.id],
                    })
                  }
                  className={cn(
                    "wx-focus inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                    active
                      ? "border-transparent text-white"
                      : "border-stroke text-fg-secondary hover:text-fg",
                  )}
                  style={
                    active
                      ? { background: "var(--wx-gradient-warm)" }
                      : undefined
                  }
                >
                  {m.label}
                  <span
                    className={cn(
                      "wx-mono text-[10px]",
                      active ? "opacity-80" : "text-fg-muted",
                    )}
                  >
                    +${m.delta}
                  </span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Setup fee (one-time)">
          <div className="flex items-center gap-2">
            <span className="text-fg-muted">$</span>
            <input
              type="number"
              value={deal.setupFee}
              min={0}
              step={500}
              onChange={(e) =>
                set({ setupFee: Math.max(0, Number(e.target.value) || 0) })
              }
              className="wx-focus flex-1 bg-transparent text-[14px] wx-mono text-fg outline-none"
            />
          </div>
        </Field>
      </div>
    </Panel>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow>{label}</Eyebrow>
      <div className="border-b border-rule pb-2">{children}</div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
  tone = "ok",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
  tone?: "ok" | "warning" | "danger";
}) {
  const color =
    tone === "danger"
      ? "var(--wx-danger)"
      : tone === "warning"
        ? "var(--wx-orange)"
        : "var(--wx-purple)";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Eyebrow>{label}</Eyebrow>
        <motion.span
          key={value}
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="wx-mono text-[13px] font-semibold"
          style={{ color }}
        >
          {value}
          {suffix}
        </motion.span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
    </div>
  );
}
