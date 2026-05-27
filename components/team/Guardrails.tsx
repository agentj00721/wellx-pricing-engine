"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertOctagon, AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Eyebrow } from "@/components/ui/atoms";
import { type DealState, evaluateGuardrails } from "./deal";

export function Guardrails({ deal }: { deal: DealState }) {
  const rails = evaluateGuardrails(deal);

  return (
    <Panel
      eyebrow="Guardrails"
      title={rails.length === 0 ? "All clear" : `${rails.length} flag${rails.length > 1 ? "s" : ""}`}
      trailing={
        rails.length === 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-[color:var(--wx-success)]">
            <ShieldCheck size={12} /> Within policy
          </span>
        ) : null
      }
    >
      {rails.length === 0 ? (
        <div className="rounded-xl border border-rule bg-card-elev p-4 text-[13px] text-fg-secondary">
          This deal sits inside Wellx commercial guardrails. You can send the
          proposal without escalation.
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {rails.map((g) => (
              <motion.li
                key={g.id}
                layout
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex gap-3 rounded-xl border p-3"
                style={{
                  borderColor:
                    g.severity === "danger"
                      ? "rgba(224,52,91,0.4)"
                      : g.severity === "warning"
                        ? "rgba(251,155,53,0.4)"
                        : "var(--wx-rule)",
                  background:
                    g.severity === "danger"
                      ? "rgba(224,52,91,0.06)"
                      : g.severity === "warning"
                        ? "rgba(251,155,53,0.06)"
                        : "var(--wx-card-bg-elev)",
                }}
              >
                <Icon severity={g.severity} />
                <div className="flex flex-col gap-1">
                  <Eyebrow>{g.severity}</Eyebrow>
                  <div className="text-[13.5px] font-semibold text-fg">
                    {g.title}
                  </div>
                  <div className="text-[12.5px] text-fg-secondary leading-relaxed">
                    {g.body}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Panel>
  );
}

function Icon({ severity }: { severity: "info" | "warning" | "danger" }) {
  const Cmp =
    severity === "danger"
      ? AlertOctagon
      : severity === "warning"
        ? AlertTriangle
        : Info;
  const color =
    severity === "danger"
      ? "var(--wx-danger)"
      : severity === "warning"
        ? "var(--wx-orange)"
        : "var(--wx-sky)";
  return (
    <span
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `${color}1f`,
        color,
      }}
    >
      <Cmp size={14} />
    </span>
  );
}
