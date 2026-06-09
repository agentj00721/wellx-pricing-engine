-- ============================================================
-- Wellx Pricing Engine — initial schema
-- Each lead from the Customer Studio gets its own row and id.
-- Wellx Team picks them up to apply pricing from the grid.
-- ============================================================

create extension if not exists "pgcrypto";

create type lead_status as enum (
  'submitted',  -- customer just sent it in
  'triaged',    -- team picked it up, assigning
  'qualified',  -- inside ICP, moving to pricing
  'priced',     -- pricing applied from grid
  'proposed',   -- proposal sent to customer
  'won',
  'lost',
  'archived'
);

create type for_who as enum ('self', 'team');
create type sourcing_method as enum ('insurer', 'direct');
create type insurer_id as enum ('qic', 'liva', 'dni', 'salama', 'adnt', 'other');
create type business_goal as enum (
  'know-team',
  'retention',
  'engagement',
  'claims',
  'differentiation'
);

create table if not exists leads (
  -- identity
  id uuid primary key default gen_random_uuid(),
  reference text unique generated always as ('WX-' || upper(substring(id::text, 1, 8))) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- workflow
  status lead_status not null default 'submitted',

  -- customer-supplied
  for_who for_who,
  goal business_goal,
  sourcing sourcing_method,
  insurer insurer_id,
  insurer_other_name text,
  broker_name text,
  broker_contact text,
  company_name text,
  total_people int check (total_people >= 0 and total_people <= 100000),
  employee_count int check (employee_count >= 0),
  dependant_count int check (dependant_count >= 0),
  add_on_modules text[] not null default '{}',

  -- contact
  contact_name text,
  contact_email text,
  contact_role text,
  notes text,

  -- team-supplied (filled in later)
  assigned_to text,
  pricing_pmpm numeric(12, 2),
  pricing_monthly numeric(14, 2),
  pricing_currency text default 'AED',
  internal_notes text
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_for_who_idx on leads (for_who);

-- keep updated_at fresh
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- ============================================================
-- Row-level security
-- The /api/leads route uses the service-role key (bypasses RLS).
-- The public INSERT policy below is a belt-and-braces guard in case
-- anything ever inserts via the anon / publishable key directly.
-- We use TO public (instead of TO anon) so the new Supabase
-- publishable-key role is also covered.
-- ============================================================

alter table leads enable row level security;

drop policy if exists "anon can submit leads" on leads;
drop policy if exists "public can submit leads" on leads;

create policy "public can submit leads"
  on leads
  for insert
  to public
  with check (
    status = 'submitted'::lead_status and
    pricing_pmpm is null and
    pricing_monthly is null and
    assigned_to is null and
    internal_notes is null
  );

-- (No SELECT/UPDATE/DELETE policy for anon — service role bypasses RLS.)
