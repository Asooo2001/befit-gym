-- =============================================================
-- Be Fit Gym — Link existing member profile on sign-up
-- Migration: 0006_link_profile_on_signup
--
-- A member who joins (and pays) before ever signing in gets a profiles row
-- with a freshly generated id (see vpos-initiate), not tied to any
-- auth.users row. When they later sign in with the same email, the
-- on_auth_user_created trigger tried to INSERT a new profiles row with
-- id = auth.users.id, which violated profiles_email_unique and rolled back
-- the sign-up entirely.
--
-- Fix: if a profile with this email already exists, re-key it onto the new
-- auth user's id (cascading to memberships/transactions) instead of
-- inserting a duplicate.
-- =============================================================

-- ─── Allow profiles.id to be re-keyed ─────────────────────────
ALTER TABLE memberships
    DROP CONSTRAINT memberships_member_id_fkey;

ALTER TABLE memberships
    ADD CONSTRAINT memberships_member_id_fkey
        FOREIGN KEY (member_id) REFERENCES profiles (id)
        ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE transactions
    DROP CONSTRAINT transactions_member_id_fkey;

ALTER TABLE transactions
    ADD CONSTRAINT transactions_member_id_fkey
        FOREIGN KEY (member_id) REFERENCES profiles (id)
        ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── handle_new_user: link instead of duplicate ───────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.email IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.profiles WHERE email = NEW.email
    ) THEN
        UPDATE public.profiles
        SET id        = NEW.id,
            full_name = CASE WHEN full_name = '' THEN COALESCE(NEW.raw_user_meta_data ->> 'full_name', '') ELSE full_name END,
            phone     = COALESCE(phone, NEW.phone, NEW.raw_user_meta_data ->> 'phone')
        WHERE email = NEW.email;
    ELSE
        INSERT INTO public.profiles (id, full_name, phone, email)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
            COALESCE(NEW.phone, NEW.raw_user_meta_data ->> 'phone'),
            NEW.email
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;
