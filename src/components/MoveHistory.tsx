import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';


const MoveHistory: React.FC = () => {
  const { moveHistory } = usePuzzleStore();
  if (moveHistory.length === 0) return null;

  return (
    <div className="page-padding">
      <div className="card">
        <p className="font-micro" style={{ fontWeight: 700, color: '#7d7a75', letterSpacing: 1.5, marginBottom: 10 }}>
          JUGADAS
        </p>
        <div className="gap-sm" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {moveHistory.map((m, i) => {
            const ok = m.isPlayer && m.isCorrect;
            const bad = m.isPlayer && !m.isCorrect;
            return (
              <div key={i} style={{
                backgroundColor: ok ? 'rgba(129,182,76,0.12)' : bad ? 'rgba(229,83,61,0.12)' : '#3d3b37',
                border: `1px solid ${ok ? 'rgba(129,182,76,0.3)' : bad ? 'rgba(229,83,61,0.3)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 8, padding: '5px 10px',
                display: 'flex', flexDirection: 'row', alignItems: 'center',
              }}>
                {m.isPlayer && (
                  <span style={{ marginRight: 4, color: ok ? '#81b64c' : '#e5533d' }} className="font-micro">
                    {ok ? '✓' : '✗'}
                  </span>
                )}
                {!m.isPlayer && (
                  <span style={{ marginRight: 4, opacity: 0.35, color: '#b5b1ab' }} className="font-micro">•</span>
                )}
                <span className="font-small" style={{
                  fontFamily: 'monospace', fontWeight: 700,
                  color: ok ? '#81b64c' : bad ? '#e5533d' : '#b5b1ab',
                }}>{m.san}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoveHistory;
