import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';

const PuzzleStatusBar: React.FC = () => {
  const { status, boardOrientation, currentPuzzle, stats, wrongCount } = usePuzzleStore();
  const color = boardOrientation === 'white' ? 'Blancas' : 'Negras';
  const n = currentPuzzle ? Math.ceil((currentPuzzle.moves.length - 1) / 2) : 1;

  let icon = '🎯', title = '', sub = '', bg = '#2f2d2a', border = 'rgba(255,255,255,0.06)';

  switch (status) {
    case 'loading': icon = '⏳'; title = 'Oponente juega...'; sub = 'Observa'; break;
    case 'playing':
      icon = boardOrientation === 'white' ? '⬜' : '⬛';
      title = `Tu turno — ${color}`;
      sub = n > 1 ? `Encuentra ${n} jugadas` : 'Mejor jugada';
      break;
    case 'thinking':
      icon = '✅'; title = '¡Correcto!'; sub = 'Sigue...';
      bg = 'rgba(129,182,76,0.1)'; border = 'rgba(129,182,76,0.2)'; break;
    case 'wrong':
      icon = '❌'; title = 'Incorrecto';
      sub = wrongCount >= 2 ? 'Ver solución disponible' : 'Intenta de nuevo';
      bg = 'rgba(229,83,61,0.1)'; border = 'rgba(229,83,61,0.2)'; break;
    case 'completed':
      icon = '🏆'; title = wrongCount === 0 ? '¡Resuelto! 🎉' : '¡Completado!';
      sub = wrongCount === 0
        ? `+${Math.max(5, Math.floor(((currentPuzzle?.rating || 800) - stats.ratingEstimate) * 0.1 + 10))} rating`
        : 'Intenta sin errores';
      bg = 'rgba(129,182,76,0.1)'; border = 'rgba(129,182,76,0.2)'; break;
  }

  return (
    <div style={{ padding: '0 12px' }}>
      <div style={{
        backgroundColor: bg, border: `1px solid ${border}`,
        borderRadius: 12, padding: '10px 12px',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          backgroundColor: status === 'completed' || status === 'thinking' ? 'rgba(129,182,76,0.2)'
            : status === 'wrong' ? 'rgba(229,83,61,0.2)' : '#3d3b37',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 10, flexShrink: 0,
        }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#f0ede8' }}>{title}</p>
          <p style={{ fontSize: 11, color: '#7d7a75', marginTop: 1 }}>{sub}</p>
        </div>
        {status === 'completed' && wrongCount === 0 && (
          <div style={{
            backgroundColor: 'rgba(129,182,76,0.2)', padding: '4px 8px', borderRadius: 8,
            display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 8, flexShrink: 0,
          }}>
            <span style={{ fontSize: 12, marginRight: 2 }}>🔥</span>
            <span style={{ color: '#81b64c', fontWeight: 700, fontSize: 12 }}>{stats.streak}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleStatusBar;
