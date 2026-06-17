import { NextResponse, type NextRequest } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEAM_DISCOUNT_CAP_PCT = 10;

const ALLOWED_KEYS = new Set([
  "country",
  "sourcing",
  "insurer",
  "insurer_other_name",
  "ksa_broker",
  "broker_name",
  "broker_email",
  "broker_phone",
  "company_name",
  "total_people",
  "employee_count",
  "dependant_count",
  "add_on_modules",
  "contact_name",
  "contact_email",
  "contact_phone",
  "contact_role",
  "notes",
  "internal_notes",
  "assigned_to",
  "discount_pct",
  "pricing_pmpm",
  "pricing_monthly",
  "status",
]);

/**
 * GET /api/team/leads
 *
 * Returns the full lead inbox for the Wellx Team cockpit. Uses the
 * service-role client; for now no auth — the UI is internal-only and
 * we'll add a key check once the deal flow gets real volume.
 */
export async function GET() {
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, leads: [], error: "DB unavailable" }, { status: 500 });
  }
  const { data, error } = await supabase
    .from("leads")
    .select(
      [
        "id",
        "reference",
        "status",
        "for_who",
        "country",
        "goals",
        "sourcing",
        "insurer",
        "insurer_other_name",
        "ksa_broker",
        "broker_name",
        "broker_email",
        "broker_phone",
        "company_name",
        "authorize_wellx_contact",
        "total_people",
        "employee_count",
        "dependant_count",
        "add_on_modules",
        "contact_name",
        "contact_email",
        "contact_phone",
        "contact_role",
        "hr_contact_email",
        "notes",
        "discount_pct",
        "pricing_pmpm",
        "pricing_monthly",
        "internal_notes",
        "assigned_to",
        "created_at",
        "updated_at",
        "priced_at",
        "proposed_at",
      ].join(","),
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, leads: [], error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, leads: data ?? [] });
}

/**
 * POST /api/team/leads
 *
 * Creates a team-built proposal that didn't come through the Customer
 * Studio. Accepts the same fields as the customer endpoint plus
 * pricing/discount/status, so the team can spin up + price a deal in
 * a single round-trip. Stamps for_who='team'.
 *
 * Enforces the 10% team discount cap mirror of the PATCH route.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const insert: Record<string, unknown> = { for_who: "team" };
  for (const [k, v] of Object.entries(body)) {
    if (!ALLOWED_KEYS.has(k)) continue;
    if (typeof v === "string") {
      const trimmed = v.trim();
      insert[k] = trimmed.length ? trimmed.slice(0, 2000) : null;
    } else if (Array.isArray(v)) {
      insert[k] = v
        .filter((x) => typeof x === "string")
        .slice(0, 32);
    } else {
      insert[k] = v;
    }
  }

  if (insert.discount_pct !== undefined) {
    const n = Number(insert.discount_pct);
    if (!Number.isFinite(n) || n < 0 || n > TEAM_DISCOUNT_CAP_PCT) {
      return NextResponse.json(
        {
          ok: false,
          error: `Discount must be between 0 and ${TEAM_DISCOUNT_CAP_PCT}% (team cap).`,
        },
        { status: 422 },
      );
    }
    insert.discount_pct = n;
  }

  if (insert.total_people === undefined || insert.total_people === null) {
    return NextResponse.json(
      { ok: false, error: "total_people is required" },
      { status: 422 },
    );
  }
  const tp = Number(insert.total_people);
  if (!Number.isFinite(tp) || tp < 1) {
    return NextResponse.json(
      { ok: false, error: "Invalid total_people" },
      { status: 422 },
    );
  }
  insert.total_people = tp;

  // Status timestamps
  if (insert.status === "priced")
    insert.priced_at = new Date().toISOString();
  if (insert.status === "proposed")
    insert.proposed_at = new Date().toISOString();

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "DB unavailable" },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .insert(insert)
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
