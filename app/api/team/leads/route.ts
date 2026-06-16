import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
