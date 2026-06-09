-- =============================================================
-- Be Fit Gym — Initial Schema
-- Migration: 0001_initial_schema
-- =============================================================

-- ─── profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name  TEXT        NOT NULL,
    phone      TEXT        NOT NULL,
    email      TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT profiles_phone_unique UNIQUE (phone),
    CONSTRAINT profiles_email_unique UNIQUE (email)
);

-- ─── memberships ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memberships (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id  UUID        NOT NULL,
    tier_name  TEXT        NOT NULL,
    status     TEXT        NOT NULL DEFAULT 'pending_payment',
    start_date TIMESTAMPTZ,
    end_date   TIMESTAMPTZ,

    CONSTRAINT memberships_member_id_fkey
        FOREIGN KEY (member_id) REFERENCES profiles (id) ON DELETE CASCADE,

    CONSTRAINT memberships_status_check
        CHECK (status IN ('active', 'pending_payment', 'expired'))
);

CREATE INDEX IF NOT EXISTS memberships_member_id_idx ON memberships (member_id);
CREATE INDEX IF NOT EXISTS memberships_status_idx    ON memberships (status);

-- ─── transactions ─────────────────────────────────────────────
-- id stores the unique VPOS Order ID supplied by the payment gateway.
CREATE TABLE IF NOT EXISTS transactions (
    id               TEXT        PRIMARY KEY,
    member_id        UUID        NOT NULL,
    amount           NUMERIC(10, 2) NOT NULL,
    status           TEXT        NOT NULL DEFAULT 'initiated',
    bank_reference   TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT transactions_member_id_fkey
        FOREIGN KEY (member_id) REFERENCES profiles (id) ON DELETE CASCADE,

    CONSTRAINT transactions_status_check
        CHECK (status IN ('initiated', 'completed', 'failed'))
);

CREATE INDEX IF NOT EXISTS transactions_member_id_idx ON transactions (member_id);
CREATE INDEX IF NOT EXISTS transactions_status_idx    ON transactions (status);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions (created_at DESC);
