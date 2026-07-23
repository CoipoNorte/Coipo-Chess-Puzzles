import React from 'react';
import { usePuzzleStore } from '../store/puzzleStore';
import { getDifficultyLabel, getDifficultyColor, getGoalIcon } from '../data/puzzles';

const PuzzleHeader: React.FC = () => {
  const { currentPuzzle, stats, validPuzzles, puzzleIndex, wrongCount } = usePuzzleStore();
  if (!currentPuzzle) return null;

  const diffLabel = getDifficultyLabel(currentPuzzle.rating);
  const diffColor = getDifficultyColor(currentPuzzle.rating);
  const goalIcon = getGoalIcon(currentPuzzle.goal);
  const puzzleNum = (puzzleIndex % validPuzzles.length) + 1;
  const totalPuzzles = validPuzzles.length;
  const moves = Math.ceil((currentPuzzle.moves.length - 1) / 2);

  return (
    <div style={{ padding: '2px 12px 6px' }}>
      {/* Single compact row: icon + goal + meta */}
      <div className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 20, marginRight: 8, flexShrink: 0 }}>{goalIcon}</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#f0ede8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentPuzzle.goal}</p>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#7d7a75' }}>#{puzzleNum}/{totalPuzzles}</span>
              <span style={{ fontSize: 11, color: '#7d7a75' }}>·</span>
              <span style={{ fontSize: 11, color: '#7d7a75' }}>{moves > 1 ? `${moves} jugadas` : '1 jugada'}</span>
            </div>
          </div>
        </div>

        {/* Right side: rating + badges */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 8, flexShrink: 0 }}>
          {wrongCount > 0 && (
            <div style={{ backgroundColor: 'rgba(229,83,61,0.15)', padding: '2px 6px', borderRadius: 6 }}>
              <span style={{ color: '#e5533d', fontSize: 10, fontWeight: 700 }}>{wrongCount}×</span>
            </div>
          )}
          {stats.streak > 0 && (
            <span style={{ fontSize: 11 }}>🔥{stats.streak}</span>
          )}
          <div className="chip">
            <span style={{ color: '#f0b429', fontSize: 11, fontWeight: 700 }}>★{currentPuzzle.rating}</span>
          </div>
          <div style={{ backgroundColor: diffColor + '25', padding: '2px 6px', borderRadius: 5 }}>
            <span style={{ color: diffColor, fontWeight: 700, fontSize: 10 }}>{diffLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleHeader;
