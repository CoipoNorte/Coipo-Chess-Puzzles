import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';

const MoveHistory: React.FC = () => {
  const { moveHistory } = usePuzzleStore();
  if (moveHistory.length === 0) return null;

  return (
    <div style={{ padding: '0 12px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
        {moveHistory.map((m, i) => {
          const ok = m.isPlayer && m.isCorrect;
          const bad = m.isPlayer && !m.isCorrect;
          return (
            <div key={i} style={{
              backgroundColor: ok ? 'rgba(129,182,76,0.12)' : bad ? 'rgba(229,83,61,0.12)' : '#2f2d2a',
              border: `1px solid ${ok ? 'rgba(129,182,76,0.25)' : bad ? 'rgba(229,83,61,0.25)' : 'rgba(255,255,255,0.04)'}`,
              borderRadius: 6, padding: '3px 8px',
              display: 'flex', flexDirection: 'row', alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, marginRight: 3, color: ok ? '#81b64c' : bad ? '#e5533d' : '#7d7a75', opacity: m.isPlayer ? 1 : 0.4 }}>
                {m.isPlayer ? (ok ? '✓' : '✗') : '•'}
              </span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 12, color: ok ? '#81b64c' : bad ? '#e5533d' : '#b5b1ab' }}>
                {m.san}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoveHistory;
