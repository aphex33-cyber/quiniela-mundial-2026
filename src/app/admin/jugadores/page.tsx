'use client';
import { useState, useEffect } from 'react';
import { getPlayers, createPlayer, deletePlayer, upsertPrediction, getPlayerPredictions } from '@/infrastructure/supabase/players';
import { getAllMatches } from '@/infrastructure/supabase/matches';
import { QuinielaPlayer, QuinielaMatch, QuinielaPrediction } from '@/infrastructure/supabase/client';
import { AVATARS, PHASE_LABELS } from '@/domain/scoring';

type Toast = { msg: string; type: 'success' | 'error' } | null;

export default function JugadoresAdminPage() {
  const [players, setPlayers] = useState<QuinielaPlayer[]>([]);
  const [matches, setMatches] = useState<QuinielaMatch[]>([]);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('⚽');
  const [selectedPlayer, setSelectedPlayer] = useState<QuinielaPlayer | null>(null);
  const [predictions, setPredictions] = useState<Record<number, { home: string; away: string }>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [tab, setTab] = useState<'players' | 'predictions'>('players');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    Promise.all([getPlayers(), getAllMatches()]).then(([p, m]) => {
      setPlayers(p);
      setMatches(m.filter(m => m.status !== 'LOCKED'));
    });
  }, []);

  useEffect(() => {
    if (!selectedPlayer) return;
    getPlayerPredictions(selectedPlayer.id).then(preds => {
      const map: Record<number, { home: string; away: string }> = {};
      preds.forEach(p => { map[p.match_id] = { home: String(p.pred_home), away: String(p.pred_away) }; });
      setPredictions(map);
    });
  }, [selectedPlayer]);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const p = await createPlayer(newName.trim(), newAvatar);
      setPlayers(prev => [...prev, p]);
      setNewName('');
      showToast(`✅ ${p.name} agregado a la quiniela`);
    } catch (err) {
      showToast('Error al agregar jugador', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar a ${name}? Se borrarán todas sus predicciones.`)) return;
    try {
      await deletePlayer(id);
      setPlayers(prev => prev.filter(p => p.id !== id));
      if (selectedPlayer?.id === id) setSelectedPlayer(null);
      showToast(`🗑️ ${name} eliminado`);
    } catch {
      showToast('Error al eliminar', 'error');
    }
  };

  const handlePredChange = (matchId: number, side: 'home' | 'away', val: string) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], home: prev[matchId]?.home ?? '', away: prev[matchId]?.away ?? '', [side]: val },
    }));
  };

  const handleSavePredictions = async () => {
    if (!selectedPlayer) return;
    setSaving(true);
    try {
      const entries = Object.entries(predictions)
        .filter(([, v]) => v.home !== '' && v.away !== '')
        .map(([matchId, v]) => ({
          player_id: selectedPlayer.id,
          match_id: Number(matchId),
          pred_home: parseInt(v.home),
          pred_away: parseInt(v.away),
        }))
        .filter(p => !isNaN(p.pred_home) && !isNaN(p.pred_away));

      await Promise.all(entries.map(e => upsertPrediction(e.player_id, e.match_id, e.pred_home, e.pred_away)));
      showToast(`✅ ${entries.length} predicciones guardadas`);
    } catch {
      showToast('Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const availableMatches = matches.filter(m => m.team_home_id && m.team_away_id);
  const groupedMatches = availableMatches.reduce((acc, m) => {
    const key = m.phase === 'GROUP' ? `Grupo ${m.group_id}` : (PHASE_LABELS[m.phase] ?? m.phase);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {} as Record<string, QuinielaMatch[]>);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">👥 Jugadores & Predicciones</h1>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'players' ? 'active' : ''}`} onClick={() => setTab('players')}>Jugadores ({players.length})</button>
        <button className={`tab ${tab === 'predictions' ? 'active' : ''}`} onClick={() => setTab('predictions')}>Predicciones</button>
      </div>

      {tab === 'players' && (
        <div className="grid-2">
          {/* Add player */}
          <div className="card">
            <div className="card-header"><span className="card-title">➕ Nuevo Jugador</span></div>
            <div className="card-body">
              <form onSubmit={handleAddPlayer}>
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input className="form-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre del jugador" />
                </div>
                <div className="form-group">
                  <label className="form-label">Avatar</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {AVATARS.map(a => (
                      <button key={a} type="button"
                        onClick={() => setNewAvatar(a)}
                        style={{ fontSize: '1.5rem', padding: '6px', borderRadius: '8px', border: `2px solid ${newAvatar === a ? 'var(--green)' : 'var(--border)'}`, background: newAvatar === a ? 'var(--green-glow)' : 'var(--bg-base)' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Agregar Jugador
                </button>
              </form>
            </div>
          </div>

          {/* Players list */}
          <div className="card">
            <div className="card-header"><span className="card-title">Lista de Jugadores</span></div>
            <div className="card-body">
              {players.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No hay jugadores aún.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {players.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{p.avatar}</span>
                      <span style={{ flex: 1, fontWeight: 600 }}>{p.name}</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedPlayer(p); setTab('predictions'); }}>
                        Predicciones →
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'predictions' && (
        <div>
          {/* Player selector */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Seleccionar Jugador</label>
                <select className="form-select" value={selectedPlayer?.id ?? ''} onChange={e => {
                  const p = players.find(p => p.id === e.target.value);
                  setSelectedPlayer(p ?? null);
                }}>
                  <option value="">— Selecciona un jugador —</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {selectedPlayer && (
            <>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 700 }}>{selectedPlayer.avatar} {selectedPlayer.name}</h2>
                <button className="btn btn-primary" onClick={handleSavePredictions} disabled={saving}>
                  {saving ? 'Guardando...' : '💾 Guardar Predicciones'}
                </button>
              </div>

              {Object.entries(groupedMatches).map(([groupLabel, gMatches]) => (
                <div key={groupLabel} className="card" style={{ marginBottom: '1.5rem' }}>
                  <div className="card-header"><span className="card-title">{groupLabel}</span></div>
                  <div className="card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {gMatches.map(m => (
                        <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{m.team_home?.flag_emoji}</span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.team_home?.name}</span>
                          </div>
                          <div className="score-inputs">
                            <input type="number" min="0" max="20" className="form-input"
                              value={predictions[m.id]?.home ?? ''}
                              onChange={e => handlePredChange(m.id, 'home', e.target.value)}
                              placeholder="—" />
                            <span className="score-separator">–</span>
                            <input type="number" min="0" max="20" className="form-input"
                              value={predictions[m.id]?.away ?? ''}
                              onChange={e => handlePredChange(m.id, 'away', e.target.value)}
                              placeholder="—" />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>{m.team_away?.name}</span>
                            <span style={{ fontSize: '1.2rem' }}>{m.team_away?.flag_emoji}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={handleSavePredictions} disabled={saving} style={{ padding: '14px 32px', fontSize: '1rem' }}>
                  {saving ? 'Guardando...' : '💾 Guardar Todas las Predicciones'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
