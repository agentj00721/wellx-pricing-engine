-- ============================================================
-- 002 — Customer flow can now pick multiple goals, and listed-insurer
-- leads can authorise Wellx to talk to their broker/insurer about
-- embedding Wellx in the plan.
--
-- Replaces the single `goal` column with a `goals business_goal[]`
-- array, and adds an `authorize_wellx_contact` boolean.
-- Safe to apply with empty `leads` table (post-001).
-- ============================================================

alter table leads drop column if exists goal;
alter table leads add column if not exists goals business_goal[] not null default '{}';
alter table leads add column if not exists authorize_wellx_contact boolean not null default false;

create index if not exists leads_goals_gin_idx on leads using gin (goals);
