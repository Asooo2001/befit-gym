-- =============================================================
-- Be Fit Gym — Relax profiles contact constraints
-- Migration: 0003_profiles_relax_contact_constraints
-- =============================================================

-- Magic Link / OTP sign-ups may not provide both an email and a phone
-- number. Allow either to be NULL so public.handle_new_user() can insert
-- a profile row without violating NOT NULL or UNIQUE constraints.
-- (Postgres UNIQUE constraints permit any number of NULLs.)

ALTER TABLE public.profiles
    ALTER COLUMN phone DROP NOT NULL,
    ALTER COLUMN email DROP NOT NULL;
