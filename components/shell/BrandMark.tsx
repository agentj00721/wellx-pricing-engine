"use client";

import { cn } from "@/lib/cn";

/**
 * BrandMark uses the official Wellx wordmark lockup. The PNG already
 * contains the symbol + "wellx" wordmark in the brand's exact typography
 * — we just swap the file by theme so it sits properly on light/dark
 * backgrounds.
 *
 * 3000×1444 source aspect = ~2.077:1, so we size by height and let
 * width follow.
 */
export function BrandMark({
  className,
  height = 28,
  showSub = true,
}: {
  className?: string;
  height?: number;
  showSub?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Wordmark height={height} />
      {showSub ? (
        <span className="hidden sm:flex items-center self-stretch">
          <span
            className="h-4 w-px"
            style={{ background: "var(--wx-rule)" }}
          />
          <span className="ml-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
            Pricing Engine
          </span>
        </span>
      ) : null}
    </div>
  );
}

/**
 * The full Wellx lockup as a single image. We render both variants and
 * toggle their visibility off `[data-theme]` so the right one is up
 * pre-paint (no flash on hydration).
 */
export function Wordmark({ height = 28 }: { height?: number }) {
  const w = Math.round(height * (3000 / 1444));
  const wrap = { height, width: w } as const;
  return (
    <span
      className="wx-wordmark-lockup relative inline-flex shrink-0 select-none"
      style={wrap}
      aria-label="Wellx"
    >
      {/* Light-mode mark (dark text on light bg). */}
      <img
        src="/wellx-wordmark.png"
        alt="Wellx"
        width={w}
        height={height}
        draggable={false}
        className="wx-wordmark-img wx-wordmark-light absolute inset-0 h-full w-full object-contain"
      />
      {/* Dark-mode mark (light text on dark bg). */}
      <img
        src="/wellx-wordmark-white.png"
        alt=""
        aria-hidden
        width={w}
        height={height}
        draggable={false}
        className="wx-wordmark-img wx-wordmark-dark absolute inset-0 h-full w-full object-contain"
      />
    </span>
  );
}

/** Just the gradient W symbol — for compact spots (favicons, avatars). */
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

/** Backwards-compat alias for older imports. */
export function BrandGlyph({ size = 26 }: { size?: number }) {
  return <WellxSymbol size={size} />;
}
