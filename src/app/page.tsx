import { getLeaderboard, getPlayers } from '@/infrastructure/supabase/players';


import { getUpcomingMatches, getRecentResults } from '@/infrastructure/supabase/matches';
import { PHASE_LABELS } from '@/domain/scoring';
import Link from 'next/link';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function PhaseBadge({ phase }: { phase: string }) {
  const cls = phase.toLowerCase().replace('tpp', 'sf');
  return <span className={`badge badge-${cls}`}>{PHASE_LABELS[phase] ?? phase}</span>;
}

export default async function DashboardPage() {
  const [leaderboard, upcoming, results] = await Promise.allSettled([
    getLeaderboard(),
    getUpcomingMatches(6),
    getRecentResults(6),
  ]);

  const leaders = leaderboard.status === 'fulfilled' ? leaderboard.value : [];
  const nextMatches = upcoming.status === 'fulfilled' ? upcoming.value : [];
  const recentMatches = results.status === 'fulfilled' ? results.value : [];

  const rankClass = (i: number) => i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
  const rankBadge = (i: number) => i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : '';

  return (
    <div className="page">
      {/* HERO */}
      <div className="hero">
        <span className="hero-emoji">🏆</span>
        <h1 className="hero-title">Quiniela Mundial 2026</h1>
        <p className="hero-sub">México · USA · Canadá</p>
        <p className="hero-date">11 Jun – 19 Jul 2026</p>
      </div>

      {/* LEADERBOARD + UPCOMING */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>

        {/* Leaderboard */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🥇 Tabla General</span>
            {leaders.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {leaders.length} jugadores
              </span>
            )}
          </div>
          <div className="card-body">
            {leaders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</p>
                <p>No hay jugadores aún.</p>
                <Link href="/admin/jugadores" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  Agregar jugadores
                </Link>
              </div>
            ) : (
              <div className="leaderboard">
                {leaders.map((p, i) => (
                  <Link
                    key={p.player_id}
                    href={`/quiniela/${p.player_id}`}
                    className={`leaderboard-row ${rankClass(i)}`}
                    style={{ display: 'grid' }}
                  >
                    <div className={`rank-badge ${rankBadge(i)}`}>
                      {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                    </div>
                    <div className="player-info">
                      <span className="player-avatar">{p.avatar}</span>
                      <div>
                        <div className="player-name">{p.player_name}</div>
                        <div className="player-stats">
                          <span className="stat-pill exact">🎯 {p.exact_scores}</span>
                          <span className="stat-pill correct">✓ {p.correct_results}</span>
                        </div>
                      </div>
                    </div>
                    <div className="points-badge">{p.total_points} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>pts</span></div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming matches */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📅 Próximos Partidos</span>
          </div>
          <div className="card-body">
            {nextMatches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No hay partidos programados próximamente.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {nextMatches.map(m => (
                  <div key={m.id} className="match-card">
                    <div className="match-header">
                      {formatDate(m.match_date)} &nbsp;·&nbsp; {m.venue?.split(',')[0]}
                      &nbsp;·&nbsp; <PhaseBadge phase={m.phase} />
                    </div>
                    <div className="match-teams">
                      <div className="match-team">
                        <span className="team-flag">{m.team_home?.flag_emoji}</span>
                        <span className="team-name">{m.team_home?.name}</span>
                      </div>
                      <div className="match-score">
                        <div className="score-real" style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>vs</div>
                      </div>
                      <div className="match-team away">
                        <span className="team-flag">{m.team_away?.flag_emoji}</span>
                        <span className="team-name">{m.team_away?.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT RESULTS */}
      {recentMatches.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">⚽ Últimos Resultados</span>
          </div>
          <div className="card-body">
            <div className="grid-3">
              {recentMatches.map(m => (
                <div key={m.id} className="match-card finished">
                  <div className="match-header">
                    {m.group_id ? `Grupo ${m.group_id}` : PHASE_LABELS[m.phase]}
                    &nbsp;·&nbsp; {formatDate(m.match_date)}
                  </div>
                  <div className="match-teams">
                    <div className="match-team">
                      <span className="team-flag">{m.team_home?.flag_emoji}</span>
                      <span className="team-name">{m.team_home?.name}</span>
                    </div>
                    <div className="match-score">
                      <div className="score-real">
                        {m.real_home} – {m.real_away}
                      </div>
                    </div>
                    <div className="match-team away">
                      <span className="team-flag">{m.team_away?.flag_emoji}</span>
                      <span className="team-name">{m.team_away?.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
