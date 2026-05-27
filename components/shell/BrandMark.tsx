"use client";

import { cn } from "@/lib/cn";

export function BrandMark({
  className,
  showSub = true,
}: {
  className?: string;
  showSub?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <WellxSymbol size={28} />
      <div className="flex flex-col leading-none">
        <span className="wx-wordmark wx-display text-[19px] tracking-tight">
          wellx
        </span>
        {showSub ? (
          <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-fg-muted mt-1">
            Pricing Engine
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function WellxSymbol({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/wellx-icon.png"
      width={size}
      height={size}
      alt="Wellx"
      className="shrink-0 select-none"
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}

export function BrandGlyph({ size = 26 }: { size?: number }) {
  return <WellxSymbol size={size} />;
}
