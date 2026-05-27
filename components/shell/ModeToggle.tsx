"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { useMode, useDevice } from "@/components/providers";
import { MODES } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ModeToggle({
  variant = "inline",
}: {
  variant?: "inline" | "stacked";
}) {
  const { mode, setMode } = useMode();
  const { device } = useDevice();
  const layoutId = useId();
  const isCompact = device === "phone" || variant === "stacked";

  return (
    <div
      role="tablist"
      aria-label="Persona mode"
      className={cn(
        "wx-focus relative inline-flex rounded-full border border-stroke bg-card/80 p-1 backdrop-blur-xl",
        isCompact ? "gap-0" : "gap-0",
      )}
      style={{ boxShadow: "0 8px 32px var(--wx-swatch-shadow)" }}
    >
      {MODES.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setMode(m.id)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center rounded-full px-3.5 text-[12.5px] font-medium transition-colors duration-300 wx-focus",
              isCompact ? "h-8" : "h-9 px-4",
              active ? "text-fg" : "text-fg-muted hover:text-fg-secondary",
            )}
          >
            {active && (
              <motion.span
                layoutId={`mode-pill-${layoutId}`}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "var(--wx-gradient-warm)",
                  boxShadow:
                    "0 6px 24px var(--wx-glow-shadow-warm), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
                transition={{ type: "spring", bounce: 0.18, duration: 0.55 }}
              />
            )}
            <span
              className={cn(
                "relative z-10",
                active && "text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]",
              )}
            >
              {isCompact ? m.label.split(" ")[0] : m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
