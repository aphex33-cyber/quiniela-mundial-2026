-- ============================================================
-- QUINIELA MUNDIAL 2026 - Schema de Base de Datos
-- Proyecto: OPEXLAB Supabase (tablas prefijadas con quiniela_)
-- ============================================================

-- ============================================================
-- 1. EQUIPOS (48 selecciones)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiniela_teams (
    id          VARCHAR(3)   PRIMARY KEY, -- Código ISO (MEX, USA, ARG...)
    name        VARCHAR(100) NOT NULL,
    flag_emoji  VARCHAR(10)  NOT NULL,
    group_id    VARCHAR(1)   NOT NULL     -- A, B, C ... L
);

-- ============================================================
-- 2. GRUPOS (A–L)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiniela_groups (
    id    VARCHAR(1)   PRIMARY KEY, -- A, B, C ... L
    name  VARCHAR(20)  NOT NULL     -- 'Grupo A', etc.
);

-- ============================================================
-- 3. PARTIDOS (96 fase grupos + 8 eliminatorios = 104)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiniela_matches (
    id            SERIAL       PRIMARY KEY,
    match_number  INT          UNIQUE NOT NULL,   -- Número oficial FIFA 1–104
    phase         VARCHAR(20)  NOT NULL CHECK (phase IN (
                    'GROUP', 'R32', 'R16', 'QF', 'SF', 'TPP', 'FINAL'
                  )),
    group_id      VARCHAR(1)   REFERENCES public.quiniela_groups(id),  -- NULL en fase elim.
    team_home_id  VARCHAR(3)   REFERENCES public.quiniela_teams(id),   -- NULL hasta clasificar
    team_away_id  VARCHAR(3)   REFERENCES public.quiniela_teams(id),   -- NULL hasta clasificar
    match_date    TIMESTAMPTZ,
    venue         VARCHAR(100),
    status        VARCHAR(20)  NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN (
                    'SCHEDULED',  -- Programado (equipos conocidos)
                    'LOCKED',     -- Slot eliminatorio sin equipos aún
                    'OPEN',       -- Abierto para predicciones
                    'FINISHED'    -- Resultado registrado
                  )),
    real_home     INT,          -- Resultado real (NULL hasta jugar)
    real_away     INT,
    slot_home_desc VARCHAR(50), -- "1er Grupo A" para slots eliminatorios
    slot_away_desc VARCHAR(50)
);

-- ============================================================
-- 4. PARTICIPANTES DE LA QUINIELA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiniela_players (
    id         UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    avatar     VARCHAR(10)  DEFAULT '⚽',  -- Emoji avatar
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- 5. PREDICCIONES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiniela_predictions (
    id           UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id    UUID  NOT NULL REFERENCES public.quiniela_players(id) ON DELETE CASCADE,
    match_id     INT   NOT NULL REFERENCES public.quiniela_matches(id) ON DELETE CASCADE,
    pred_home    INT   NOT NULL CHECK (pred_home >= 0),
    pred_away    INT   NOT NULL CHECK (pred_away >= 0),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, match_id)
);

-- ============================================================
-- VISTAS
-- ============================================================

-- Vista: Puntos por jugador por partido
CREATE OR REPLACE VIEW public.quiniela_match_points AS
SELECT
    pr.player_id,
    p.name AS player_name,
    p.avatar,
    m.id AS match_id,
    m.match_number,
    m.phase,
    m.group_id,
    t_h.name AS team_home,
    t_h.flag_emoji AS flag_home,
    t_a.name AS team_away,
    t_a.flag_emoji AS flag_away,
    m.real_home,
    m.real_away,
    pr.pred_home,
    pr.pred_away,
    CASE
        WHEN m.real_home IS NULL THEN NULL  -- Partido no jugado
        WHEN pr.pred_home = m.real_home AND pr.pred_away = m.real_away THEN 3  -- Marcador exacto
        WHEN (
            (pr.pred_home > pr.pred_away  AND m.real_home > m.real_away)  OR  -- Ganó local
            (pr.pred_home < pr.pred_away  AND m.real_home < m.real_away)  OR  -- Ganó visita
            (pr.pred_home = pr.pred_away  AND m.real_home = m.real_away)       -- Empate
        ) THEN 1
        ELSE 0
    END AS points
FROM public.quiniela_predictions pr
JOIN public.quiniela_players p ON p.id = pr.player_id
JOIN public.quiniela_matches m ON m.id = pr.match_id
LEFT JOIN public.quiniela_teams t_h ON t_h.id = m.team_home_id
LEFT JOIN public.quiniela_teams t_a ON t_a.id = m.team_away_id;

-- Vista: Ranking general (leaderboard)
CREATE OR REPLACE VIEW public.quiniela_leaderboard AS
SELECT
    player_id,
    player_name,
    avatar,
    SUM(COALESCE(points, 0)) AS total_points,
    COUNT(CASE WHEN points = 3 THEN 1 END) AS exact_scores,
    COUNT(CASE WHEN points = 1 THEN 1 END) AS correct_results,
    COUNT(CASE WHEN points = 0 AND real_home IS NOT NULL THEN 1 END) AS wrong_predictions
FROM public.quiniela_match_points
GROUP BY player_id, player_name, avatar
ORDER BY total_points DESC, exact_scores DESC;

-- ============================================================
-- RLS (Row Level Security) — Lectura pública, escritura libre
-- (El admin se autentica por contraseña en el frontend)
-- ============================================================
ALTER TABLE public.quiniela_teams       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiniela_groups      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiniela_matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiniela_players     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiniela_predictions ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (familia pequeña, confiamos en admin)
CREATE POLICY "quiniela_teams_read"      ON public.quiniela_teams       FOR SELECT USING (true);
CREATE POLICY "quiniela_groups_read"     ON public.quiniela_groups      FOR SELECT USING (true);
CREATE POLICY "quiniela_matches_read"    ON public.quiniela_matches     FOR SELECT USING (true);
CREATE POLICY "quiniela_matches_write"   ON public.quiniela_matches     FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "quiniela_players_read"    ON public.quiniela_players     FOR SELECT USING (true);
CREATE POLICY "quiniela_players_write"   ON public.quiniela_players     FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "quiniela_preds_read"      ON public.quiniela_predictions FOR SELECT USING (true);
CREATE POLICY "quiniela_preds_write"     ON public.quiniela_predictions FOR ALL    USING (true) WITH CHECK (true);
