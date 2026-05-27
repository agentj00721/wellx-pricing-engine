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
      <BrandGlyph />
      <div className="flex flex-col leading-none">
        <span className="wx-display text-[17px] tracking-tight">
          <span className="wx-gradient-text">wellx</span>
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

export function BrandGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id="wx-glyph" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#fb9b35" />
          <stop offset="25%" stopColor="#f1517b" />
          <stop offset="55%" stopColor="#b43082" />
          <stop offset="80%" stopColor="#8431cb" />
          <stop offset="100%" stopColor="#35c5fc" />
        </linearGradient>
        <radialGradient id="wx-glyph-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" stroke="url(#wx-glyph)" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="8" fill="url(#wx-glyph)" opacity="0.18" />
      <circle cx="16" cy="16" r="5" fill="url(#wx-glyph-core)" />
      <circle cx="16" cy="16" r="1.6" fill="#ffffff" />
    </svg>
  );
}
