"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Boxes, Sparkles } from "lucide-react";
import { Panel, PanelRow, Tag } from "@/components/ui/Panel";
import { GradientBar } from "@/components/ui/atoms";
import {
  MODULES,
  MODELS,
  PERSONAS,
  GOALS,
  EXPERIENCES,
  calcQuote,
  type CustomerState,
} from "./flow";

function money(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function LiveStack({
  state,
  variant = "rail",
}: {
  state: CustomerState;
  variant?: "rail" | "card";
}) {
  const persona = PERSONAS.find((p) => p.id === state.persona);
  const goal = GOALS.find((g) => g.id === state.goal);
  const model = MODELS.find((m) => m.id === state.model);
  const exp = EXPERIENCES.find((e) => e.id === state.experience);
  const quote = calcQuote(state);

  return (
    <div className="flex flex-col gap-4">
      <Panel
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={11} className="text-wx-orange" />
            Live stack
          </span>
        }
        title={
          <span>
            Your <span className="wx-gradient-text">Wellx</span> configuration
          </span>
        }
        trailing={
          <Tag tone={model?.id === "executive" ? "warm" : "neutral"}>
            {model?.tier ?? "Draft"}
          </Tag>
        }
      >
        <div className="flex flex-col gap-1.5">
          <PanelRow label="Persona" value={persona?.title ?? "—"} />
          <PanelRow label="Primary goal" value={goal?.title ?? "—"} />
          <PanelRow
            label="Stack model"
            value={model?.title ?? "—"}
            emphasis
          />
          <PanelRow
            label="Population"
            value={
              state.populationSize
                ? `${state.populationSize.toLocaleString()} members`
                : "—"
            }
          />
          <PanelRow label="Experience" value={exp?.title ?? "—"} />
        </div>
      </Panel>

      <Panel
        eyebrow="Module mix"
        title={
          <span className="inline-flex items-center gap-2">
            <Boxes size={14} className="text-wx-purple" />
            Active modules · {state.modules.length}
          </span>
        }
      >
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {state.modules.map((id) => {
              const m = MODULES.find((mm) => mm.id === id);
              if (!m) return null;
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  layout
                  className="flex items-center justify-between gap-3 rounded-xl border border-rule bg-card-elev px-3 py-2"
                >
                  <span className="flex flex-col">
                    <span className="text-[13px] font-medium text-fg">
                      {m.label}
                    </span>
                    <span className="text-[11px] text-fg-muted">{m.tier}</span>
                  </span>
                  <Tag tone={m.tier === "premium" ? "warm" : "neutral"}>
                    +${m.delta}
                  </Tag>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {state.modules.length === 0 && (
            <li className="rounded-xl border border-dashed border-rule px-3 py-4 text-center text-[12px] text-fg-muted">
              Add modules to compose your stack.
            </li>
          )}
        </ul>
      </Panel>

      <Panel
        eyebrow="Indicative pricing"
        title={
          <span>
            <span className="wx-mono">${quote.perMember}</span>
            <span className="text-fg-muted text-[13px] font-medium ml-1">
              per member / mo
            </span>
          </span>
        }
        trailing={
          variant === "rail" ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-fg-muted">
              <ArrowRight size={10} /> live
            </span>
          ) : undefined
        }
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Mini
              label="Monthly"
              value={`$${money(quote.monthly)}`}
              hint={`${state.populationSize ?? 0} members`}
            />
            <Mini
              label="Annual"
              value={`$${money(quote.annual)}`}
              hint="indicative"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-fg-muted">Stack richness</span>
              <span className="text-fg-secondary wx-mono">
                {Math.min(100, Math.round((state.modules.length / 8) * 100))}%
              </span>
            </div>
            <GradientBar
              value={Math.min(100, (state.modules.length / 8) * 100)}
              variant="warm"
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Mini({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-rule bg-card-elev px-3 py-2.5">
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-fg-muted">
        {label}
      </div>
      <div className="wx-mono wx-display text-[18px] text-fg mt-1">{value}</div>
      {hint && (
        <div className="text-[10.5px] text-fg-muted mt-0.5">{hint}</div>
      )}
    </div>
  );
}
