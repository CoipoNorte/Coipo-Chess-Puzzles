import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';


const PuzzleStatusBar: React.FC = () => {
  const { status, boardOrientation, currentPuzzle, stats, wrongCount } = usePuzzleStore();
  const color = boardOrientation === 'white' ? 'Blancas' : 'Negras';
  const n = currentPuzzle ? Math.ceil((currentPuzzle.moves.length - 1) / 2) : 1;

  let icon = '🎯', title = '', sub = '', bg = '#2f2d2a', border = 'rgba(255,255,255,0.07)';

  switch (status) {
    case 'loading':
      icon = '⏳'; title = 'Tu oponente juega...'; sub = 'Observa el movimiento'; break;
    case 'playing':
      icon = boardOrientation === 'white' ? '⬜' : '⬛';
      title = `Tu turno — ${color}`;
      sub = n > 1 ? `Encuentra ${n} jugadas correctas` : 'Encuentra la mejor jugada';
      break;
    case 'thinking':
      icon = '✅'; title = '¡Correcto! 👏'; sub = 'Sigue, hay más jugadas...';
      bg = 'rgba(129,182,76,0.1)'; border = 'rgba(129,182,76,0.25)'; break;
    case 'wrong':
      icon = '❌'; title = 'Movimiento incorrecto';
      sub = wrongCount >= 2 ? 'Puedes ver la solución' : 'Intenta de nuevo';
      bg = 'rgba(229,83,61,0.1)'; border = 'rgba(229,83,61,0.25)'; break;
    case 'completed':
      icon = '🏆';
      title = wrongCount === 0 ? '¡Puzzle Resuelto! 🎉' : '¡Completado!';
      sub = wrongCount === 0
        ? `+${Math.max(5, Math.floor(((currentPuzzle?.rating || 800) - stats.ratingEstimate) * 0.1 + 10))} rating`
        : 'Intenta sin errores la próxima';
      bg = 'rgba(129,182,76,0.1)'; border = 'rgba(129,182,76,0.25)'; break;
  }

  return (
    <div className="page-padding">
      <div style={{
        backgroundColor: bg, border: `1px solid ${border}`,
        borderRadius: 16, padding: 'var(--card-padding)',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          backgroundColor: status === 'completed' || status === 'thinking' ? 'rgba(129,182,76,0.2)'
            : status === 'wrong' ? 'rgba(229,83,61,0.2)' : '#3d3b37',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 14, flexShrink: 0,
        }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="font-body" style={{ fontWeight: 700, color: '#f0ede8' }}>{title}</p>
          <p className="font-caption" style={{ color: '#7d7a75', marginTop: 2 }}>{sub}</p>
        </div>

        {status === 'completed' && wrongCount === 0 && (
          <div style={{
            backgroundColor: 'rgba(129,182,76,0.2)',
            padding: '6px 12px', borderRadius: 10,
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            marginLeft: 10, flexShrink: 0,
          }}>
            <span style={{ fontSize: 14, marginRight: 3 }}>🔥</span>
            <span className="font-body" style={{ color: '#81b64c', fontWeight: 700 }}>{stats.streak}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleStatusBar;
