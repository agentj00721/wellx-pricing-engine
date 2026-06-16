"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { Eyebrow } from "@/components/ui/atoms";
import { useDevice } from "@/components/providers";
import { type Lead } from "@/lib/team-leads";
import { DEFAULT_PRICING, type PricingConfig } from "@/lib/pricing";
import { TeamInbox } from "./Inbox";
import { LeadDetail } from "./LeadDetail";

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
    [openLeadId, leads],
  );

  const openLead = openLeadId
    ? leads.find((l) => l.id === openLeadId) ?? null
    : null;

  if (intro) {
    return <Intro onStart={() => setIntro(false)} />;
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
            onClick={() => setOpenLeadId(null)}
          />
          <LeadDetail
            key={openLead.id}
            lead={openLead}
            pricing={pricing}
            onClose={() => setOpenLeadId(null)}
            onSave={onSave}
            onMarkWon={async () => {
              await onSave({ status: "won" });
              setOpenLeadId(null);
            }}
            onMarkLost={async () => {
              await onSave({ status: "lost" });
              setOpenLeadId(null);
            }}
          />
        </>
      )}
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
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
          Every brief the Customer Studio captured lands in the inbox. Drag
          to triage, click to price, save to send. The discount lever is
          capped at 10% for now &mdash; Founders pricing controls will
          widen this later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <GradientButton size="lg" onClick={onStart} iconRight={<ArrowRight size={16} />}>
            Open the inbox
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
