"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type Step = {
  id: string;
  label: string;
  description?: string;
};

export function VerticalStepper({
  steps,
  current,
  onStepClick,
  className,
}: {
  steps: Step[];
  current: number;
  onStepClick?: (i: number) => void;
  className?: string;
}) {
  return (
    <ol className={cn("relative flex flex-col gap-1.5", className)}>
      {steps.map((s, i) => {
        const active = i === current;
        const done = i < current;
        const interactive = !!onStepClick && (done || active);
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => interactive && onStepClick?.(i)}
              disabled={!interactive}
              className={cn(
                "group flex w-full items-start gap-3 rounded-xl border border-transparent px-2.5 py-2 text-left transition-colors",
                interactive
                  ? "hover:bg-fg-faint cursor-pointer"
                  : "cursor-default",
              )}
            >
              <div className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-all",
                    done && "border-transparent text-white",
                    active && "border-transparent text-white",
                    !done && !active && "border-stroke text-fg-muted bg-card",
                  )}
                  style={
                    done
                      ? { background: "var(--wx-gradient-warm)" }
                      : active
                        ? {
                            background: "var(--wx-gradient-warm)",
                            boxShadow: "0 0 0 4px var(--wx-glow-shadow-warm)",
                          }
                        : undefined
                  }
                >
                  {done ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span
                    className="absolute left-1/2 top-7 h-[calc(100%+0.375rem)] w-px -translate-x-1/2"
                    style={{
                      background:
                        i < current
                          ? "var(--wx-gradient-warm)"
                          : "var(--wx-rule)",
                    }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div
                  className={cn(
                    "text-[13px] font-medium leading-tight",
                    active ? "text-fg" : done ? "text-fg-secondary" : "text-fg-muted",
                  )}
                >
                  {s.label}
                </div>
                {s.description && (active || done) && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[11.5px] leading-relaxed text-fg-muted"
                  >
                    {s.description}
                  </motion.div>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function HorizontalStepper({
  steps,
  current,
  className,
}: {
  steps: Step[];
  current: number;
  className?: string;
}) {
  const pct = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0;
  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <span className="wx-mono text-[11px] font-medium text-fg-muted">
        {String(current + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
      </span>
      <div className="wx-segment flex-1" style={{ "--wx-progress": pct / 100 } as React.CSSProperties} />
      <span className="text-[11px] uppercase tracking-[0.16em] text-fg-secondary">
        {steps[current]?.label}
      </span>
    </div>
  );
}
