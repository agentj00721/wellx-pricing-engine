"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Globe2, Users2 } from "lucide-react";
import {
  countryFlag,
  daysSince,
  shortLabel,
  sourcingLabel,
  type Lead,
} from "@/lib/team-leads";
import { Tag } from "@/components/ui/Panel";

/**
 * Draggable lead card. Drag handle = the whole card.
 *
 * dnd-kit's activation constraint (distance: 6) means a plain click
 * (no pointer movement) fires onClick instead of starting a drag — so
 * we put onClick directly on the wrapper. No nested motion.div /
 * layout animation here: those reflow-on-every-render with dnd-kit's
 * CSS transform was triggering Safari to OOM-kill the tab after a
 * minute or so.
 */
export function LeadCard({
  lead,
  onOpen,
}: {
  lead: Lead;
  onOpen: (lead: Lead) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id });

  const days = daysSince(lead.created_at);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : "auto",
      }}
      onClick={() => onOpen(lead)}
      className={`wx-card-quiet relative cursor-grab select-none p-3 active:cursor-grabbing ${
        isDragging ? "opacity-60 shadow-2xl" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold text-fg truncate">
              {shortLabel(lead)}
            </div>
            <div className="text-[10.5px] text-fg-muted wx-mono mt-0.5">
              {lead.reference}
            </div>
          </div>
          {lead.for_who === "self" ? (
            <Tag tone="cool">Individual</Tag>
          ) : lead.country ? (
            <span className="text-[14px] leading-none">{countryFlag(lead.country)}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-fg-secondary">
          <span className="inline-flex items-center gap-1">
            <Users2 size={11} />
            {lead.total_people.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe2 size={11} />
            {sourcingLabel(lead)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10.5px] text-fg-muted">
          <span className="truncate">{lead.contact_name ?? lead.contact_email ?? "—"}</span>
          <span className="wx-mono shrink-0 ml-2">
            {days === 0 ? "today" : `${days}d ago`}
          </span>
        </div>

        {lead.add_on_modules.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {lead.add_on_modules.slice(0, 3).map((m) => (
              <span
                key={m}
                className="rounded-full bg-fg-faint px-1.5 py-0.5 text-[9.5px] text-fg-secondary"
              >
                {m === "wellx-jr"
                  ? "Wellx Jr"
                  : m === "white-label"
                    ? "White-label"
                    : m}
              </span>
            ))}
            {lead.add_on_modules.length > 3 && (
              <span className="text-[9.5px] text-fg-muted">
                +{lead.add_on_modules.length - 3}
              </span>
            )}
          </div>
        )}

        {lead.discount_pct > 0 && (
          <div className="text-[10px] text-[color:var(--wx-orange)]">
            −{lead.discount_pct}% discount applied
          </div>
        )}
      </div>
    </div>
  );
}
