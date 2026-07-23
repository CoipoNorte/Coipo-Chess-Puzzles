import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';
import { getExplanation, getGoalIcon } from '../data/puzzles';

const Explanation: React.FC = () => {
  const { currentPuzzle, status } = usePuzzleStore();
  if (status !== 'completed' || !currentPuzzle) return null;

  const explanation = getExplanation(currentPuzzle);
  const icon = getGoalIcon(currentPuzzle.goal);

  return (
    <div style={{ padding: '0 12px' }}>
      <div style={{
        backgroundColor: '#222120',
        border: '1px solid rgba(129,182,76,0.15)',
        borderRadius: 12, padding: '10px 12px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 14, marginRight: 6 }}>📖</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#81b64c' }}>¿Por qué esta jugada?</span>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: 8, padding: '5px 8px', marginBottom: 6,
        }}>
          <span style={{ fontSize: 14, marginRight: 6 }}>{icon}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#f0ede8' }}>{currentPuzzle.goal}</span>
        </div>
        <p style={{ fontSize: 12, color: '#b5b1ab', lineHeight: 1.5 }}>{explanation}</p>
      </div>
    </div>
  );
};

export default Explanation;
