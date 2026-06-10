-- =============================================================
-- Be Fit Gym — Sample data for example/demo purposes
-- Migration: 0004_seed_sample_members
-- =============================================================

-- ─── profiles ────────────────────────────────────────────────
INSERT INTO public.profiles (id, full_name, phone, email, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Arben Krasniqi',  '+38344123456', 'arben.krasniqi@example.com',  NOW() - INTERVAL '90 days'),
    ('22222222-2222-2222-2222-222222222222', 'Fatlinda Berisha', '+38345234567', 'fatlinda.berisha@example.com', NOW() - INTERVAL '60 days'),
    ('33333333-3333-3333-3333-333333333333', 'Driton Hoxha',     '+38349345678', 'driton.hoxha@example.com',     NOW() - INTERVAL '30 days'),
    ('44444444-4444-4444-4444-444444444444', 'Elona Gashi',      '+38346456789', 'elona.gashi@example.com',      NOW() - INTERVAL '10 days'),
    ('55555555-5555-5555-5555-555555555555', 'Besnik Krasniqi',  '+38343567890', 'besnik.krasniqi@example.com',  NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ─── memberships ─────────────────────────────────────────────
INSERT INTO public.memberships (member_id, tier_name, status, start_date, end_date)
SELECT * FROM (VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, 'VIP',     'active',         NOW() - INTERVAL '5 days',  NOW() + INTERVAL '25 days'),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'Premium', 'active',         NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days'),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'Basic',   'expired',        NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days'),
    ('44444444-4444-4444-4444-444444444444'::uuid, 'Premium', 'pending_payment', NULL, NULL),
    ('55555555-5555-5555-5555-555555555555'::uuid, 'Basic',   'active',         NOW() - INTERVAL '1 days',  NOW() + INTERVAL '29 days')
) AS v(member_id, tier_name, status, start_date, end_date)
WHERE NOT EXISTS (SELECT 1 FROM public.memberships m WHERE m.member_id = v.member_id);

-- ─── transactions ─────────────────────────────────────────────
INSERT INTO public.transactions (id, member_id, amount, status, bank_reference, created_at) VALUES
    ('ORDER-1001', '11111111-1111-1111-1111-111111111111', 79.00, 'completed', 'BANKREF-1001', NOW() - INTERVAL '5 days'),
    ('ORDER-1002', '22222222-2222-2222-2222-222222222222', 49.00, 'completed', 'BANKREF-1002', NOW() - INTERVAL '10 days'),
    ('ORDER-1003', '33333333-3333-3333-3333-333333333333', 29.00, 'completed', 'BANKREF-1003', NOW() - INTERVAL '60 days'),
    ('ORDER-1004', '44444444-4444-4444-4444-444444444444', 49.00, 'initiated', NULL,           NOW() - INTERVAL '1 days'),
    ('ORDER-1005', '55555555-5555-5555-5555-555555555555', 29.00, 'completed', 'BANKREF-1005', NOW() - INTERVAL '1 days')
ON CONFLICT (id) DO NOTHING;
