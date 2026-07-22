import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';
import { getExplanation, getGoalIcon } from '../data/puzzles';

const Explanation: React.FC = () => {
  const { currentPuzzle, status } = usePuzzleStore();
  if (status !== 'completed' || !currentPuzzle) return null;

  const explanation = getExplanation(currentPuzzle);
  const icon = getGoalIcon(currentPuzzle.goal);

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        backgroundColor: '#262421',
        border: '1px solid rgba(129,182,76,0.2)',
        borderRadius: 14,
        padding: 16,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 20, marginRight: 10 }}>📖</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#81b64c' }}>¿Por qué esta jugada?</span>
        </div>

        {/* Goal recap */}
        <div style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: 10, padding: '8px 12px',
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 18, marginRight: 8 }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f0ede8' }}>{currentPuzzle.goal}</span>
          <span style={{ fontSize: 12, color: '#7d7a75', marginLeft: 8 }}>— Rating {currentPuzzle.rating}</span>
        </div>

        {/* Explanation text */}
        <p style={{
          fontSize: 13, color: '#b5b1ab',
          lineHeight: 1.65,
        }}>
          {explanation}
        </p>
      </div>
    </div>
  );
};

export default Explanation;
