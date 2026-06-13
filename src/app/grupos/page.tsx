'use client';
import { useState, useEffect } from 'react';
import { getGroupMatches, getGroupStandings, GroupStanding } from '@/infrastructure/supabase/matches';
import { QuinielaMatch } from '@/infrastructure/supabase/client';

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-HN', { timeZone: 'America/Tegucigalpa', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function StandingsTable({ standings }: { standings: GroupStanding[] }) {
  return (
    <table className="group-table">
      <thead>
        <tr>
          <th colSpan={2}>Equipo</th>
          <th className="num">J</th>
          <th className="num">G</th>
          <th className="num">E</th>
          <th className="num">P</th>
          <th className="num">GF</th>
          <th className="num">GC</th>
          <th className="num">DG</th>
          <th className="num">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s, i) => (
          <tr key={s.team.id} className={i < 2 ? 'qualifier' : i === 2 ? 'third-best' : ''}>
            <td style={{ width: 24 }}>
              <div className="team-pos">{i + 1}</div>
            </td>
            <td>
              <div className="team-cell">
                <span style={{ fontSize: '1.2rem' }}>{s.team.flag_emoji}</span>
                <span style={{ fontWeight: 600 }}>{s.team.name}</span>
              </div>
            </td>
            <td className="num">{s.played}</td>
            <td className="num">{s.won}</td>
            <td className="num">{s.drawn}</td>
            <td className="num">{s.lost}</td>
            <td className="num">{s.gf}</td>
            <td className="num">{s.ga}</td>
            <td className="num" style={{ color: s.gd > 0 ? 'var(--green)' : s.gd < 0 ? 'var(--red)' : 'inherit' }}>
              {s.gd > 0 ? `+${s.gd}` : s.gd}
            </td>
            <td className="num pts-cell">{s.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GroupMatches({ matches }: { matches: QuinielaMatch[] }) {
  const jornadas = [
    matches.filter((_, i) => i < 2),
    matches.filter((_, i) => i >= 2 && i < 4),
    matches.filter((_, i) => i >= 4),
  ];
  const labels = ['Jornada 1', 'Jornada 2', 'Jornada 3'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      {jornadas.map((jmatches, ji) => (
        <div key={ji}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            {labels[ji]}
          </div>
          {jmatches.map(m => (
            <div key={m.id} className="match-card" style={{ marginBottom: '6px' }}>
              <div className="match-header">{formatDate(m.match_date)} · {m.venue?.split(',')[0]}</div>
              <div className="match-teams">
                <div className="match-team">
                  <span className="team-flag">{m.team_home?.flag_emoji}</span>
                  <span className="team-name">{m.team_home?.name}</span>
                </div>
                <div className="match-score">
                  {m.real_home !== null
                    ? <div className="score-real">{m.real_home} – {m.real_away}</div>
                    : <div className="score-real" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>vs</div>
                  }
                </div>
                <div className="match-team away">
                  <span className="team-flag">{m.team_away?.flag_emoji}</span>
                  <span className="team-name">{m.team_away?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function GruposPage() {
  const [activeGroup, setActiveGroup] = useState('A');
  const [matches, setMatches] = useState<QuinielaMatch[]>([]);
  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getGroupMatches(activeGroup),
      getGroupStandings(activeGroup),
    ]).then(([m, s]) => {
      setMatches(m);
      setStandings(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeGroup]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📊 Fase de Grupos</h1>
        <p className="page-subtitle">12 grupos · Clasifican top-2 + 8 mejores terceros</p>
      </div>

      <div className="tabs">
        {GROUPS.map(g => (
          <button
            key={g}
            className={`tab ${activeGroup === g ? 'active' : ''}`}
            onClick={() => setActiveGroup(g)}
          >
            Grupo {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      ) : (
        <div className="grid-2">
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <span className="card-title">Tabla — Grupo {activeGroup}</span>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--green)' }}>■ Clasifican</span>
                  <span style={{ color: 'var(--blue)' }}>■ 3° Mejor</span>
                </div>
              </div>
              <div className="card-body" style={{ padding: '0' }}>
                <StandingsTable standings={standings} />
              </div>
            </div>
          </div>
          <div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Partidos — Grupo {activeGroup}</span>
              </div>
              <div className="card-body">
                <GroupMatches matches={matches} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
