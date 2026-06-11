import { getPlayers } from '@/infrastructure/supabase/players';
import { getPlayerMatchPoints } from '@/infrastructure/supabase/players';
import { PHASE_LABELS } from '@/domain/scoring';
import { notFound } from 'next/navigation';

function formatDate(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function PointsBadge({ points }: { points: number | null }) {
  if (points === null) return <span className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>Pendiente</span>;
  if (points === 3) return <span className="badge" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}>🎯 3 pts</span>;
  if (points === 1) return <span className="badge" style={{ background: 'var(--green-glow)', color: 'var(--green)' }}>✓ 1 pt</span>;
  return <span className="badge" style={{ background: 'var(--red-dim)', color: 'var(--red)' }}>✗ 0 pts</span>;
}

export default async function PlayerPage({ params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await params;
  const [players, matchPoints] = await Promise.allSettled([
    getPlayers(),
    getPlayerMatchPoints(playerId),
  ]);

  const allPlayers = players.status === 'fulfilled' ? players.value : [];
  const player = allPlayers.find(p => p.id === playerId);
  if (!player) notFound();

  const points = matchPoints.status === 'fulfilled' ? matchPoints.value : [];
  const total = points.reduce((acc, p) => acc + (p.points ?? 0), 0);
  const exact = points.filter(p => p.points === 3).length;
  const correct = points.filter(p => p.points === 1).length;
  const wrong = points.filter(p => p.points === 0 && p.real_home !== null).length;

  const grouped = points.reduce((acc, p) => {
    const phase = p.phase;
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(p);
    return acc;
  }, {} as Record<string, typeof points>);

  return (
    <div className="page">
      {/* Player Header */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '3rem' }}>{player.avatar}</div>
          <div style={{ flex: 1 }}>
            <h1 className="page-title">{player.name}</h1>
            <p className="page-subtitle">Quiniela personal · Mundial 2026</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--green)' }}>{total}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--gold)' }}>{exact}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exactos</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--blue)' }}>{correct}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Correctos</div>
            </div>
          </div>
        </div>
      </div>

      {points.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '2rem' }}>📝</p>
          <p>No hay predicciones registradas aún.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([phase, pMatches]) => (
          <div key={phase} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', borderLeft: '3px solid var(--green)', paddingLeft: '0.75rem' }}>
              {PHASE_LABELS[phase] ?? phase}
            </h2>
            <div className="grid-3">
              {pMatches.map(mp => (
                <div
                  key={mp.match_id}
                  className={`match-card ${mp.points === 3 ? 'pts-3' : mp.points === 1 ? 'pts-1' : mp.real_home !== null ? 'pts-0' : ''}`}
                >
                  <div className="match-header">
                    {mp.group_id ? `Grupo ${mp.group_id}` : PHASE_LABELS[mp.phase]}
                  </div>
                  <div className="match-teams">
                    <div className="match-team">
                      <span className="team-flag">{mp.flag_home}</span>
                      <span className="team-name" style={{ fontSize: '0.8rem' }}>{mp.team_home}</span>
                    </div>
                    <div className="match-score">
                      <div className="score-real" style={{ fontSize: '1.1rem' }}>
                        {mp.real_home !== null ? `${mp.real_home}–${mp.real_away}` : 'vs'}
                      </div>
                      <div className="score-pred">
                        <div className="pred-label">Mi quiniela</div>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{mp.pred_home}–{mp.pred_away}</span>
                      </div>
                    </div>
                    <div className="match-team away">
                      <span className="team-flag">{mp.flag_away}</span>
                      <span className="team-name" style={{ fontSize: '0.8rem' }}>{mp.team_away}</span>
                    </div>
                  </div>
                  <div className="match-points-badge" style={{ textAlign: 'center', marginTop: '10px' }}>
                    <PointsBadge points={mp.points} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
