"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ChoiceTile({
  selected,
  onSelect,
  icon,
  title,
  description,
  hint,
  badge,
  className,
}: {
  selected?: boolean;
  onSelect?: () => void;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", duration: 0.35, bounce: 0.18 }}
      className={cn(
        "wx-focus group relative flex w-full flex-col gap-3 rounded-2xl border bg-card p-4 text-left transition-colors duration-300",
        selected
          ? "border-transparent"
          : "border-stroke hover:border-wx-purple/40",
        className,
      )}
      style={
        selected
          ? {
              boxShadow:
                "0 0 0 1.5px transparent, 0 16px 50px var(--wx-glow-shadow)",
            }
          : undefined
      }
    >
      {selected && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              padding: 1.5,
              background: "var(--wx-gradient-warm)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-[0.06]"
            style={{ background: "var(--wx-gradient-warm)" }}
          />
        </>
      )}
      <div className="flex items-start gap-3">
        {icon ? (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              selected
                ? "text-white"
                : "bg-card-elev text-fg-secondary group-hover:text-fg",
            )}
            style={
              selected
                ? {
                    background: "var(--wx-gradient-warm)",
                    boxShadow: "0 4px 14px var(--wx-glow-shadow-warm)",
                  }
                : undefined
            }
          >
            {icon}
          </div>
        ) : null}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[14px] text-fg">{title}</span>
            {badge ? (
              <span className="wx-pill text-[10px]">{badge}</span>
            ) : null}
          </div>
          {description && (
            <p className="mt-1 text-[12.5px] leading-relaxed text-fg-secondary">
              {description}
            </p>
          )}
        </div>
      </div>
      {hint && (
        <div className="text-[11px] text-fg-muted border-t border-rule pt-2.5">
          {hint}
        </div>
      )}
    </motion.button>
  );
}
