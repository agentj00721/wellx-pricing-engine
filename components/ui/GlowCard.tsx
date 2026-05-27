"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "elev" | "quiet" | "outline" | "gradient";

type GlowCardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  glow?: boolean;
  interactive?: boolean;
  inset?: "sm" | "md" | "lg" | "none";
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
};

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  function GlowCard(
    {
      children,
      className,
      variant = "default",
      glow = false,
      interactive = false,
      inset = "md",
      eyebrow,
      title,
      description,
      trailing,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          variant === "quiet" ? "wx-card-quiet" : "wx-card",
          variant === "elev" && "wx-card-elev",
          variant === "outline" && "border-2 border-stroke bg-transparent",
          glow && "wx-card-glow",
          interactive && "wx-lift cursor-pointer",
          inset === "sm" && "p-4",
          inset === "md" && "p-5 sm:p-6",
          inset === "lg" && "p-6 sm:p-8",
          className,
        )}
        {...rest}
      >
        {(eyebrow || title || description || trailing) && (
          <div className="mb-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              {eyebrow && (
                <div className="wx-eyebrow mb-2">{eyebrow}</div>
              )}
              {title && (
                <h3 className="wx-display text-lg sm:text-xl text-fg">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1.5 text-sm leading-relaxed text-fg-secondary">
                  {description}
                </p>
              )}
            </div>
            {trailing && <div className="shrink-0">{trailing}</div>}
          </div>
        )}
        {children}
      </div>
    );
  },
);
