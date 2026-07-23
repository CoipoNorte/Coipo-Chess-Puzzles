import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';

const ActionButtons: React.FC = () => {
  const { status, loadNextPuzzle, getHint, viewSolution, autoSolve, wrongCount, showSolution, currentPuzzle, currentMoveIndex } = usePuzzleStore();

  return (
    <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
      {status === 'playing' && !showSolution && (
        <button onClick={getHint} className="btn-secondary">
          <span style={{ fontSize: 14, marginRight: 4 }}>💡</span>
          <span style={{ color: '#f0b429', fontWeight: 700, fontSize: 13 }}>Pista</span>
        </button>
      )}
      {status === 'playing' && (
        <button onClick={autoSolve} className="btn-secondary">
          <span style={{ fontSize: 14, marginRight: 4 }}>⏩</span>
          <span style={{ color: '#b5b1ab', fontWeight: 700, fontSize: 13 }}>Resolver</span>
        </button>
      )}
      {status === 'playing' && wrongCount >= 2 && !showSolution && (
        <button onClick={viewSolution} className="btn-secondary">
          <span style={{ fontSize: 14, marginRight: 4 }}>👁️</span>
          <span style={{ color: '#b5b1ab', fontWeight: 700, fontSize: 13 }}>Solución</span>
        </button>
      )}
      {showSolution && status === 'playing' && currentPuzzle && (
        <div style={{ backgroundColor: 'rgba(240,180,41,0.12)', border: '2px solid rgba(240,180,41,0.3)', borderRadius: 10, padding: '6px 14px' }}>
          <span style={{ color: '#f0b429', fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>
            {currentMoveIndex < currentPuzzle.moves.length
              ? `${currentPuzzle.moves[currentMoveIndex].substring(0, 2)} → ${currentPuzzle.moves[currentMoveIndex].substring(2, 4)}`
              : ''}
          </span>
        </div>
      )}
      {status === 'completed' && (
        <button onClick={loadNextPuzzle} className="btn-primary"
          style={{ boxShadow: '0 4px 12px rgba(129,182,76,0.3)', flex: 1, maxWidth: 280 }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginRight: 4 }}>Siguiente</span>
          <span style={{ color: '#fff', fontSize: 16 }}>→</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
