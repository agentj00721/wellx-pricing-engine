"use client";

import { useEffect, useState } from "react";
import { Sliders } from "lucide-react";
import { Panel, PanelRow, Tag } from "@/components/ui/Panel";
import {
  DEFAULT_PRICING,
  fmtPrice,
  type PricingConfig,
} from "@/lib/pricing";

/**
 * Read-only view of the live pricing configuration. The Founders section
 * is where the prices are centrally controlled — the editor is coming, but
 * this card already surfaces the current values from the DB so we can
 * see what the customer journey is rendering.
 */
export function PricingControls() {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [source, setSource] = useState<string>("defaults");

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/pricing", { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.config) {
          setPricing(data.config as PricingConfig);
          if (data.source) setSource(data.source as string);
        }
      })
      .catch(() => {
        // keep defaults
      });
    return () => ac.abort();
  }, []);

  const billingTag =
    pricing.billingPeriod === "annual" ? "Billed annually" : "Billed monthly";

  return (
    <Panel
      eyebrow={
        <span className="inline-flex items-center gap-1.5">
          <Sliders size={11} className="text-wx-orange" />
          Pricing controls
        </span>
      }
      title="What the customer sees"
      trailing={<Tag tone={source === "db" ? "success" : "warning"}>{source}</Tag>}
    >
      <div className="flex flex-col gap-2">
        <PanelRow
          label="Wellx Core (per member / month)"
          value={fmtPrice(pricing.corePmpm, pricing)}
          emphasis
        />
        <PanelRow
          label="Wellx Jr add-on (per member / month)"
          value={`+${fmtPrice(pricing.wellxJrPmpm, pricing)}`}
        />
        <PanelRow
          label="White-label (one-time)"
          value={`+${fmtPrice(pricing.whiteLabelOneTime, pricing)}`}
        />
        <PanelRow label="Currency" value={pricing.currency} />
        <PanelRow label="Billing" value={billingTag} />
      </div>
      <p className="mt-3 text-[11.5px] text-fg-muted leading-relaxed">
        These flow into the Customer Studio quote and the Team pricing
        cockpit. The Team can apply discounts on a per-deal basis; the
        per-rep discount matrix is set here too (editor coming).
      </p>
    </Panel>
  );
}
