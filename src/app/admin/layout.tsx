'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'quiniela2026';
const SESSION_KEY = 'quiniela_admin_auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved === 'true') setAuthed(true);
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (checking) return null;

  if (!authed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: 400, width: '100%' }}>
          <div className="card-header">
            <span className="card-title">🔐 Panel de Administración</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  autoFocus
                />
                {error && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '4px' }}>{error}</p>}
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Entrar al panel →
              </button>
            </form>
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Solo el administrador de la quiniela tiene acceso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/admin" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '6px' }}
            className="nav-link">⚙️ Panel</a>
          <a href="/admin/jugadores" className="nav-link" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>👥 Jugadores</a>
          <a href="/admin/resultados" className="nav-link" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>⚽ Resultados</a>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">Salir</button>
      </div>
      {children}
    </div>
  );
}
