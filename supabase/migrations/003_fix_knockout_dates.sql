-- Fix Round of 32 (Ends July 3, not July 4)
UPDATE public.quiniela_matches SET match_date = '2026-07-02 13:00:00-05' WHERE match_number = 99;
UPDATE public.quiniela_matches SET match_date = '2026-07-02 17:00:00-05' WHERE match_number = 100;
UPDATE public.quiniela_matches SET match_date = '2026-07-02 20:00:00-05' WHERE match_number = 101;
UPDATE public.quiniela_matches SET match_date = '2026-07-03 13:00:00-05' WHERE match_number = 102;
UPDATE public.quiniela_matches SET match_date = '2026-07-03 17:00:00-05' WHERE match_number = 103;
UPDATE public.quiniela_matches SET match_date = '2026-07-03 20:00:00-05' WHERE match_number = 104;

-- Fix Round of 16 (July 4 - July 7, instead of July 5 - July 8)
UPDATE public.quiniela_matches SET match_date = '2026-07-04 13:00:00-05' WHERE match_number = 105;
UPDATE public.quiniela_matches SET match_date = '2026-07-04 17:00:00-05' WHERE match_number = 106;
UPDATE public.quiniela_matches SET match_date = '2026-07-05 13:00:00-05' WHERE match_number = 107;
UPDATE public.quiniela_matches SET match_date = '2026-07-05 17:00:00-05' WHERE match_number = 108;
UPDATE public.quiniela_matches SET match_date = '2026-07-06 13:00:00-05' WHERE match_number = 109;
UPDATE public.quiniela_matches SET match_date = '2026-07-06 17:00:00-05' WHERE match_number = 110;
UPDATE public.quiniela_matches SET match_date = '2026-07-07 13:00:00-05' WHERE match_number = 111;
UPDATE public.quiniela_matches SET match_date = '2026-07-07 17:00:00-05' WHERE match_number = 112;

-- Fix Third Place Match (July 18, instead of July 17)
UPDATE public.quiniela_matches SET match_date = '2026-07-18 16:00:00-05' WHERE match_number = 119;
