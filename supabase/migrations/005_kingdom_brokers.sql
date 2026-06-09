-- ============================================================
-- 005 — Add Kingdom Brokers to the KSA broker partner list.
-- ============================================================

alter type ksa_broker_id add value if not exists 'kingdom';
