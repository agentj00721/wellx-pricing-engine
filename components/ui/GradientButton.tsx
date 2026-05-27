"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
};

export const GradientButton = forwardRef<HTMLButtonElement, Props>(
  function GradientButton(
    {
      children,
      className,
      variant = "primary",
      size = "md",
      iconLeft,
      iconRight,
      fullWidth,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "wx-focus group relative inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-300",
          "rounded-full",
          size === "sm" && "h-9 px-4 text-[12.5px]",
          size === "md" && "h-11 px-5 text-[13.5px]",
          size === "lg" && "h-12 px-6 text-[14px]",
          variant === "primary" &&
            "text-white shadow-[0_10px_30px_var(--wx-glow-shadow)] hover:shadow-[0_14px_40px_var(--wx-glow-shadow)]",
          variant === "secondary" &&
            "border border-stroke bg-card text-fg hover:border-wx-purple/30",
          variant === "outline" &&
            "border border-stroke bg-transparent text-fg-secondary hover:text-fg hover:border-wx-purple/40",
          variant === "ghost" &&
            "bg-transparent text-fg-secondary hover:text-fg hover:bg-fg-faint",
          variant === "danger" &&
            "bg-[color:var(--wx-danger)] text-white shadow-[0_10px_30px_rgba(224,52,91,0.25)] hover:shadow-[0_14px_40px_rgba(224,52,91,0.35)]",
          fullWidth && "w-full",
          "disabled:opacity-40 disabled:pointer-events-none",
          className,
        )}
        {...rest}
      >
        {variant === "primary" && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: "var(--wx-gradient-warm)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.18)",
            }}
          />
        )}
        {variant === "primary" && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(135deg, #f1517b, #b43082 40%, #8431cb 80%, #35c5fc)",
            }}
          />
        )}
        {iconLeft ? (
          <span className="relative z-10 inline-flex">{iconLeft}</span>
        ) : null}
        <span className="relative z-10">{children}</span>
        {iconRight ? (
          <span className="relative z-10 inline-flex">{iconRight}</span>
        ) : null}
      </button>
    );
  },
);
