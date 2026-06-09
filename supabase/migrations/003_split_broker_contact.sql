-- ============================================================
-- 003 — Broker contact is now split into email + phone with
-- per-field validation. Drops the single broker_contact column.
-- Safe to apply with empty `leads` table.
-- ============================================================

alter table leads drop column if exists broker_contact;
alter table leads add column if not exists broker_email text;
alter table leads add column if not exists broker_phone text;
