/**
 * Pricing configuration.
 *
 * The values below are the canonical Wellx prices. They're also held in
 * the `pricing_config` table in Supabase — the live values can be edited
 * there (today via SQL, eventually via the Founders pricing editor),
 * and the running app picks them up. These constants are the fallback
 * when the API is unreachable or the row hasn't been seeded.
 */

export type PricingConfig = {
  /** Core bundle: app + HR portal + behavioural engine. Per member, per month. */
  corePmpm: number;
  /** Wellx Jr add-on. Per member, per month. */
  wellxJrPmpm: number;
  /** White-label add-on. One-time fee. */
  whiteLabelOneTime: number;
  /** "annual" or "monthly" — informational, drives copy. */
  billingPeriod: "annual" | "monthly";
  /** ISO 4217 currency code. */
  currency: string;
  /** Currency symbol for display ($/£/AED etc.) */
  currencySymbol: string;
};

export const DEFAULT_PRICING: PricingConfig = {
  corePmpm: 4,
  wellxJrPmpm: 2,
  whiteLabelOneTime: 10_000,
  billingPeriod: "annual",
  currency: "USD",
  currencySymbol: "$",
};

export function priceForAddOn(
  id: string,
  cfg: PricingConfig,
): { kind: "pmpm" | "one-time"; amount: number } | null {
  if (id === "wellx-jr") return { kind: "pmpm", amount: cfg.wellxJrPmpm };
  if (id === "white-label")
    return { kind: "one-time", amount: cfg.whiteLabelOneTime };
  return null;
}

/** Format a number as a price string with currency symbol. */
export function fmtPrice(amount: number, cfg: PricingConfig): string {
  return `${cfg.currencySymbol}${amount.toLocaleString(undefined, {
    maximumFractionDigits: amount < 100 ? 2 : 0,
  })}`;
}

export function calcIndicativeMonthly(
  members: number,
  addOnIds: string[],
  cfg: PricingConfig,
): { monthlyPmpm: number; oneTime: number } {
  let monthlyPmpm = cfg.corePmpm;
  let oneTime = 0;
  for (const id of addOnIds) {
    const p = priceForAddOn(id, cfg);
    if (!p) continue;
    if (p.kind === "pmpm") monthlyPmpm += p.amount;
    else oneTime += p.amount;
  }
  return {
    monthlyPmpm,
    oneTime,
  };
}

/** Shape returned by /api/pricing — keys match DB columns. */
type PricingRow = {
  core_pmpm: number;
  wellx_jr_pmpm: number;
  white_label_one_time: number;
  billing_period: "annual" | "monthly";
  currency: string;
  currency_symbol: string;
};

export function rowToConfig(row: Partial<PricingRow> | null | undefined): PricingConfig {
  if (!row) return DEFAULT_PRICING;
  return {
    corePmpm: Number(row.core_pmpm ?? DEFAULT_PRICING.corePmpm),
    wellxJrPmpm: Number(row.wellx_jr_pmpm ?? DEFAULT_PRICING.wellxJrPmpm),
    whiteLabelOneTime: Number(
      row.white_label_one_time ?? DEFAULT_PRICING.whiteLabelOneTime,
    ),
    billingPeriod:
      (row.billing_period as PricingConfig["billingPeriod"]) ??
      DEFAULT_PRICING.billingPeriod,
    currency: row.currency ?? DEFAULT_PRICING.currency,
    currencySymbol: row.currency_symbol ?? DEFAULT_PRICING.currencySymbol,
  };
}
