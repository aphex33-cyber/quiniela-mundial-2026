'use client';
import { useState, useEffect } from 'react';
import { getAllMatches, updateMatchResult, unlockKnockoutMatch } from '@/infrastructure/supabase/matches';
import { QuinielaMatch, QuinielaTeam } from '@/infrastructure/supabase/client';
import { supabase } from '@/infrastructure/supabase/client';
import { PHASE_LABELS } from '@/domain/scoring';

type Toast = { msg: string; type: 'success' | 'error' } | null;

export default function ResultadosAdminPage() {
  const [matches, setMatches] = useState<QuinielaMatch[]>([]);
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [filter, setFilter] = useState<'pending' | 'finished' | 'locked'>('pending');
  const [teams, setTeams] = useState<QuinielaTeam[]>([]);
  const [unlockData, setUnlockData] = useState<Record<number, { home: string; away: string }>>({});

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    Promise.all([getAllMatches(), supabase.from('quiniela_teams').select('*')]).then(([m, { data: t }]) => {
      setMatches(m);
      setTeams(t ?? []);
    });
  }, []);

  const handleScoreChange = (matchId: number, side: 'home' | 'away', val: string) => {
    setScores(prev => ({ ...prev, [matchId]: { ...prev[matchId], [side]: val } }));
  };

  const handleSaveResult = async (match: QuinielaMatch) => {
    const s = scores[match.id];
    if (!s?.home || !s?.away) { showToast('Ingresa ambos marcadores', 'error'); return; }
    const home = parseInt(s.home);
    const away = parseInt(s.away);
    if (isNaN(home) || isNaN(away)) { showToast('Marcadores inválidos', 'error'); return; }

    setSaving(match.id);
    try {
      await updateMatchResult(match.id, home, away);
      setMatches(prev => prev.map(m => m.id === match.id ? { ...m, real_home: home, real_away: away, status: 'FINISHED' } : m));
      showToast(`✅ Resultado guardado: ${home} – ${away}`);
    } catch {
      showToast('Error al guardar resultado', 'error');
    } finally {
      setSaving(null);
    }
  };

  const handleUnlock = async (match: QuinielaMatch) => {
    const u = unlockData[match.id];
    if (!u?.home || !u?.away) { showToast('Selecciona ambos equipos', 'error'); return; }

    setSaving(match.id);
    try {
      await unlockKnockoutMatch(match.id, u.home, u.away);
      setMatches(prev => prev.map(m => m.id === match.id ? { ...m, team_home_id: u.home, team_away_id: u.away, status: 'OPEN' } : m));
      showToast('✅ Partido desbloqueado para predicciones');
    } catch {
      showToast('Error al desbloquear partido', 'error');
    } finally {
      setSaving(null);
    }
  };

  const filteredMatches = matches.filter(m => {
    if (filter === 'pending') return m.status === 'SCHEDULED' || m.status === 'OPEN';
    if (filter === 'finished') return m.status === 'FINISHED';
    if (filter === 'locked') return m.status === 'LOCKED';
    return true;
  });

  const grouped = filteredMatches.reduce((acc, m) => {
    const key = m.phase === 'GROUP' ? `Grupo ${m.group_id}` : (PHASE_LABELS[m.phase] ?? m.phase);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {} as Record<string, QuinielaMatch[]>);

  const pendingCount = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'OPEN').length;
  const lockedCount = matches.filter(m => m.status === 'LOCKED').length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">⚽ Registrar Resultados</h1>
        <p className="page-subtitle">Ingresa el marcador final de cada partido</p>
      </div>

      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        <button className={`tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
          Pendientes ({pendingCount})
        </button>
        <button className={`tab ${filter === 'locked' ? 'active' : ''}`} onClick={() => setFilter('locked')}>
          🔒 Por definir ({lockedCount})
        </button>
        <button className={`tab ${filter === 'finished' ? 'active' : ''}`} onClick={() => setFilter('finished')}>
          ✅ Finalizados
        </button>
      </div>

      {filter === 'locked' && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'rgba(245,158,11,0.3)' }}>
          <div className="card-body">
            <p style={{ color: 'var(--gold)', fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ Partidos Eliminatorios por Definir</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Cuando terminen los grupos y se definan los clasificados, asigna los equipos a cada slot para desbloquear las predicciones.
            </p>
          </div>
        </div>
      )}

      {Object.entries(grouped).map(([groupLabel, gMatches]) => (
        <div key={groupLabel} className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header"><span className="card-title">{groupLabel}</span></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {gMatches.map(m => (
                <div key={m.id} style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  {/* Match teams display */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.3rem' }}>{m.team_home?.flag_emoji ?? '🏳️'}</span>
                      <span style={{ fontWeight: 600 }}>{m.team_home?.name ?? m.slot_home_desc ?? 'TBD'}</span>
                    </div>
                    <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {m.real_home !== null ? (
                        <span style={{ color: 'var(--green)', fontSize: '1.2rem', fontWeight: 700 }}>{m.real_home} – {m.real_away}</span>
                      ) : 'vs'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <span style={{ fontWeight: 600 }}>{m.team_away?.name ?? m.slot_away_desc ?? 'TBD'}</span>
                      <span style={{ fontSize: '1.3rem' }}>{m.team_away?.flag_emoji ?? '🏳️'}</span>
                    </div>
                  </div>

                  {/* LOCKED: Assign teams */}
                  {m.status === 'LOCKED' && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="form-label">Equipo Local ({m.slot_home_desc})</label>
                        <select className="form-select" value={unlockData[m.id]?.home ?? ''}
                          onChange={e => setUnlockData(p => ({ ...p, [m.id]: { ...p[m.id], home: e.target.value } }))}>
                          <option value="">— Seleccionar —</option>
                          {teams.map(t => <option key={t.id} value={t.id}>{t.flag_emoji} {t.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="form-label">Equipo Visita ({m.slot_away_desc})</label>
                        <select className="form-select" value={unlockData[m.id]?.away ?? ''}
                          onChange={e => setUnlockData(p => ({ ...p, [m.id]: { ...p[m.id], away: e.target.value } }))}>
                          <option value="">— Seleccionar —</option>
                          {teams.map(t => <option key={t.id} value={t.id}>{t.flag_emoji} {t.name}</option>)}
                        </select>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => handleUnlock(m)} disabled={saving === m.id}>
                        {saving === m.id ? '...' : '🔓 Desbloquear'}
                      </button>
                    </div>
                  )}

                  {/* SCHEDULED/OPEN: Enter result */}
                  {(m.status === 'SCHEDULED' || m.status === 'OPEN') && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="score-inputs" style={{ flex: 1 }}>
                        <input type="number" min="0" max="20" className="form-input"
                          value={scores[m.id]?.home ?? ''}
                          onChange={e => handleScoreChange(m.id, 'home', e.target.value)}
                          placeholder="0" />
                        <span className="score-separator">–</span>
                        <input type="number" min="0" max="20" className="form-input"
                          value={scores[m.id]?.away ?? ''}
                          onChange={e => handleScoreChange(m.id, 'away', e.target.value)}
                          placeholder="0" />
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => handleSaveResult(m)} disabled={saving === m.id}>
                        {saving === m.id ? '...' : '✅ Guardar'}
                      </button>
                    </div>
                  )}

                  {/* FINISHED: Show result */}
                  {m.status === 'FINISHED' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        ✅ Resultado registrado: {m.real_home} – {m.real_away}
                      </span>
                      <button className="btn btn-secondary btn-sm" onClick={() => {
                        setScores(p => ({ ...p, [m.id]: { home: String(m.real_home), away: String(m.real_away) } }));
                        // Switch to open state for correction
                      }}>Corregir</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {filteredMatches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '2rem' }}>✅</p>
          <p>No hay partidos en esta categoría.</p>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
