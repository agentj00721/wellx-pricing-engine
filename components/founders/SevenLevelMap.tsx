"use client";

import { Check, ChevronRight, Lock } from "lucide-react";
import { motion } from "motion/react";
import { Panel } from "@/components/ui/Panel";
import { SEVEN_LEVELS } from "./opportunity";

export function SevenLevelMap({ compact }: { compact?: boolean }) {
  return (
    <Panel
      eyebrow="Wellx ladder · 7 levels"
      title={<>Where this deal sits &mdash; and what&rsquo;s next</>}
    >
      <ol className="relative flex flex-col gap-2">
        {SEVEN_LEVELS.map((lvl, i) => {
          const isLive = lvl.here !== "—";
          const isCurrent =
            isLive &&
            (i === SEVEN_LEVELS.findIndex((l) => l.here !== "—" && SEVEN_LEVELS[SEVEN_LEVELS.indexOf(l) + 1]?.here === "—"));
          return (
            <motion.li
              key={lvl.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="relative grid grid-cols-[36px_1fr_auto] items-start gap-3 rounded-xl border border-rule p-3"
              style={
                isCurrent
                  ? {
                      borderColor: "transparent",
                      background:
                        "linear-gradient(135deg, rgba(251,155,53,0.06), rgba(132,49,203,0.06))",
                      boxShadow: "0 10px 30px var(--wx-glow-shadow)",
                    }
                  : undefined
              }
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold"
                style={
                  isLive
                    ? {
                        background: "var(--wx-gradient-warm)",
                        color: "#fff",
                      }
                    : { background: "var(--wx-text-faint)", color: "var(--wx-text-muted)" }
                }
              >
                {isLive ? <Check size={12} strokeWidth={3} /> : lvl.id}
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-fg">
                    L{lvl.id} · {lvl.label}
                  </span>
                  {!isLive && (
                    <Lock size={11} className="text-fg-muted" />
                  )}
                </div>
                {!compact && (
                  <p className="mt-0.5 text-[11.5px] text-fg-secondary leading-relaxed">
                    {lvl.what}
                  </p>
                )}
                <div className="mt-1 text-[11px]">
                  <span className="text-fg-muted">Here:</span>{" "}
                  <span className="text-fg-secondary">{lvl.here}</span>
                </div>
                <div className="text-[11px]">
                  <span className="text-fg-muted">Unlock:</span>{" "}
                  <span className="text-fg-secondary">{lvl.unlock}</span>
                </div>
              </div>

              <ChevronRight size={14} className="text-fg-muted mt-1" />
            </motion.li>
          );
        })}
      </ol>
    </Panel>
  );
}
