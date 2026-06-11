'use client';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">⚙️ Panel de Administración</h1>
        <p className="page-subtitle">Gestiona jugadores, predicciones y resultados</p>
      </div>

      <div className="grid-2" style={{ maxWidth: 700 }}>
        <Link href="/admin/jugadores" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '2rem', cursor: 'pointer', transition: 'border-color 0.2s', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Jugadores & Predicciones</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Agrega participantes y registra sus predicciones para cada partido.
            </p>
          </div>
        </Link>

        <Link href="/admin/resultados" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '2rem', cursor: 'pointer', transition: 'border-color 0.2s', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚽</div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Registrar Resultados</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Ingresa los marcadores reales de los partidos para actualizar los puntos.
            </p>
          </div>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '2rem', maxWidth: 700 }}>
        <div className="card-header">
          <span className="card-title">ℹ️ Sistema de Puntos</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { pts: '3 pts', label: 'Marcador exacto', color: 'var(--gold)', ex: 'Pred. 2-1 · Real 2-1' },
              { pts: '1 pt',  label: 'Resultado correcto (G/P/E)', color: 'var(--green)', ex: 'Pred. 2-0 · Real 3-1' },
              { pts: '0 pts', label: 'Predicción incorrecta', color: 'var(--red)', ex: 'Pred. 2-0 · Real 0-1' },
            ].map(({ pts, label, color, ex }) => (
              <div key={pts} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color, minWidth: 56 }}>{pts}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{ex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
