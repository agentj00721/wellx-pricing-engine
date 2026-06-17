"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Inbox, Plus, Search } from "lucide-react";
import {
  countryFlag,
  LEAD_STATUSES,
  shortLabel,
  STATUS_META,
  type Lead,
} from "@/lib/team-leads";
import { LeadCard } from "./LeadCard";
import { Eyebrow, StatPill } from "@/components/ui/atoms";

const COUNTRY_OPTIONS: { id: "all" | "uae" | "ksa" | "ph"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "uae", label: "🇦🇪 UAE" },
  { id: "ksa", label: "🇸🇦 Saudi" },
  { id: "ph", label: "🇵🇭 PH" },
];

/**
 * Kanban inbox. Drag a card between columns to move it through the
 * pipeline; clicking opens the detail drawer.
 *
 * Status moves are optimistic — we update local state immediately and
 * reconcile with the server response. If the PATCH fails, we revert.
 */
export function TeamInbox({
  leads,
  loading,
  onMove,
  onOpen,
  onNewProposal,
}: {
  leads: Lead[];
  loading?: boolean;
  onMove: (id: string, status: Lead["status"]) => Promise<void>;
  onOpen: (lead: Lead) => void;
  onNewProposal: () => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<"all" | "uae" | "ksa" | "ph">("all");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (country !== "all" && l.country !== country) return false;
      if (!q) return true;
      const hay = [
        l.company_name,
        l.contact_name,
        l.contact_email,
        l.reference,
        l.broker_name,
        l.insurer_other_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [leads, country, search]);

  const byStatus = useMemo(() => {
    const map = new Map<Lead["status"], Lead[]>();
    for (const s of LEAD_STATUSES) map.set(s, []);
    for (const l of filtered) {
      const col = (LEAD_STATUSES as readonly string[]).includes(l.status)
        ? l.status
        : "submitted";
      map.get(col as (typeof LEAD_STATUSES)[number])?.push(l);
    }
    return map;
  }, [filtered]);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  const stats = useMemo(() => {
    const total = leads.length;
    const submitted = leads.filter((l) => l.status === "submitted").length;
    const priced = leads.filter((l) => l.status === "priced").length;
    const won = leads.filter((l) => l.status === "won").length;
    return { total, submitted, priced, won };
  }, [leads]);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!e.over) return;
    const lead = leads.find((l) => l.id === String(e.active.id));
    if (!lead) return;
    const newStatus = e.over.id as Lead["status"];
    if (lead.status === newStatus) return;
    onMove(lead.id, newStatus);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header — quick stats */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Eyebrow accent="warm">Pricing Cockpit</Eyebrow>
            <h1 className="wx-display text-3xl sm:text-4xl text-fg leading-tight mt-1">
              <span className="wx-gradient-text">Lead inbox</span>
            </h1>
            <p className="text-[13.5px] text-fg-secondary mt-1 max-w-xl">
              Every brief the Customer Studio captured. Drag a card to move
              it through the pipeline; click to price it.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button
              type="button"
              onClick={onNewProposal}
              className="wx-focus inline-flex h-10 items-center gap-2 rounded-full px-4 text-[12.5px] font-medium text-white"
              style={{
                background: "var(--wx-gradient-warm)",
                boxShadow: "0 8px 24px var(--wx-glow-shadow-warm)",
              }}
            >
              <Plus size={13} /> New proposal
            </button>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-0">
              <StatPill label="Total" value={String(stats.total)} />
              <StatPill label="New" value={String(stats.submitted)} delta="+inbox" />
              <StatPill label="Priced" value={String(stats.priced)} />
              <StatPill label="Won" value={String(stats.won)} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-stroke bg-card px-3 py-1.5 flex-1 max-w-md min-w-[200px]">
            <Search size={13} className="text-fg-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, contact, broker…"
              className="wx-focus flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg-muted"
            />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-stroke bg-card p-1">
            {COUNTRY_OPTIONS.map((c) => {
              const active = country === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCountry(c.id)}
                  className={`rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                    active
                      ? "text-white"
                      : "text-fg-secondary hover:text-fg"
                  }`}
                  style={
                    active
                      ? { background: "var(--wx-gradient-warm)" }
                      : undefined
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Kanban */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-3 overflow-x-auto pb-3 wx-scroll">
          {LEAD_STATUSES.map((s) => {
            const cards = byStatus.get(s) ?? [];
            return (
              <KanbanColumn
                key={s}
                status={s}
                count={cards.length}
                leads={cards}
                onOpen={onOpen}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="wx-card-quiet w-[260px] p-3 shadow-2xl opacity-95 rotate-1">
              <div className="text-[13.5px] font-semibold text-fg">
                {shortLabel(activeLead)}
              </div>
              <div className="text-[10.5px] text-fg-muted wx-mono mt-0.5">
                {activeLead.reference} ·{" "}
                {activeLead.country ? countryFlag(activeLead.country) : ""}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {loading && (
        <div className="text-center text-[12px] text-fg-muted py-4">
          Loading leads…
        </div>
      )}
      {!loading && leads.length === 0 && (
        <div className="wx-card-quiet flex flex-col items-center gap-3 py-12 px-4 text-center">
          <Inbox size={28} className="text-fg-muted" />
          <div className="text-[14px] font-medium text-fg">
            No leads in the inbox yet.
          </div>
          <p className="text-[12.5px] text-fg-secondary max-w-sm">
            When a customer submits a brief through the Customer Studio,
            it&rsquo;ll land here. The kanban will fill up as the
            pipeline moves.
          </p>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({
  status,
  count,
  leads,
  onOpen,
}: {
  status: (typeof LEAD_STATUSES)[number];
  count: number;
  leads: Lead[];
  onOpen: (lead: Lead) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  const meta = STATUS_META[status];

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-2 rounded-2xl border border-stroke bg-card-elev/50 p-2 min-h-[240px] transition-colors"
      style={{
        background: isOver
          ? "linear-gradient(180deg, rgba(251,155,53,0.08), rgba(132,49,203,0.04))"
          : undefined,
        borderColor: isOver
          ? "rgba(132,49,203,0.4)"
          : "var(--wx-section-stroke)",
      }}
    >
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background:
                meta.tone === "warm"
                  ? "var(--wx-orange)"
                  : meta.tone === "cool"
                    ? "var(--wx-sky)"
                    : meta.tone === "success"
                      ? "var(--wx-success)"
                      : "var(--wx-text-muted)",
            }}
          />
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-fg">
            {meta.label}
          </span>
          <span className="text-[10.5px] text-fg-muted wx-mono">{count}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {leads.map((l) => (
          <LeadCard key={l.id} lead={l} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
