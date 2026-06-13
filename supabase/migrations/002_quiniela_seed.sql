-- ============================================================
-- SEED DATA: QUINIELA MUNDIAL 2026
-- 48 equipos, 12 grupos, 96 partidos de grupos
-- + slots eliminatorios (LOCKED hasta definirse)
-- ============================================================

-- ------------------------------------------------------------
-- GRUPOS A–L
-- ------------------------------------------------------------
INSERT INTO public.quiniela_groups (id, name) VALUES
('A','Grupo A'), ('B','Grupo B'), ('C','Grupo C'), ('D','Grupo D'),
('E','Grupo E'), ('F','Grupo F'), ('G','Grupo G'), ('H','Grupo H'),
('I','Grupo I'), ('J','Grupo J'), ('K','Grupo K'), ('L','Grupo L')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- EQUIPOS — 48 selecciones
-- Grupos confirmados del sorteo FIFA 2026
-- ------------------------------------------------------------
INSERT INTO public.quiniela_teams (id, name, flag_emoji, group_id) VALUES
-- Grupo A
('MEX','México',           '🇲🇽','A'),
('RSA','Sudáfrica',        '🇿🇦','A'),
('KOR','Corea del Sur',    '🇰🇷','A'),
('CZE','Chequia',          '🇨🇿','A'),
-- Grupo B
('CAN','Canadá',           '🇨🇦','B'),
('BIH','Bosnia y Herz.',   '🇧🇦','B'),
('QAT','Qatar',            '🇶🇦','B'),
('SUI','Suiza',            '🇨🇭','B'),
-- Grupo C
('BRA','Brasil',           '🇧🇷','C'),
('MAR','Marruecos',        '🇲🇦','C'),
('HAI','Haití',            '🇭🇹','C'),
('SCO','Escocia',          '🏴󠁧󠁢󠁳󠁣󠁴󠁿','C'),
-- Grupo D
('USA','Estados Unidos',   '🇺🇸','D'),
('PAR','Paraguay',         '🇵🇾','D'),
('AUS','Australia',        '🇦🇺','D'),
('TUR','Turquía',          '🇹🇷','D'),
-- Grupo E
('GER','Alemania',         '🇩🇪','E'),
('CUW','Curazao',          '🇨🇼','E'),
('CIV','Costa de Marfil',  '🇨🇮','E'),
('ECU','Ecuador',          '🇪🇨','E'),
-- Grupo F
('ESP','España',           '🇪🇸','F'),
('BEL','Bélgica',          '🇧🇪','F'),
('JAM','Jamaica',          '🇯🇲','F'),
('AZE','Azerbaiyán',       '🇦🇿','F'),
-- Grupo G
('POR','Portugal',         '🇵🇹','G'),
('POL','Polonia',          '🇵🇱','G'),
('CMR','Camerún',          '🇨🇲','G'),
('THA','Tailandia',        '🇹🇭','G'),
-- Grupo H
('FRA','Francia',          '🇫🇷','H'),
('CRO','Croacia',          '🇭🇷','H'),
('MOR','Mauritania',       '🇲🇷','H'),
('BGR','Bulgaria',         '🇧🇬','H'),
-- Grupo I
('ENG','Inglaterra',       '🏴󠁧󠁢󠁥󠁮󠁧󠁿','I'),
('IRN','Irán',             '🇮🇷','I'),
('PAN','Panamá',           '🇵🇦','I'),
('CPV','Cabo Verde',       '🇨🇻','I'),
-- Grupo J
('ARG','Argentina',        '🇦🇷','J'),
('ALG','Argelia',          '🇩🇿','J'),
('AUT','Austria',          '🇦🇹','J'),
('JOR','Jordania',         '🇯🇴','J'),
-- Grupo K
('NED','Países Bajos',     '🇳🇱','K'),
('EGY','Egipto',           '🇪🇬','K'),
('COL','Colombia',         '🇨🇴','K'),
('MLI','Mali',             '🇲🇱','K'),
-- Grupo L
('JPN','Japón',            '🇯🇵','L'),
('URU','Uruguay',          '🇺🇾','L'),
('SEN','Senegal',          '🇸🇳','L'),
('IRQ','Irak',             '🇮🇶','L')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- PARTIDOS — FASE DE GRUPOS (96 partidos)
-- Jornada 1: Jun 11–15 | Jornada 2: Jun 17–21 | Jornada 3: Jun 23–27
-- Formato: (match_number, phase, group_id, home, away, date, venue)
-- ------------------------------------------------------------
INSERT INTO public.quiniela_matches (match_number, phase, group_id, team_home_id, team_away_id, match_date, venue, status) VALUES
-- GRUPO A
(1,  'GROUP','A','MEX','RSA','2026-06-11 12:00:00-06','Estadio Azteca, CDMX','SCHEDULED'),
(2,  'GROUP','A','KOR','CZE','2026-06-11 16:00:00-06','Estadio Akron, GDL','SCHEDULED'),
(25,  'GROUP','A','MEX','KOR','2026-06-18 12:00:00-06','Estadio Azteca, CDMX','SCHEDULED'),
(26,  'GROUP','A','CZE','RSA','2026-06-18 15:00:00-06','Estadio Akron, GDL','SCHEDULED'),
(65,  'GROUP','A','MEX','CZE','2026-06-24 12:00:00-06','Estadio Azteca, CDMX','SCHEDULED'),
(66,  'GROUP','A','RSA','KOR','2026-06-24 12:00:00-06','Estadio Akron, GDL','SCHEDULED'),
-- GRUPO B
(3,  'GROUP','B','CAN','BIH','2026-06-12 15:00:00-06','BMO Field, Toronto','SCHEDULED'),
(4,  'GROUP','B','QAT','SUI','2026-06-12 18:00:00-06','Stade Olympique, Montréal','SCHEDULED'),
(27,  'GROUP','B','CAN','QAT','2026-06-18 18:00:00-06','BMO Field, Toronto','SCHEDULED'),
(28,  'GROUP','B','SUI','BIH','2026-06-18 21:00:00-06','BC Place, Vancouver','SCHEDULED'),
(67,  'GROUP','B','CAN','SUI','2026-06-24 15:00:00-06','BC Place, Vancouver','SCHEDULED'),
(68,  'GROUP','B','BIH','QAT','2026-06-24 15:00:00-06','Stade Olympique, Montréal','SCHEDULED'),
-- GRUPO C
(5,  'GROUP','C','BRA','HAI','2026-06-13 12:00:00-06','Rose Bowl, LA','SCHEDULED'),
(6,  'GROUP','C','MAR','SCO','2026-06-13 15:00:00-06','MetLife, NJ','SCHEDULED'),
(29,  'GROUP','C','BRA','MAR','2026-06-19 12:00:00-06','MetLife, NJ','SCHEDULED'),
(30,  'GROUP','C','SCO','HAI','2026-06-19 15:00:00-06','Rose Bowl, LA','SCHEDULED'),
(69,  'GROUP','C','BRA','SCO','2026-06-24 18:00:00-06','Rose Bowl, LA','SCHEDULED'),
(70,  'GROUP','C','HAI','MAR','2026-06-24 18:00:00-06','MetLife, NJ','SCHEDULED'),
-- GRUPO D
(7,  'GROUP','D','USA','PAR','2026-06-13 18:00:00-06','Rose Bowl, LA','SCHEDULED'),
(8,  'GROUP','D','AUS','TUR','2026-06-13 21:00:00-06','AT&T Stadium, Dallas','SCHEDULED'),
(31,  'GROUP','D','USA','AUS','2026-06-19 18:00:00-06','Rose Bowl, LA','SCHEDULED'),
(32,  'GROUP','D','TUR','PAR','2026-06-19 21:00:00-06','AT&T Stadium, Dallas','SCHEDULED'),
(71,  'GROUP','D','USA','TUR','2026-06-25 12:00:00-06','Rose Bowl, LA','SCHEDULED'),
(72,  'GROUP','D','PAR','AUS','2026-06-25 12:00:00-06','AT&T Stadium, Dallas','SCHEDULED'),
-- GRUPO E
(9,  'GROUP','E','GER','CUW','2026-06-14 12:00:00-06','Lincoln Financial, PHI','SCHEDULED'),
(10,  'GROUP','E','CIV','ECU','2026-06-14 15:00:00-06','Gillette Stadium, BOS','SCHEDULED'),
(33,  'GROUP','E','GER','CIV','2026-06-20 12:00:00-06','Gillette Stadium, BOS','SCHEDULED'),
(34,  'GROUP','E','ECU','CUW','2026-06-20 15:00:00-06','Lincoln Financial, PHI','SCHEDULED'),
(73,  'GROUP','E','GER','ECU','2026-06-25 15:00:00-06','MetLife, NJ','SCHEDULED'),
(74,  'GROUP','E','CUW','CIV','2026-06-25 15:00:00-06','Gillette Stadium, BOS','SCHEDULED'),
-- GRUPO F
(11,  'GROUP','F','ESP','JAM','2026-06-14 18:00:00-06','Hard Rock, MIA','SCHEDULED'),
(12,  'GROUP','F','BEL','AZE','2026-06-14 21:00:00-06','NRG Stadium, HOU','SCHEDULED'),
(35,  'GROUP','F','ESP','BEL','2026-06-20 18:00:00-06','NRG Stadium, HOU','SCHEDULED'),
(36,  'GROUP','F','AZE','JAM','2026-06-20 21:00:00-06','Hard Rock, MIA','SCHEDULED'),
(75,  'GROUP','F','ESP','AZE','2026-06-25 18:00:00-06','Hard Rock, MIA','SCHEDULED'),
(76,  'GROUP','F','JAM','BEL','2026-06-25 18:00:00-06','NRG Stadium, HOU','SCHEDULED'),
-- GRUPO G
(13,  'GROUP','G','POR','THA','2026-06-15 12:00:00-06','Levi''s Stadium, SF','SCHEDULED'),
(14,  'GROUP','G','POL','CMR','2026-06-15 15:00:00-06','Lumen Field, SEA','SCHEDULED'),
(37,  'GROUP','G','POR','POL','2026-06-21 12:00:00-06','Lumen Field, SEA','SCHEDULED'),
(38,  'GROUP','G','CMR','THA','2026-06-21 15:00:00-06','Levi''s Stadium, SF','SCHEDULED'),
(77,  'GROUP','G','POR','CMR','2026-06-26 12:00:00-06','Levi''s Stadium, SF','SCHEDULED'),
(78,  'GROUP','G','THA','POL','2026-06-26 12:00:00-06','Lumen Field, SEA','SCHEDULED'),
-- GRUPO H
(15,  'GROUP','H','FRA','MOR','2026-06-15 18:00:00-06','Soldier Field, CHI','SCHEDULED'),
(16,  'GROUP','H','CRO','BGR','2026-06-15 21:00:00-06','Arrowhead, KC','SCHEDULED'),
(39,  'GROUP','H','FRA','CRO','2026-06-21 18:00:00-06','Arrowhead, KC','SCHEDULED'),
(40,  'GROUP','H','BGR','MOR','2026-06-21 21:00:00-06','Soldier Field, CHI','SCHEDULED'),
(79,  'GROUP','H','FRA','BGR','2026-06-26 15:00:00-06','Soldier Field, CHI','SCHEDULED'),
(80,  'GROUP','H','MOR','CRO','2026-06-26 15:00:00-06','Arrowhead, KC','SCHEDULED'),
-- GRUPO I
(17,  'GROUP','I','ENG','PAN','2026-06-16 12:00:00-06','SoFi Stadium, LA','SCHEDULED'),
(18,  'GROUP','I','IRN','CPV','2026-06-16 15:00:00-06','AT&T Stadium, Dallas','SCHEDULED'),
(41,  'GROUP','I','ENG','IRN','2026-06-22 12:00:00-06','AT&T Stadium, Dallas','SCHEDULED'),
(42,  'GROUP','I','CPV','PAN','2026-06-22 15:00:00-06','SoFi Stadium, LA','SCHEDULED'),
(81,  'GROUP','I','ENG','CPV','2026-06-26 18:00:00-06','SoFi Stadium, LA','SCHEDULED'),
(82,  'GROUP','I','PAN','IRN','2026-06-26 18:00:00-06','AT&T Stadium, Dallas','SCHEDULED'),
-- GRUPO J
(19,  'GROUP','J','ARG','JOR','2026-06-16 18:00:00-06','Hard Rock, MIA','SCHEDULED'),
(20,  'GROUP','J','ALG','AUT','2026-06-16 21:00:00-06','Mercedes-Benz, ATL','SCHEDULED'),
(43,  'GROUP','J','ARG','ALG','2026-06-22 18:00:00-06','Hard Rock, MIA','SCHEDULED'),
(44,  'GROUP','J','AUT','JOR','2026-06-22 21:00:00-06','Mercedes-Benz, ATL','SCHEDULED'),
(83,  'GROUP','J','ARG','AUT','2026-06-27 12:00:00-06','Hard Rock, MIA','SCHEDULED'),
(84,  'GROUP','J','JOR','ALG','2026-06-27 12:00:00-06','Mercedes-Benz, ATL','SCHEDULED'),
-- GRUPO K
(21,  'GROUP','K','NED','MLI','2026-06-17 12:00:00-06','Lincoln Financial, PHI','SCHEDULED'),
(22,  'GROUP','K','EGY','COL','2026-06-17 15:00:00-06','Gillette Stadium, BOS','SCHEDULED'),
(45,  'GROUP','K','NED','EGY','2026-06-23 12:00:00-06','Gillette Stadium, BOS','SCHEDULED'),
(46,  'GROUP','K','COL','MLI','2026-06-23 15:00:00-06','Lincoln Financial, PHI','SCHEDULED'),
(85,  'GROUP','K','NED','COL','2026-06-27 15:00:00-06','Gillette Stadium, BOS','SCHEDULED'),
(86,  'GROUP','K','MLI','EGY','2026-06-27 15:00:00-06','Lincoln Financial, PHI','SCHEDULED'),
-- GRUPO L
(23,  'GROUP','L','JPN','IRQ','2026-06-17 18:00:00-06','Lumen Field, SEA','SCHEDULED'),
(24,  'GROUP','L','URU','SEN','2026-06-17 21:00:00-06','Levi''s Stadium, SF','SCHEDULED'),
(47,  'GROUP','L','JPN','URU','2026-06-23 18:00:00-06','Levi''s Stadium, SF','SCHEDULED'),
(48,  'GROUP','L','SEN','IRQ','2026-06-23 21:00:00-06','Lumen Field, SEA','SCHEDULED'),
(87,  'GROUP','L','JPN','SEN','2026-06-27 18:00:00-06','Levi''s Stadium, SF','SCHEDULED'),
(88,  'GROUP','L','IRQ','URU','2026-06-27 18:00:00-06','Lumen Field, SEA','SCHEDULED')
ON CONFLICT (match_number) DO NOTHING;

-- ------------------------------------------------------------
-- FASE ELIMINATORIA — Slots LOCKED (equipos TBD)
-- Se desbloquean cuando el admin asigne los clasificados
-- Slots de R32 (16 partidos)
-- ------------------------------------------------------------
INSERT INTO public.quiniela_matches (match_number, phase, status, match_date, venue, slot_home_desc, slot_away_desc) VALUES
(89,  'R32','LOCKED','2026-06-28 13:00:00-05','MetLife, NJ',         '1° Grupo A','2° Grupo C'),
(90,  'R32','LOCKED','2026-06-28 17:00:00-05','Rose Bowl, LA',       '1° Grupo C','2° Grupo A'),
(91,  'R32','LOCKED','2026-06-29 13:00:00-05','AT&T, Dallas',        '1° Grupo B','3er Mejor-1'),
(92,  'R32','LOCKED','2026-06-29 17:00:00-05','BMO, Toronto',        '1° Grupo D','2° Grupo B'),
(93,  'R32','LOCKED','2026-06-30 13:00:00-05','Hard Rock, Miami',    '1° Grupo E','3er Mejor-2'),
(94,  'R32','LOCKED','2026-06-30 17:00:00-05','NRG, Houston',        '1° Grupo F','2° Grupo E'),
(95,  'R32','LOCKED','2026-07-01 13:00:00-05','Soldier Field, CHI',  '1° Grupo G','3er Mejor-3'),
(96,  'R32','LOCKED','2026-07-01 17:00:00-05','Arrowhead, KC',       '1° Grupo H','2° Grupo G'),
(97,  'R32','LOCKED','2026-07-02 13:00:00-05','SoFi, LA',            '1° Grupo I','3er Mejor-4'),
(98,  'R32','LOCKED','2026-07-02 17:00:00-05','Levi''s, SF',         '1° Grupo J','2° Grupo I'),
(99,  'R32','LOCKED','2026-07-02 13:00:00-05','Lumen, SEA',          '1° Grupo K','3er Mejor-5'),
(100, 'R32','LOCKED','2026-07-02 17:00:00-05','Lincoln, PHI',        '1° Grupo L','2° Grupo K'),
(101, 'R32','LOCKED','2026-07-02 20:00:00-05','Gillette, BOS',       '2° Grupo D','3er Mejor-6'),
(102, 'R32','LOCKED','2026-07-03 13:00:00-05','Mercedes, ATL',       '2° Grupo F','3er Mejor-7'),
(103, 'R32','LOCKED','2026-07-03 17:00:00-05','MetLife, NJ',         '2° Grupo H','3er Mejor-8'),
(104, 'R32','LOCKED','2026-07-03 20:00:00-05','Rose Bowl, LA',       '2° Grupo J','2° Grupo L')
ON CONFLICT (match_number) DO NOTHING;

-- R16 (8 partidos)
INSERT INTO public.quiniela_matches (match_number, phase, status, match_date, slot_home_desc, slot_away_desc) VALUES
(105, 'R16','LOCKED','2026-07-04 13:00:00-05','Ganador M89','Ganador M90'),
(106, 'R16','LOCKED','2026-07-04 17:00:00-05','Ganador M91','Ganador M92'),
(107, 'R16','LOCKED','2026-07-05 13:00:00-05','Ganador M93','Ganador M94'),
(108, 'R16','LOCKED','2026-07-05 17:00:00-05','Ganador M95','Ganador M96'),
(109, 'R16','LOCKED','2026-07-06 13:00:00-05','Ganador M97','Ganador M98'),
(110, 'R16','LOCKED','2026-07-06 17:00:00-05','Ganador M99','Ganador M100'),
(111, 'R16','LOCKED','2026-07-07 13:00:00-05','Ganador M101','Ganador M102'),
(112, 'R16','LOCKED','2026-07-07 17:00:00-05','Ganador M103','Ganador M104')
ON CONFLICT (match_number) DO NOTHING;

-- Cuartos de Final (4 partidos)
INSERT INTO public.quiniela_matches (match_number, phase, status, match_date, slot_home_desc, slot_away_desc) VALUES
(113, 'QF','LOCKED','2026-07-09 17:00:00-05','Ganador M105','Ganador M106'),
(114, 'QF','LOCKED','2026-07-10 17:00:00-05','Ganador M107','Ganador M108'),
(115, 'QF','LOCKED','2026-07-11 13:00:00-05','Ganador M109','Ganador M110'),
(116, 'QF','LOCKED','2026-07-11 17:00:00-05','Ganador M111','Ganador M112')
ON CONFLICT (match_number) DO NOTHING;

-- Semifinales (2 partidos)
INSERT INTO public.quiniela_matches (match_number, phase, status, match_date, venue, slot_home_desc, slot_away_desc) VALUES
(117, 'SF','LOCKED','2026-07-14 17:00:00-05','MetLife, NJ',      'Ganador M113','Ganador M114'),
(118, 'SF','LOCKED','2026-07-15 17:00:00-05','Rose Bowl, LA',    'Ganador M115','Ganador M116')
ON CONFLICT (match_number) DO NOTHING;

-- Tercer Lugar
INSERT INTO public.quiniela_matches (match_number, phase, status, match_date, venue, slot_home_desc, slot_away_desc) VALUES
(119, 'TPP','LOCKED','2026-07-18 16:00:00-05','Hard Rock, Miami','Perdedor M117','Perdedor M118')
ON CONFLICT (match_number) DO NOTHING;

-- Final
INSERT INTO public.quiniela_matches (match_number, phase, status, match_date, venue, slot_home_desc, slot_away_desc) VALUES
(120, 'FINAL','LOCKED','2026-07-19 15:00:00-05','MetLife Stadium, East Rutherford, NJ','Ganador M117','Ganador M118')
ON CONFLICT (match_number) DO NOTHING;
