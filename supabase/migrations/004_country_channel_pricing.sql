-- ============================================================
-- 004 — Country-aware sourcing, broker channel, change-provider
-- goal, and the central pricing config table.
-- ============================================================

-- Country (UAE, KSA, Philippines for now)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'country_id') then
    create type country_id as enum ('uae', 'ksa', 'ph');
  end if;
end $$;

alter table leads
  add column if not exists country country_id;

-- Add 'broker' to the existing sourcing_method enum
alter type sourcing_method add value if not exists 'broker';

-- KSA broker partners
do $$ begin
  if not exists (select 1 from pg_type where typname = 'ksa_broker_id') then
    create type ksa_broker_id as enum ('elite', 'marsh', 'other');
  end if;
end $$;

alter table leads
  add column if not exists ksa_broker ksa_broker_id;

-- New goal: change provider
alter type business_goal add value if not exists 'change-provider';

-- Optional self-path field: HR contact email pre-filled in the mailto
alter table leads
  add column if not exists hr_contact_email text;

-- Optional contact phone (collected on Self path; also useful for B2B)
alter table leads
  add column if not exists contact_phone text;

-- ============================================================
-- Pricing config (singleton). Founders own this.
-- ============================================================

create table if not exists pricing_config (
  id text primary key default 'default',
  core_pmpm numeric(10,2) not null default 4.00,
  wellx_jr_pmpm numeric(10,2) not null default 2.00,
  white_label_one_time numeric(12,2) not null default 10000.00,
  billing_period text not null default 'annual'
    check (billing_period in ('annual', 'monthly')),
  currency text not null default 'USD',
  currency_symbol text not null default '$',
  updated_at timestamptz not null default now()
);

insert into pricing_config (id) values ('default')
on conflict (id) do nothing;

drop trigger if exists pricing_config_updated_at on pricing_config;
create trigger pricing_config_updated_at
  before update on pricing_config
  for each row execute function set_updated_at();

-- Anon can read pricing (it's public). Updates require the service role.
alter table pricing_config enable row level security;

drop policy if exists "public can read pricing" on pricing_config;
create policy "public can read pricing"
  on pricing_config
  for select
  to public
  using (true);
