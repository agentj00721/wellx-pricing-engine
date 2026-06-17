"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Inbox, RefreshCw, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui/atoms";
import { useDevice } from "@/components/providers";
import { type Lead } from "@/lib/team-leads";
import { DEFAULT_PRICING, type PricingConfig } from "@/lib/pricing";
import { TeamInbox } from "./Inbox";
import { LeadDetail } from "./LeadDetail";

const DRAFT_ID = "__draft__";

function buildDraftLead(): Lead {
  return {
    id: DRAFT_ID,
    reference: "DRAFT",
    status: "submitted",
    for_who: "team",
    country: "uae",
    goals: [],
    sourcing: "direct",
    insurer: null,
    insurer_other_name: null,
    ksa_broker: null,
    broker_name: null,
    broker_email: null,
    broker_phone: null,
    company_name: "",
    authorize_wellx_contact: false,
    total_people: 100,
    employee_count: 50,
    dependant_count: 50,
    add_on_modules: [],
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    contact_role: null,
    hr_contact_email: null,
    notes: null,
    discount_pct: 0,
    pricing_pmpm: null,
    pricing_monthly: null,
    internal_notes: null,
    assigned_to: null,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    priced_at: null,
    proposed_at: null,
  };
}

type LoadState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "ready" }
  | { phase: "error"; message: string };

export function TeamExperience() {
  const { device } = useDevice();
  const [intro, setIntro] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Lead | null>(null);
  const [load, setLoad] = useState<LoadState>({ phase: "idle" });

  const fetchLeads = useCallback(async () => {
    setLoad({ phase: "loading" });
    try {
      const res = await fetch("/api/team/leads", { cache: "no-store" });
      const data = (await res.json()) as {
        ok?: boolean;
        leads?: Lead[];
        error?: string;
      };
      if (!res.ok || !data.ok || !Array.isArray(data.leads)) {
        throw new Error(data.error ?? `Failed to load (${res.status})`);
      }
      setLeads(data.leads);
      setLoad({ phase: "ready" });
    } catch (err) {
      setLoad({
        phase: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, []);

  useEffect(() => {
    if (intro) return;
    // Defer the kick-off so the effect body itself doesn't synchronously
    // dispatch a setState — the lint rule wants the fetch to look like a
    // pure subscription. Real work happens in the microtask.
    queueMicrotask(() => {
      fetchLeads();
      fetch("/api/pricing")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.config) setPricing(d.config as PricingConfig);
        })
        .catch(() => {});
    });
  }, [intro, fetchLeads]);

  /**
   * Move a lead between status columns. Optimistic: we update the local
   * state immediately and roll back if the PATCH fails.
   */
  const onMove = useCallback(
    async (id: string, status: Lead["status"]) => {
      const previous = leads;
      setLeads((ls) =>
        ls.map((l) => (l.id === id ? { ...l, status } : l)),
      );
      try {
        const res = await fetch(`/api/team/leads/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          lead?: Lead;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.lead) {
          throw new Error(data.error ?? `PATCH failed (${res.status})`);
        }
        setLeads((ls) => ls.map((l) => (l.id === id ? data.lead! : l)));
      } catch {
        // Revert
        setLeads(previous);
      }
    },
    [leads],
  );

  const onSave = useCallback(
    async (
      patch: Partial<Lead> & { status?: Lead["status"] },
    ): Promise<void> => {
      // Draft proposal — POST a new lead.
      if (draft && openLeadId === DRAFT_ID) {
        const body = {
          ...draft,
          ...patch,
          // strip non-DB fields
          id: undefined,
          reference: undefined,
          created_at: undefined,
          updated_at: undefined,
          priced_at: undefined,
          proposed_at: undefined,
        };
        const res = await fetch("/api/team/leads", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          lead?: Lead;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.lead) {
          throw new Error(data.error ?? `Save failed (${res.status})`);
        }
        // Insert into local inbox + switch the open drawer to the saved row
        setLeads((ls) => [data.lead!, ...ls]);
        setDraft(null);
        setOpenLeadId(data.lead.id);
        return;
      }

      if (!openLeadId) return;
      const previous = leads;
      // optimistic
      setLeads((ls) =>
        ls.map((l) =>
          l.id === openLeadId ? ({ ...l, ...patch } as Lead) : l,
        ),
      );
      try {
        const res = await fetch(`/api/team/leads/${openLeadId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(patch),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          lead?: Lead;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.lead) {
          throw new Error(data.error ?? `Save failed (${res.status})`);
        }
        setLeads((ls) =>
          ls.map((l) => (l.id === openLeadId ? data.lead! : l)),
        );
      } catch (err) {
        setLeads(previous);
        throw err;
      }
    },
    [draft, openLeadId, leads],
  );

  const openLead = useMemo(() => {
    if (openLeadId === DRAFT_ID) return draft;
    if (!openLeadId) return null;
    return leads.find((l) => l.id === openLeadId) ?? null;
  }, [openLeadId, draft, leads]);

  const startNewProposal = useCallback(() => {
    setDraft(buildDraftLead());
    setOpenLeadId(DRAFT_ID);
    setIntro(false);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpenLeadId(null);
    setDraft(null);
  }, []);

  if (intro) {
    return (
      <Intro
        onOpenInbox={() => setIntro(false)}
        onNewProposal={startNewProposal}
      />
    );
  }

  return (
    <div
      className={`mx-auto px-4 py-6 ${
        device === "phone" ? "" : "px-6 lg:px-8"
      } max-w-[1500px]`}
    >
      <TeamInbox
        leads={leads}
        loading={load.phase === "loading"}
        onMove={onMove}
        onOpen={(l) => setOpenLeadId(l.id)}
        onNewProposal={startNewProposal}
      />
      {load.phase === "error" && (
        <div className="mt-4 flex items-center justify-between rounded-xl border px-3 py-2 text-[12px]"
          style={{
            borderColor: "rgba(224,52,91,0.4)",
            background: "rgba(224,52,91,0.06)",
            color: "var(--wx-danger)",
          }}
        >
          <span>{load.message}</span>
          <button
            type="button"
            onClick={fetchLeads}
            className="wx-focus inline-flex items-center gap-1 text-[12px] underline-offset-2 hover:underline"
          >
            <RefreshCw size={11} /> Retry
          </button>
        </div>
      )}

      {openLead && (
        <>
          <div
            className="fixed inset-0 z-30 bg-page/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <LeadDetail
            key={openLead.id}
            lead={openLead}
            pricing={pricing}
            isDraft={openLead.id === DRAFT_ID}
            onClose={closeDrawer}
            onSave={onSave}
            onMarkWon={async () => {
              await onSave({ status: "won" });
              closeDrawer();
            }}
            onMarkLost={async () => {
              await onSave({ status: "lost" });
              closeDrawer();
            }}
          />
        </>
      )}
    </div>
  );
}

function Intro({
  onOpenInbox,
  onNewProposal,
}: {
  onOpenInbox: () => void;
  onNewProposal: () => void;
}) {
  const { device } = useDevice();
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16 lg:py-20">
      <div className="flex flex-col gap-6 max-w-2xl">
        <Eyebrow accent="warm">Pricing Cockpit</Eyebrow>
        <h1
          className={`wx-display ${
            device === "desktop"
              ? "text-6xl md:text-7xl"
              : device === "tablet"
                ? "text-5xl"
                : "text-4xl"
          } leading-[1.02]`}
        >
          Price any{" "}
          <span className="wx-gradient-text-cool">Wellx</span>
          <br />
          opportunity.
        </h1>
        <p className="max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-fg-secondary">
          Either work the inbox of briefs the Customer Studio captured, or
          spin up a new opportunity from scratch. The discount lever is
          capped at 10% for now &mdash; Founders pricing controls will
          widen this later.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={onOpenInbox}
            className="wx-focus group flex flex-col gap-2 rounded-2xl border border-stroke bg-card p-5 text-left transition-colors hover:border-wx-purple/40 wx-lift"
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: "var(--wx-gradient-warm)",
                boxShadow: "0 6px 22px var(--wx-glow-shadow-warm)",
              }}
            >
              <Inbox size={16} className="text-white" />
            </span>
            <span className="text-[15px] font-semibold text-fg mt-1">
              Open the inbox
            </span>
            <span className="text-[12.5px] text-fg-secondary leading-relaxed">
              Triage, price, and send proposals for every customer brief in
              the pipeline.
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-fg-secondary group-hover:text-fg">
              Go to inbox <ArrowRight size={12} />
            </span>
          </button>

          <button
            type="button"
            onClick={onNewProposal}
            className="wx-focus group flex flex-col gap-2 rounded-2xl border border-stroke bg-card p-5 text-left transition-colors hover:border-wx-purple/40 wx-lift"
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: "var(--wx-gradient-cool)",
                boxShadow: "0 6px 22px var(--wx-glow-shadow)",
              }}
            >
              <Sparkles size={16} className="text-white" />
            </span>
            <span className="text-[15px] font-semibold text-fg mt-1">
              Price a new opportunity
            </span>
            <span className="text-[12.5px] text-fg-secondary leading-relaxed">
              Spin up a fresh proposal without a customer-submitted brief.
              Captured straight into the pipeline.
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-fg-secondary group-hover:text-fg">
              Start fresh <ArrowRight size={12} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
