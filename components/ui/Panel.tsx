"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Panel({
  title,
  eyebrow,
  trailing,
  children,
  className,
  dense,
}: {
  title?: ReactNode;
  eyebrow?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
  dense?: boolean;
}) {
  return (
    <section className={cn("wx-card flex flex-col", className)}>
      {(title || eyebrow || trailing) && (
        <header
          className={cn(
            "flex items-center gap-3 border-b border-stroke",
            dense ? "px-4 py-3" : "px-5 py-4",
          )}
        >
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <div className="wx-eyebrow mb-1">{eyebrow}</div>
            )}
            {title && (
              <h3 className="wx-display text-[15px] sm:text-[16px] text-fg leading-tight">
                {title}
              </h3>
            )}
          </div>
          {trailing && <div className="shrink-0">{trailing}</div>}
        </header>
      )}
      <div className={cn(dense ? "p-4" : "p-5", "flex-1")}>{children}</div>
    </section>
  );
}

export function PanelRow({
  label,
  value,
  trailing,
  emphasis,
}: {
  label: ReactNode;
  value?: ReactNode;
  trailing?: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-rule last:border-b-0">
      <span className="text-[12.5px] text-fg-secondary">{label}</span>
      <span className="flex items-center gap-2">
        {value !== undefined && (
          <span
            className={cn(
              "text-[13px] wx-mono",
              emphasis ? "text-fg font-semibold" : "text-fg-secondary",
            )}
          >
            {value}
          </span>
        )}
        {trailing}
      </span>
    </div>
  );
}

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "warm" | "cool" | "success" | "warning" | "danger";
  className?: string;
}) {
  const styles: Record<typeof tone, string> = {
    neutral: "bg-fg-faint text-fg-secondary",
    warm: "text-white",
    cool: "text-white",
    success: "text-[color:var(--wx-success)] bg-[rgba(30,169,124,0.12)]",
    warning: "text-[color:var(--wx-orange)] bg-[rgba(251,155,53,0.12)]",
    danger: "text-[color:var(--wx-danger)] bg-[rgba(224,52,91,0.12)]",
  } as const;
  const gradientStyle =
    tone === "warm" || tone === "cool"
      ? {
          background:
            tone === "warm"
              ? "var(--wx-gradient-warm)"
              : "var(--wx-gradient-cool)",
        }
      : undefined;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em]",
        styles[tone],
        className,
      )}
      style={gradientStyle}
    >
      {children}
    </span>
  );
}
