import { NextResponse, type NextRequest } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

const STATUS = new Set([
  "submitted",
  "triaged",
  "qualified",
  "priced",
  "proposed",
  "won",
  "lost",
  "archived",
]);

const PATCH_KEYS = new Set([
  "status",
  "discount_pct",
  "pricing_pmpm",
  "pricing_monthly",
  "internal_notes",
  "assigned_to",
  "add_on_modules",
]);

// Business cap on team-applied discount. Founders config will own this
// once the pricing-config editor lands.
const TEAM_DISCOUNT_CAP_PCT = 10;

/**
 * PATCH /api/team/leads/[id]
 *
 * Updates fields on a lead from the team cockpit. Uses the service-role
 * client. Enforces:
 *   - status is in the allowed enum
 *   - discount_pct is between 0 and the team cap (currently 10%)
 *
 * Automatically stamps priced_at when status moves into 'priced' (first
 * time) and proposed_at when status moves into 'proposed' (first time).
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Missing id" },
      { status: 400 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!PATCH_KEYS.has(k)) continue;
    patch[k] = v;
  }

  if (typeof patch.status === "string" && !STATUS.has(patch.status)) {
    return NextResponse.json(
      { ok: false, error: "Invalid status" },
      { status: 422 },
    );
  }

  if (patch.discount_pct !== undefined) {
    const n = Number(patch.discount_pct);
    if (!Number.isFinite(n) || n < 0 || n > TEAM_DISCOUNT_CAP_PCT) {
      return NextResponse.json(
        {
          ok: false,
          error: `Discount must be between 0 and ${TEAM_DISCOUNT_CAP_PCT}% (team cap).`,
        },
        { status: 422 },
      );
    }
    patch.discount_pct = n;
  }

  for (const k of ["pricing_pmpm", "pricing_monthly"] as const) {
    if (patch[k] !== undefined && patch[k] !== null) {
      const n = Number(patch[k]);
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json(
          { ok: false, error: `Invalid ${k}` },
          { status: 422 },
        );
      }
      patch[k] = n;
    }
  }

  if (Array.isArray(patch.add_on_modules)) {
    patch.add_on_modules = patch.add_on_modules
      .filter((x: unknown) => typeof x === "string")
      .slice(0, 32);
  }

  // Status timestamps
  if (patch.status === "priced") patch.priced_at = new Date().toISOString();
  if (patch.status === "proposed") patch.proposed_at = new Date().toISOString();

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "DB unavailable" },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, lead: data });
}
