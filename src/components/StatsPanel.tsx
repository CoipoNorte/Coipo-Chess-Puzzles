import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';

interface StatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ isOpen, onClose }) => {
  const { stats, resetStats } = usePuzzleStore();
  if (!isOpen) return null;

  const successRate = stats.totalAttempted > 0 ? Math.round((stats.totalSolved / stats.totalAttempted) * 100) : 0;
  const statItems = [
    { icon: '🏆', label: 'Resueltos', value: stats.totalSolved, color: '#81b64c' },
    { icon: '🎯', label: 'Intentados', value: stats.totalAttempted, color: '#5ba4cf' },
    { icon: '📊', label: 'Éxito', value: `${successRate}%`, color: '#f0b429' },
    { icon: '🔥', label: 'Mejor Racha', value: stats.bestStreak, color: '#e5533d' },
    { icon: '⚡', label: 'Racha', value: stats.streak, color: '#81b64c' },
    { icon: '📈', label: 'Rating', value: stats.ratingEstimate, color: '#5ba4cf' },
  ];

  return (
    <div
      className="panel-overlay"
      onClick={onClose}
    >
      <div className="animate-fade-in" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)' }} />
      
      <div
        className="animate-slide-up bottom-sheet panel-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="panel-handle" style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        </div>

        <div className="panel-content">
          {/* Title */}
          <p className="font-title" style={{ fontWeight: 800, color: '#f0ede8', marginBottom: 20 }}>📊 Estadísticas</p>

          {/* Grid */}
          <div className="gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 20 }}>
            {statItems.map((s, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 18, marginRight: 8 }}>{s.icon}</span>
                  <span className="font-small" style={{ color: '#7d7a75' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* History */}
          {stats.puzzleHistory.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p className="font-caption" style={{ color: '#7d7a75', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>HISTORIAL</p>
              <div className="gap-sm" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {stats.puzzleHistory.slice(-24).map((e, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: e.solved ? 'rgba(129,182,76,0.2)' : 'rgba(229,83,61,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="font-body" style={{ fontWeight: 700, color: e.solved ? '#81b64c' : '#e5533d' }}>
                      {e.solved ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="gap-md" style={{ display: 'flex', flexDirection: 'row' }}>
            <button onClick={onClose} className="btn-primary" style={{ flex: 1 }}>
              <span className="font-heading" style={{ color: '#fff', fontWeight: 700 }}>Continuar</span>
            </button>
            <button onClick={() => { if (confirm('¿Borrar estadísticas?')) resetStats(); }} className="btn-secondary">
              <span className="font-body" style={{ color: '#7d7a75', fontWeight: 700 }}>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
