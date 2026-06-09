import { NextResponse } from "next/server";
import {
  DEFAULT_PRICING,
  rowToConfig,
} from "@/lib/pricing";
import { getAnonClient } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * GET /api/pricing
 *
 * Returns the live pricing config. Centrally controlled — the Founders
 * section owns this table; the customer + team flows just read it.
 *
 * If Supabase isn't configured or the row isn't present, returns the
 * hardcoded defaults so the customer journey still has prices to show.
 */
export async function GET() {
  const supabase = getAnonClient();
  if (!supabase) {
    return NextResponse.json({ config: DEFAULT_PRICING, source: "defaults" });
  }
  const { data, error } = await supabase
    .from("pricing_config")
    .select(
      "core_pmpm, wellx_jr_pmpm, white_label_one_time, billing_period, currency, currency_symbol",
    )
    .eq("id", "default")
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({
      config: DEFAULT_PRICING,
      source: error ? "defaults (db error)" : "defaults (no row)",
    });
  }
  return NextResponse.json({ config: rowToConfig(data), source: "db" });
}
