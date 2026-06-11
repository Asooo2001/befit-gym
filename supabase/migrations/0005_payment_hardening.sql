-- =============================================================
-- Be Fit Gym — Payment hardening
-- Migration: 0005_payment_hardening
--
-- 1. Link each transaction to the exact membership it pays for, so the
--    callback can no longer activate/delete the wrong pending membership
--    when a member has more than one outstanding order.
-- 2. Allow a 'refunded' transaction status (the refund policy promises refunds).
-- 3. Add a raw callback audit log for payment disputes.
-- 4. Enable Row Level Security so the anon / publishable key cannot read
--    members' data. The server uses the service-role key and bypasses RLS;
--    the dashboard reads through the authenticated user, covered by the
--    self-access policies below (profiles.id == auth.users.id, see 0002).
-- =============================================================

-- ─── transactions: link to membership + refunded status ──────
ALTER TABLE transactions
    ADD COLUMN IF NOT EXISTS membership_id UUID;

ALTER TABLE transactions
    DROP CONSTRAINT IF EXISTS transactions_membership_id_fkey;

ALTER TABLE transactions
    ADD CONSTRAINT transactions_membership_id_fkey
        FOREIGN KEY (membership_id) REFERENCES memberships (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS transactions_membership_id_idx ON transactions (membership_id);

ALTER TABLE transactions
    DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE transactions
    ADD CONSTRAINT transactions_status_check
        CHECK (status IN ('initiated', 'completed', 'failed', 'refunded'));

-- ─── payment_callbacks: raw audit log ────────────────────────
-- Every callback the bank posts is recorded verbatim before processing, so a
-- disputed payment can be reconciled against exactly what the bank sent.
CREATE TABLE IF NOT EXISTS payment_callbacks (
    id              BIGSERIAL   PRIMARY KEY,
    order_id        TEXT,
    payload         JSONB       NOT NULL,
    signature_valid BOOLEAN     NOT NULL,
    received_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payment_callbacks_order_id_idx ON payment_callbacks (order_id);

-- ─── Row Level Security ──────────────────────────────────────
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships      ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_callbacks ENABLE ROW LEVEL SECURITY;

-- A signed-in member may read only their own profile…
DROP POLICY IF EXISTS profiles_self_select ON profiles;
CREATE POLICY profiles_self_select ON profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

-- …and only their own memberships.
DROP POLICY IF EXISTS memberships_self_select ON memberships;
CREATE POLICY memberships_self_select ON memberships
    FOR SELECT TO authenticated
    USING (auth.uid() = member_id);

-- transactions and payment_callbacks have NO policies on purpose: only the
-- service-role key (server-side) may touch them, and it bypasses RLS.
