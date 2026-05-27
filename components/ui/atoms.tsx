"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "warm" | "cool" | "none";
}) {
  return (
    <span
      className={cn(
        "wx-eyebrow inline-flex items-center gap-2",
        className,
      )}
    >
      {accent && accent !== "none" ? (
        <span
          aria-hidden
          className="h-[3px] w-6 rounded-full"
          style={{
            background:
              accent === "warm"
                ? "var(--wx-gradient-warm)"
                : "var(--wx-gradient-cool)",
          }}
        />
      ) : null}
      {children}
    </span>
  );
}

export function StatPill({
  label,
  value,
  delta,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  className?: string;
}) {
  const positive = delta?.startsWith("+");
  return (
    <div
      className={cn(
        "wx-card-quiet flex flex-col gap-1 px-4 py-3",
        className,
      )}
    >
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
        {label}
      </span>
      <span className="wx-display text-xl text-fg wx-mono">{value}</span>
      {delta ? (
        <span
          className={cn(
            "text-[11px] font-medium",
            positive ? "text-[color:var(--wx-success)]" : "text-[color:var(--wx-danger)]",
          )}
        >
          {delta}
        </span>
      ) : null}
    </div>
  );
}

export function KineticDot({
  color = "var(--wx-orange)",
  size = 6,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: color }}
      />
      <span
        className="absolute inset-0 animate-ping rounded-full"
        style={{ background: color, opacity: 0.4 }}
      />
    </span>
  );
}

export function GradientBar({
  value,
  className,
  variant = "warm",
}: {
  value: number;
  className?: string;
  variant?: "warm" | "cool" | "full";
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-fg-faint",
        className,
      )}
    >
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: v / 100 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 origin-left rounded-full"
        style={{
          background:
            variant === "warm"
              ? "var(--wx-gradient-warm)"
              : variant === "cool"
                ? "var(--wx-gradient-cool)"
                : "var(--wx-gradient-full)",
        }}
      />
    </div>
  );
}

export function RadialScore({
  value,
  size = 96,
  thickness = 9,
  label,
}: {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`radial-${size}-${value}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb9b35" />
            <stop offset="40%" stopColor="#f1517b" />
            <stop offset="80%" stopColor="#8431cb" />
            <stop offset="100%" stopColor="#35c5fc" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          stroke="var(--wx-text-faint)"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          stroke={`url(#radial-${size}-${value})`}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * v) / 100 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="wx-display wx-mono text-2xl">{v}</span>
        {label && (
          <span className="text-[10px] uppercase tracking-[0.16em] text-fg-muted mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export function StepDot({
  index,
  active,
  done,
}: {
  index: number;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold",
        done
          ? "border-transparent text-white"
          : active
            ? "border-transparent text-white"
            : "border-stroke bg-card text-fg-muted",
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
      {done ? "✓" : index}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
  accent = "warm",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
  accent?: "warm" | "cool" | "none";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow accent={accent}>{eyebrow}</Eyebrow>}
      <h2 className="wx-display text-2xl sm:text-3xl text-fg">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-[14px] sm:text-[15px] leading-relaxed text-fg-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}
