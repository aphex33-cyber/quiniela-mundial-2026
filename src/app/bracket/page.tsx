'use client';
import { useState, useEffect } from 'react';
import { getKnockoutMatches } from '@/infrastructure/supabase/matches';
import { QuinielaMatch, Phase } from '@/infrastructure/supabase/client';
import { PHASE_LABELS } from '@/domain/scoring';

type PhaseGroup = { phase: Phase; label: string; cols: string };

const PHASES: PhaseGroup[] = [
  { phase: 'R32',   label: 'Dieciseisavos de Final', cols: 'cols-4' },
  { phase: 'R16',   label: 'Octavos de Final',       cols: 'cols-4' },
  { phase: 'QF',    label: 'Cuartos de Final',        cols: 'cols-2' },
  { phase: 'SF',    label: 'Semifinales',              cols: 'cols-2' },
  { phase: 'TPP',   label: 'Tercer Lugar',             cols: '' },
  { phase: 'FINAL', label: '🏆 Gran Final',            cols: '' },
];

function BracketMatch({ match }: { match: QuinielaMatch }) {
  const isLocked = match.status === 'LOCKED';
  const isFinished = match.status === 'FINISHED';

  if (isLocked) {
    return (
      <div className="bracket-slot locked">
        <div className="locked-label">🔒 Por definir</div>
        {match.slot_home_desc && (
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
            {match.slot_home_desc} vs {match.slot_away_desc}
          </div>
        )}
      </div>
    );
  }

  const homeWins = isFinished && (match.real_home ?? 0) > (match.real_away ?? 0);
  const awayWins = isFinished && (match.real_away ?? 0) > (match.real_home ?? 0);

  return (
    <div className={`bracket-slot ${isFinished ? 'finished' : ''}`}>
      <div className="bracket-team">
        <div className="bracket-team-info">
          <span style={{ fontSize: '1.1rem' }}>{match.team_home?.flag_emoji}</span>
          <span style={{ fontWeight: homeWins ? 700 : 500, color: homeWins ? 'var(--green)' : 'inherit' }}>
            {match.team_home?.name ?? match.slot_home_desc}
          </span>
        </div>
        {isFinished && (
          <span className={`bracket-score ${homeWins ? 'winner' : ''}`}>{match.real_home}</span>
        )}
      </div>
      <div className="bracket-team">
        <div className="bracket-team-info">
          <span style={{ fontSize: '1.1rem' }}>{match.team_away?.flag_emoji}</span>
          <span style={{ fontWeight: awayWins ? 700 : 500, color: awayWins ? 'var(--green)' : 'inherit' }}>
            {match.team_away?.name ?? match.slot_away_desc}
          </span>
        </div>
        {isFinished && (
          <span className={`bracket-score ${awayWins ? 'winner' : ''}`}>{match.real_away}</span>
        )}
      </div>
      {!isFinished && match.match_date && (
        <div style={{ marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {new Date(match.match_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
        </div>
      )}
    </div>
  );
}

export default function BracketPage() {
  const [matches, setMatches] = useState<QuinielaMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKnockoutMatches()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const byPhase = (phase: Phase) => matches.filter(m => m.phase === phase);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🌳 Bracket Eliminatorio</h1>
        <p className="page-subtitle">
          32 equipos clasificados · Final: 19 julio 2026 · MetLife Stadium, NJ
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[8, 8, 4, 2].map((n, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(n, 4)}, 1fr)`, gap: '10px' }}>
              {Array(n).fill(0).map((_, j) => <div key={j} className="skeleton skeleton-card" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="bracket-container">
          {PHASES.map(({ phase, label, cols }) => {
            const phaseMatches = byPhase(phase);
            if (phaseMatches.length === 0) return null;

            const isFinal = phase === 'FINAL';
            const isTPP = phase === 'TPP';

            return (
              <div key={phase} className="bracket-phase">
                <div className="bracket-phase-title">{label}</div>
                <div
                  className={`bracket-matches ${cols}`}
                  style={isFinal || isTPP ? { maxWidth: 340 } : {}}
                >
                  {phaseMatches.map(m => <BracketMatch key={m.id} match={m} />)}
                </div>
              </div>
            );
          })}

          {matches.every(m => m.status === 'LOCKED') && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border)',
            }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</p>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Fase de grupos en curso</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                El bracket se irá desbloqueando conforme avancen los partidos.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
