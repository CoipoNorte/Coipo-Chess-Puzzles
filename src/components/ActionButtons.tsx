import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';


const ActionButtons: React.FC = () => {
  const { status, loadNextPuzzle, getHint, viewSolution, autoSolve, wrongCount, showSolution, currentPuzzle, currentMoveIndex } = usePuzzleStore();

  return (
    <div className="page-padding gap-md" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>

      {/* Hint */}
      {status === 'playing' && !showSolution && (
        <button onClick={getHint} className="btn-secondary">
          <span style={{ fontSize: 16, marginRight: 6 }}>💡</span>
          <span style={{ color: '#f0b429', fontWeight: 700 }} className="font-body">Pista</span>
        </button>
      )}

      {/* Resolve — always visible while playing */}
      {status === 'playing' && (
        <button onClick={autoSolve} className="btn-secondary">
          <span style={{ fontSize: 16, marginRight: 6 }}>⏩</span>
          <span style={{ color: '#b5b1ab', fontWeight: 700 }} className="font-body">Resolver</span>
        </button>
      )}

      {/* Show Solution text — after 2+ wrong */}
      {status === 'playing' && wrongCount >= 2 && !showSolution && (
        <button onClick={viewSolution} className="btn-secondary">
          <span style={{ fontSize: 16, marginRight: 6 }}>👁️</span>
          <span style={{ color: '#b5b1ab', fontWeight: 700 }} className="font-body">Solución</span>
        </button>
      )}

      {/* Solution display */}
      {showSolution && status === 'playing' && currentPuzzle && (
        <div style={{
          backgroundColor: 'rgba(240,180,41,0.12)',
          border: '2px solid rgba(240,180,41,0.35)',
          borderRadius: 12, padding: '10px 18px',
        }}>
          <span className="font-heading" style={{ color: '#f0b429', fontWeight: 700, fontFamily: 'monospace' }}>
            {currentMoveIndex < currentPuzzle.moves.length
              ? `${currentPuzzle.moves[currentMoveIndex].substring(0, 2)} → ${currentPuzzle.moves[currentMoveIndex].substring(2, 4)}`
              : ''}
          </span>
        </div>
      )}

      {/* Next puzzle */}
      {status === 'completed' && (
        <button onClick={loadNextPuzzle} className="btn-primary"
          style={{ boxShadow: '0 4px 16px rgba(129,182,76,0.35)', flex: 1, maxWidth: 320 }}
        >
          <span style={{ color: '#fff', fontWeight: 700, marginRight: 6 }} className="font-heading">Siguiente Puzzle</span>
          <span className="font-nav" style={{ color: '#fff' }}>→</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
