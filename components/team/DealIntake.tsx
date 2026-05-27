"use client";

import { Building2, MapPin, Users2 } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Eyebrow } from "@/components/ui/atoms";
import { cn } from "@/lib/cn";
import { STAGES, type DealState } from "./deal";

export function DealIntake({
  deal,
  set,
}: {
  deal: DealState;
  set: (p: Partial<DealState>) => void;
}) {
  return (
    <Panel
      eyebrow="Deal intake"
      title="Opportunity profile"
      trailing={<StageBadge stage={deal.stage} />}
    >
      <div className="flex flex-col gap-5">
        <Field label="Account">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-fg-muted shrink-0" />
            <input
              value={deal.account}
              onChange={(e) => set({ account: e.target.value })}
              className="wx-focus flex-1 bg-transparent text-[14px] font-medium text-fg outline-none placeholder:text-fg-muted"
            />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Region">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-fg-muted shrink-0" />
              <select
                value={deal.region}
                onChange={(e) => set({ region: e.target.value })}
                className="wx-focus flex-1 bg-transparent text-[13.5px] text-fg outline-none"
              >
                {["UAE", "KSA", "Qatar", "Kuwait", "Bahrain", "Oman", "Egypt"].map(
                  (r) => (
                    <option key={r}>{r}</option>
                  ),
                )}
              </select>
            </div>
          </Field>

          <Field label="Deal type">
            <select
              value={deal.type}
              onChange={(e) => set({ type: e.target.value as DealState["type"] })}
              className="wx-focus w-full bg-transparent text-[13.5px] text-fg outline-none"
            >
              <option value="direct">Direct</option>
              <option value="broker">Broker-led</option>
              <option value="white-label">White-label</option>
              <option value="embedded">Embedded</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Members">
            <div className="flex items-center gap-2">
              <Users2 size={14} className="text-fg-muted shrink-0" />
              <input
                type="number"
                value={deal.members}
                min={1}
                onChange={(e) =>
                  set({ members: Math.max(1, Number(e.target.value) || 0) })
                }
                className="wx-focus flex-1 bg-transparent text-[14px] font-medium text-fg outline-none wx-mono"
              />
            </div>
          </Field>

          <Field label="Segment">
            <select
              value={deal.segment}
              onChange={(e) =>
                set({ segment: e.target.value as DealState["segment"] })
              }
              className="wx-focus w-full bg-transparent text-[13.5px] text-fg outline-none capitalize"
            >
              <option value="executive">Executive</option>
              <option value="professional">Professional</option>
              <option value="frontline">Frontline</option>
              <option value="mixed">Mixed</option>
            </select>
          </Field>
        </div>

        <Field label="Stage">
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s) => {
              const active = s.id === deal.stage;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set({ stage: s.id })}
                  className={cn(
                    "wx-focus rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors",
                    active
                      ? "text-white"
                      : "border border-stroke text-fg-secondary hover:text-fg",
                  )}
                  style={
                    active
                      ? {
                          background: "var(--wx-gradient-warm)",
                          boxShadow: "0 4px 14px var(--wx-glow-shadow-warm)",
                        }
                      : undefined
                  }
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    </Panel>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow>{label}</Eyebrow>
      <div className="border-b border-rule pb-2">{children}</div>
    </div>
  );
}

function StageBadge({ stage }: { stage: DealState["stage"] }) {
  const i = STAGES.findIndex((s) => s.id === stage);
  const pct = ((i + 1) / STAGES.length) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:block h-1 w-16 overflow-hidden rounded-full bg-fg-faint">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "var(--wx-gradient-warm)",
          }}
        />
      </div>
      <span className="text-[11px] uppercase tracking-[0.16em] text-fg-muted">
        Stage {i + 1}/{STAGES.length}
      </span>
    </div>
  );
}
