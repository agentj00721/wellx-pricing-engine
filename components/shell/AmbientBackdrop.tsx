"use client";

import { useMode } from "@/components/providers";
import { cn } from "@/lib/cn";

/**
 * The signature Wellx ambient backdrop: a deep gradient field with
 * floating soft orbs and a faint cartographic grid. Mode-aware: each
 * persona shifts the orb arrangement so the same room feels different
 * depending on who walked in.
 */
export function AmbientBackdrop({ className }: { className?: string }) {
  const { mode } = useMode();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-page" />

      {/* Cartographic grid */}
      <div className="absolute inset-0 wx-grid-overlay opacity-50" />

      {/* Top vignette */}
      <div
        className="absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(132,49,203,0.20), transparent 60%)",
        }}
      />

      {/* Mode-aware orbs */}
      {mode === "customer" && (
        <>
          <Orb
            color="var(--wx-orange)"
            size={520}
            top="-160px"
            left="-120px"
            duration="18s"
          />
          <Orb
            color="var(--wx-purple)"
            size={620}
            top="20%"
            right="-220px"
            duration="22s"
            variant={2}
          />
          <Orb
            color="var(--wx-sky)"
            size={460}
            bottom="-160px"
            left="30%"
            duration="26s"
          />
        </>
      )}
      {mode === "team" && (
        <>
          <Orb
            color="var(--wx-purple)"
            size={580}
            top="-180px"
            right="-180px"
            duration="20s"
          />
          <Orb
            color="var(--wx-pink)"
            size={500}
            top="40%"
            left="-160px"
            duration="24s"
            variant={2}
          />
          <Orb
            color="var(--wx-navy)"
            size={620}
            bottom="-220px"
            right="20%"
            duration="28s"
          />
        </>
      )}
      {mode === "founders" && (
        <>
          <Orb
            color="var(--wx-navy)"
            size={680}
            top="-220px"
            left="20%"
            duration="22s"
          />
          <Orb
            color="var(--wx-purple)"
            size={520}
            top="30%"
            right="-200px"
            duration="26s"
            variant={2}
          />
          <Orb
            color="var(--wx-orange)"
            size={420}
            bottom="-120px"
            left="-140px"
            duration="20s"
          />
        </>
      )}

      {/* Bottom fade to deepen depth */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            "linear-gradient(to top, var(--wx-page-bg), transparent)",
        }}
      />
    </div>
  );
}

function Orb({
  color,
  size,
  top,
  left,
  right,
  bottom,
  duration = "20s",
  variant = 1,
}: {
  color: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  duration?: string;
  variant?: 1 | 2;
}) {
  return (
    <div
      className="wx-orb"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        background: color,
        animation: `${
          variant === 1 ? "wx-orb" : "wx-orb-2"
        } ${duration} var(--wx-ease) infinite`,
      }}
    />
  );
}
