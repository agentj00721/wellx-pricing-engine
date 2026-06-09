import { NextResponse, type NextRequest } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * POST /api/leads
 *
 * Accepts a Customer Studio lead payload (shape produced by
 * `leadToPayload(lead)` in components/customer/flow.ts) and inserts it
 * into the `leads` table. Returns `{ ok: true, id, reference }` on
 * success.
 *
 * If Supabase isn't configured yet (env vars missing), the route logs
 * the payload and returns success anyway so the customer flow demos
 * end-to-end. Once `NEXT_PUBLIC_SUPABASE_URL` /
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, real persistence kicks in.
 */
export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const cleaned = sanitize(payload);
  const validation = validate(cleaned);
  if (validation) {
    return NextResponse.json(
      { ok: false, error: validation },
      { status: 422 },
    );
  }

  if (!isSupabaseConfigured()) {
    console.warn(
      "[wellx] /api/leads — Supabase not configured. Logged payload only:",
      JSON.stringify(cleaned),
    );
    return NextResponse.json({
      ok: true,
      id: null,
      reference: null,
      persisted: false,
      message: "Submission received (Supabase not configured yet).",
    });
  }

  // The Route Handler runs server-side, so we use the service-role client.
  // It bypasses RLS, which lets us INSERT ... RETURNING (id, reference) in
  // a single round-trip. RLS still protects against direct REST calls from
  // untrusted clients that try to bypass this endpoint.
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Database client unavailable" },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({ ...cleaned, status: "submitted" })
    .select("id, reference")
    .single();

  if (error) {
    console.error("[wellx] /api/leads insert failed", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
    reference: data.reference,
    persisted: true,
  });
}

const ALLOWED_KEYS = new Set([
  "for_who",
  "goals",
  "sourcing",
  "insurer",
  "insurer_other_name",
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
  "contact_role",
  "notes",
]);

const FOR_WHO = new Set(["self", "team"]);
const SOURCING = new Set(["insurer", "direct"]);
const INSURER = new Set(["qic", "liva", "dni", "salama", "adnt", "other"]);
const GOAL = new Set([
  "know-team",
  "retention",
  "engagement",
  "claims",
  "differentiation",
]);

function sanitize(input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (!ALLOWED_KEYS.has(k)) continue;
    if (typeof v === "string") {
      const trimmed = v.trim();
      out[k] = trimmed.length ? trimmed.slice(0, 2000) : null;
    } else if (Array.isArray(v)) {
      out[k] = v.filter((x) => typeof x === "string").slice(0, 32);
    } else if (typeof v === "boolean") {
      out[k] = v;
    } else {
      out[k] = v;
    }
  }
  return out;
}

function validate(p: Record<string, unknown>): string | null {
  if (p.for_who && !FOR_WHO.has(p.for_who as string))
    return "Invalid for_who";
  if (p.sourcing && !SOURCING.has(p.sourcing as string))
    return "Invalid sourcing";
  if (p.insurer && !INSURER.has(p.insurer as string))
    return "Invalid insurer";
  if (p.goals !== undefined) {
    if (!Array.isArray(p.goals)) return "Invalid goals (must be an array)";
    for (const g of p.goals) {
      if (typeof g !== "string" || !GOAL.has(g)) return `Invalid goal: ${g}`;
    }
  }
  if (p.authorize_wellx_contact !== undefined && typeof p.authorize_wellx_contact !== "boolean") {
    return "Invalid authorize_wellx_contact (must be boolean)";
  }

  if (p.contact_email && typeof p.contact_email === "string") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contact_email))
      return "Invalid contact email";
  }
  if (p.broker_email && typeof p.broker_email === "string") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.broker_email))
      return "Invalid broker email";
  }
  if (p.broker_phone && typeof p.broker_phone === "string") {
    const digits = p.broker_phone.replace(/\D/g, "");
    if (
      !/^\+?[\d\s\-().]+$/.test(p.broker_phone) ||
      digits.length < 7 ||
      digits.length > 15
    )
      return "Invalid broker phone";
  }
  if (p.total_people !== undefined && p.total_people !== null) {
    const n = Number(p.total_people);
    if (!Number.isFinite(n) || n < 0 || n > 100000)
      return "Invalid total_people";
    p.total_people = n;
  }
  for (const key of ["employee_count", "dependant_count"] as const) {
    if (p[key] !== undefined && p[key] !== null) {
      const n = Number(p[key]);
      if (!Number.isFinite(n) || n < 0) return `Invalid ${key}`;
      p[key] = n;
    }
  }
  return null;
}
