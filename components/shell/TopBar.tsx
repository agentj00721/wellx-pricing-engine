"use client";

import { Activity, Sparkles } from "lucide-react";
import { useDevice, useMode } from "@/components/providers";
import { BrandMark } from "./BrandMark";
import { ModeToggle } from "./ModeToggle";
import { ThemeToggle } from "./ThemeToggle";
import { MODES } from "@/lib/types";

export function TopBar() {
  const { device } = useDevice();
  const { mode } = useMode();
  const current = MODES.find((m) => m.id === mode)!;

  return (
    <header
      className="sticky top-0 z-40 border-b border-stroke backdrop-blur-2xl"
      style={{ background: "var(--wx-nav-bg)" }}
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <BrandMark showSub={device !== "phone"} />

        {device !== "phone" ? (
          <div className="ml-2 hidden items-center gap-2 sm:flex">
            <span className="wx-rule w-6" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-fg-muted">
              {current.longLabel}
            </span>
          </div>
        ) : null}

        <div className="mx-auto">
          <ModeToggle />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {device === "desktop" ? <LiveStatus /> : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function LiveStatus() {
  return (
    <div className="flex items-center gap-3 rounded-full border border-stroke bg-card/70 px-3 py-1.5 backdrop-blur-md">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--wx-success)" }}
        />
        <span
          className="absolute inset-0 animate-ping rounded-full"
          style={{ background: "var(--wx-success)", opacity: 0.4 }}
        />
      </span>
      <span className="text-[11px] font-medium tracking-wide text-fg-secondary">
        Live · v0.1
      </span>
      <span className="wx-vrule h-3.5" />
      <span className="flex items-center gap-1 text-[11px] text-fg-muted">
        <Activity size={11} /> Engine ready
      </span>
      <span className="wx-vrule h-3.5" />
      <span className="flex items-center gap-1 text-[11px] text-fg-muted">
        <Sparkles size={11} className="text-wx-orange" />
        Wellx OS
      </span>
    </div>
  );
}
