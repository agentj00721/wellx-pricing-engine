-- ============================================================
-- 006 — Team-side discount + proposal fields on leads.
-- The discount is hard-capped at 10% for now; once the Founders
-- pricing controls land, the cap moves into pricing_config.
-- ============================================================

alter table leads
  add column if not exists discount_pct numeric(5,2) not null default 0
    check (discount_pct >= 0 and discount_pct <= 100);

alter table leads
  add column if not exists priced_at timestamptz;

alter table leads
  add column if not exists proposed_at timestamptz;

-- Service role bypasses RLS, so no policy changes needed. The /api/team/*
-- routes use the service role key for all mutations.
