import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients for the Wellx Pricing Engine.
 *
 * Two flavours:
 *  - `getAnonClient()` — uses the anon key, scoped by RLS. Safe to use in
 *    Route Handlers that accept untrusted input (e.g. customer lead submit).
 *  - `getServiceClient()` — uses the service-role key, bypasses RLS.
 *    Server-only. Used by the team-side endpoints (list leads, update,
 *    apply pricing, etc.).
 *
 * Both return `null` when env vars are missing — callers must check.
 * This lets the build / deploy stay green before secrets are wired up.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type Maybe<T> = T | null;

export function isSupabaseConfigured(): boolean {
  return !!URL && !!ANON;
}

export function getAnonClient(): Maybe<SupabaseClient> {
  if (!URL || !ANON) return null;
  return createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getServiceClient(): Maybe<SupabaseClient> {
  if (!URL || !SERVICE) return null;
  return createClient(URL, SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
