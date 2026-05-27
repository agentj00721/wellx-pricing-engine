"use client";

import { ArrowUpRight, CalendarDays, Compass } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Eyebrow, StatPill } from "@/components/ui/atoms";
import { Tag } from "@/components/ui/Panel";
import { OPPORTUNITY } from "./opportunity";

export function Snapshot({ dense }: { dense?: boolean }) {
  const o = OPPORTUNITY;
  return (
    <Panel
      eyebrow="Opportunity snapshot"
      title={
        <span className="inline-flex items-baseline gap-3">
          <span className="wx-display text-2xl wx-gradient-text">{o.account}</span>
          <span className="text-[12px] text-fg-muted">
            · {o.region} · {o.stage}
          </span>
        </span>
      }
      trailing={
        <Tag tone={o.decision === "accelerate" ? "warm" : o.decision === "pass" ? "danger" : "neutral"}>
          {o.decision}
        </Tag>
      }
    >
      <div className={`grid gap-3 ${dense ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        <StatPill label="Deal type" value={o.type.split(" ")[0]} />
        <StatPill label="TCV" value={`$${(o.tcv / 1000).toFixed(0)}K`} delta="+vs plan" />
        <StatPill
          label="Members"
          value={`${Math.round(o.membersK * 1000)}`}
          delta="+ proj. 1.2K Y2"
        />
        <StatPill label="Window" value={o.closeWindow.split("·")[1]?.trim() ?? ""} delta="warm" />
      </div>

      {!dense && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-rule bg-card-elev px-4 py-3">
          <Compass size={14} className="text-wx-purple shrink-0" />
          <p className="text-[12.5px] text-fg-secondary flex-1">
            {o.decisionNote}
          </p>
          <button className="wx-focus inline-flex items-center gap-1 text-[12px] font-medium text-fg hover:text-wx-orange">
            Open thesis <ArrowUpRight size={12} />
          </button>
        </div>
      )}
    </Panel>
  );
}

export function NextDeadline() {
  return (
    <div className="wx-card-quiet flex items-center gap-3 p-4">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          background: "var(--wx-gradient-warm)",
          boxShadow: "0 6px 22px var(--wx-glow-shadow-warm)",
        }}
      >
        <CalendarDays size={15} className="text-white" />
      </span>
      <div className="flex-1 min-w-0">
        <Eyebrow>Pricing committee</Eyebrow>
        <div className="text-[13.5px] font-semibold text-fg mt-0.5">
          Thursday · 14:00 GST
        </div>
      </div>
      <span className="wx-pill">3d</span>
    </div>
  );
}
