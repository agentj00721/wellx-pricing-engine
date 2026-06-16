"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Building2,
  Check,
  Heart,
  Mail,
  Phone,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import {
  calcProposal,
  countryFlag,
  shortLabel,
  sourcingLabel,
  TEAM_DISCOUNT_CAP_PCT,
  type Lead,
} from "@/lib/team-leads";
import {
  DEFAULT_PRICING,
  fmtPrice,
  priceForAddOn,
  type PricingConfig,
} from "@/lib/pricing";
import { Eyebrow } from "@/components/ui/atoms";
import { Panel, PanelRow, Tag } from "@/components/ui/Panel";
import { GradientButton } from "@/components/ui/GradientButton";

type PendingPatch = Partial<{
  add_on_modules: string[];
  discount_pct: number;
  internal_notes: string;
}>;

const ADD_ONS: { id: string; label: string }[] = [
  { id: "wellx-jr", label: "Wellx Jr" },
  { id: "white-label", label: "White-label" },
];

/**
 * Sliding right-side detail drawer. Top half: read-only summary of the
 * customer's brief. Bottom half: proposal builder — toggle add-ons,
 * apply a discount (hard capped at the team cap), see live numbers,
 * save to send the lead into the "priced" or "proposed" stage.
 */
export function LeadDetail({
  lead,
  pricing = DEFAULT_PRICING,
  onClose,
  onSave,
  onMarkWon,
  onMarkLost,
}: {
  lead: Lead;
  pricing?: PricingConfig;
  onClose: () => void;
  onSave: (
    patch: PendingPatch & { status?: Lead["status"] },
  ) => Promise<void>;
  onMarkWon: () => Promise<void>;
  onMarkLost: () => Promise<void>;
}) {
  // Local state seeds from the lead. The parent re-mounts this component
  // (via `key={lead.id}`) when the user opens a different lead, so initial
  // values stay fresh without a sync-state-in-effect.
  const [discountPct, setDiscountPct] = useState<number>(lead.discount_pct ?? 0);
  const [modules, setModules] = useState<string[]>(lead.add_on_modules ?? []);
  const [notes, setNotes] = useState<string>(lead.internal_notes ?? "");
  const [saving, setSaving] = useState<null | "draft" | "send">(null);

  const numbers = useMemo(
    () =>
      calcProposal(
        { total_people: lead.total_people, add_on_modules: modules },
        pricing,
        discountPct,
      ),
    [lead.total_people, modules, pricing, discountPct],
  );

  const dirty =
    discountPct !== (lead.discount_pct ?? 0) ||
    notes !== (lead.internal_notes ?? "") ||
    JSON.stringify(modules.sort()) !==
      JSON.stringify([...(lead.add_on_modules ?? [])].sort());

  function toggleModule(id: string) {
    setModules((m) =>
      m.includes(id) ? m.filter((x) => x !== id) : [...m, id],
    );
  }

  async function persist(opts: { status?: Lead["status"]; label: "draft" | "send" }) {
    setSaving(opts.label);
    try {
      await onSave({
        add_on_modules: modules,
        discount_pct: discountPct,
        internal_notes: notes || undefined,
        status: opts.status,
      });
    } finally {
      setSaving(null);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key={lead.id}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-y-0 right-0 z-40 w-full max-w-[680px] bg-page border-l border-stroke wx-scroll overflow-y-auto"
        style={{ boxShadow: "0 0 80px var(--wx-glow-shadow)" }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stroke bg-page/85 backdrop-blur-xl px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="wx-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-fg-secondary hover:text-fg"
            aria-label="Close"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="flex flex-col items-end min-w-0">
            <span className="text-[10.5px] uppercase tracking-[0.16em] text-fg-muted">
              {lead.reference}
            </span>
            <span className="text-[15px] font-semibold text-fg truncate max-w-[420px]">
              {shortLabel(lead)}{" "}
              {lead.country ? (
                <span className="ml-0.5">{countryFlag(lead.country)}</span>
              ) : null}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="wx-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-fg-secondary hover:text-fg"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <LeadSummary lead={lead} />
          <ProposalBuilder
            lead={lead}
            pricing={pricing}
            modules={modules}
            onToggleModule={toggleModule}
            discountPct={discountPct}
            onChangeDiscount={setDiscountPct}
            numbers={numbers}
          />

          <Panel eyebrow="Internal notes" title="Just for the team">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Pricing rationale, urgency, who to involve…"
              className="wx-focus w-full resize-none rounded-xl border border-stroke bg-card-elev px-3 py-2.5 text-[13px] text-fg outline-none placeholder:text-fg-muted"
            />
          </Panel>

          <div className="sticky bottom-0 -mx-5 -mb-5 border-t border-stroke bg-page/95 backdrop-blur-xl px-5 py-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onMarkLost}
              className="wx-focus inline-flex h-11 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg hover:border-[color:var(--wx-danger)]"
            >
              Mark lost
            </button>
            <button
              type="button"
              onClick={onMarkWon}
              className="wx-focus inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-medium text-[color:var(--wx-success)]"
              style={{ borderColor: "rgba(30,169,124,0.4)" }}
            >
              <Trophy size={13} /> Mark won
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => persist({ status: "priced", label: "draft" })}
                disabled={!dirty || !!saving}
                className="wx-focus inline-flex h-11 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg disabled:opacity-40 disabled:pointer-events-none"
              >
                {saving === "draft" ? "Saving…" : "Save as priced"}
              </button>
              <GradientButton
                size="md"
                onClick={() => persist({ status: "proposed", label: "send" })}
                disabled={!!saving}
                iconRight={<Sparkles size={13} />}
              >
                {saving === "send" ? "Sending…" : "Send proposal"}
              </GradientButton>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function LeadSummary({ lead }: { lead: Lead }) {
  const employees =
    lead.employee_count ?? Math.round(lead.total_people / 2);
  const dependants =
    lead.dependant_count ?? lead.total_people - employees;
  return (
    <Panel
      eyebrow="Customer's brief"
      title={
        <span className="inline-flex items-center gap-2">
          <Building2 size={13} className="text-wx-purple" />
          What they shared
        </span>
      }
      trailing={
        <Tag
          tone={
            lead.for_who === "self"
              ? "cool"
              : lead.authorize_wellx_contact
                ? "warm"
                : "neutral"
          }
        >
          {lead.for_who === "self"
            ? "Individual"
            : lead.authorize_wellx_contact
              ? "Authorised contact"
              : "Team brief"}
        </Tag>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        <PanelRow
          label="Country"
          value={
            lead.country
              ? `${countryFlag(lead.country)} ${lead.country.toUpperCase()}`
              : "—"
          }
        />
        <PanelRow label="Sourcing" value={sourcingLabel(lead)} />
        <PanelRow label="Goals" value={(lead.goals ?? []).join(", ") || "—"} />
        <PanelRow
          label="Population"
          value={`${lead.total_people.toLocaleString()}`}
          emphasis
        />
        <PanelRow
          label="Split"
          value={`${employees.toLocaleString()} emp · ${dependants.toLocaleString()} dep`}
        />
        <PanelRow
          label="Broker"
          value={
            lead.broker_name
              ? `${lead.broker_name}`
              : "—"
          }
        />
      </div>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-rule pt-3">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-fg-muted">
          Contact
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-fg-secondary">
          {lead.contact_name && (
            <span className="font-medium text-fg">{lead.contact_name}</span>
          )}
          {lead.contact_role && <span className="text-fg-muted">· {lead.contact_role}</span>}
          {lead.contact_email && (
            <a
              href={`mailto:${lead.contact_email}`}
              className="inline-flex items-center gap-1 text-fg-secondary hover:text-fg"
            >
              <Mail size={11} /> {lead.contact_email}
            </a>
          )}
          {lead.contact_phone && (
            <a
              href={`tel:${lead.contact_phone}`}
              className="inline-flex items-center gap-1 text-fg-secondary hover:text-fg"
            >
              <Phone size={11} /> {lead.contact_phone}
            </a>
          )}
        </div>
        {lead.hr_contact_email && (
          <div className="text-[11.5px] text-fg-muted">
            HR contact (self path): {lead.hr_contact_email}
          </div>
        )}
        {lead.notes && (
          <div className="text-[12px] text-fg-secondary mt-1 italic border-l-2 border-rule pl-2">
            &ldquo;{lead.notes}&rdquo;
          </div>
        )}
      </div>
    </Panel>
  );
}

function ProposalBuilder({
  lead,
  pricing,
  modules,
  onToggleModule,
  discountPct,
  onChangeDiscount,
  numbers,
}: {
  lead: Lead;
  pricing: PricingConfig;
  modules: string[];
  onToggleModule: (id: string) => void;
  discountPct: number;
  onChangeDiscount: (v: number) => void;
  numbers: ReturnType<typeof calcProposal>;
}) {
  return (
    <Panel
      eyebrow="Proposal builder"
      title={
        <span className="inline-flex items-baseline gap-2">
          <Heart size={13} className="text-wx-orange relative top-0.5" />
          Shape the offer
        </span>
      }
      trailing={
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white"
          style={{ background: "var(--wx-gradient-warm)" }}
        >
          <Check size={10} /> Wellx Core · {fmtPrice(pricing.corePmpm, pricing)}/mo
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-fg-muted mb-2">
            Add-ons
          </div>
          <div className="flex flex-wrap gap-2">
            {ADD_ONS.map((m) => {
              const active = modules.includes(m.id);
              const price = priceForAddOn(m.id, pricing);
              const label = price
                ? price.kind === "pmpm"
                  ? `+${fmtPrice(price.amount, pricing)} pmpm`
                  : `+${fmtPrice(price.amount, pricing)} one-time`
                : "";
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onToggleModule(m.id)}
                  className={`wx-focus inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    active
                      ? "border-transparent text-white"
                      : "border-stroke text-fg-secondary hover:text-fg"
                  }`}
                  style={
                    active
                      ? { background: "var(--wx-gradient-warm)" }
                      : undefined
                  }
                >
                  {active ? <Check size={11} /> : null}
                  {m.label}
                  <span
                    className={`text-[10px] ${
                      active ? "text-white/80" : "text-fg-muted"
                    } wx-mono`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          {modules.some((m) => !(lead.add_on_modules ?? []).includes(m)) ||
          (lead.add_on_modules ?? []).some((m) => !modules.includes(m)) ? (
            <p className="text-[11px] text-fg-muted mt-2">
              Customer originally chose:{" "}
              {(lead.add_on_modules ?? []).map((m) => m).join(", ") || "none"}.
            </p>
          ) : null}
        </div>

        <DiscountSlider
          value={discountPct}
          onChange={onChangeDiscount}
          cap={TEAM_DISCOUNT_CAP_PCT}
        />

        <PricingSummary numbers={numbers} pricing={pricing} />
      </div>
    </Panel>
  );
}

function DiscountSlider({
  value,
  onChange,
  cap,
}: {
  value: number;
  onChange: (v: number) => void;
  cap: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Eyebrow accent="warm">Discount</Eyebrow>
        <span className="wx-mono text-[15px] font-semibold text-fg">
          {value.toFixed(1)}%
          <span className="text-[11px] text-fg-muted font-medium ml-1">
            / cap {cap}%
          </span>
        </span>
      </div>
      <div className="relative h-6 select-none">
        <div
          className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
          style={{ background: "var(--wx-text-faint)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${(value / cap) * 100}%`,
              background: "var(--wx-gradient-warm)",
              transition: "width 120ms var(--wx-ease)",
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={cap}
          step={0.5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`Discount percent (0 to ${cap})`}
        />
        <div
          aria-hidden
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white"
          style={{
            left: `${(value / cap) * 100}%`,
            background: "var(--wx-gradient-warm)",
            boxShadow: "0 4px 12px var(--wx-glow-shadow-warm)",
            transition: "left 120ms var(--wx-ease)",
          }}
        />
      </div>
      <p className="text-[10.5px] text-fg-muted">
        Team cap is {cap}% for now. Founders pricing controls will let you
        widen this per-rep later.
      </p>
    </div>
  );
}

function PricingSummary({
  numbers,
  pricing,
}: {
  numbers: ReturnType<typeof calcProposal>;
  pricing: PricingConfig;
}) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-3"
      style={{
        borderColor: "transparent",
        background:
          "linear-gradient(135deg, rgba(251,155,53,0.06), rgba(132,49,203,0.06))",
      }}
    >
      <div className="flex items-baseline justify-between">
        <div>
          <Eyebrow accent="warm">Net per member / month</Eyebrow>
          <div className="wx-display wx-mono text-3xl mt-1 text-fg">
            {fmtPrice(numbers.netPmpm, pricing)}
          </div>
        </div>
        <div className="text-right text-[11px] text-fg-muted leading-relaxed">
          List {fmtPrice(numbers.listPmpm, pricing)} <br />
          −{numbers.discountPct.toFixed(1)}% ={" "}
          <span className="text-fg-secondary wx-mono">
            {fmtPrice(numbers.netPmpm, pricing)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Cell
          label="Monthly net"
          value={fmtPrice(numbers.netMonthly, pricing)}
        />
        <Cell
          label="Annual net"
          value={fmtPrice(numbers.annualNet, pricing)}
          emphasis
        />
        <Cell
          label="One-time"
          value={fmtPrice(numbers.oneTime, pricing)}
        />
        <Cell label="TCV (Y1)" value={fmtPrice(numbers.tcv, pricing)} emphasis />
      </div>

      {numbers.discountPct > 0 && (
        <div className="text-[11px] text-[color:var(--wx-orange)]">
          Discount value: {fmtPrice(numbers.discountMonthly, pricing)} / month
          ({fmtPrice(numbers.discountMonthly * 12, pricing)} / year)
        </div>
      )}
    </div>
  );
}

function Cell({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-xl border border-rule bg-card-elev/70 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">
        {label}
      </div>
      <div
        className={`wx-display wx-mono mt-0.5 text-[16px] ${emphasis ? "text-fg" : "text-fg-secondary"}`}
      >
        {value}
      </div>
    </div>
  );
}
