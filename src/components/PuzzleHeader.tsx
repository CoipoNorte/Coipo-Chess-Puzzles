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
    <div style={{ padding: '4px 16px 8px' }}>
      {/* Goal card */}
      <div className="card" style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 26, marginRight: 12, flexShrink: 0 }}>{goalIcon}</span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#f0ede8' }}>{currentPuzzle.goal}</p>
              <p style={{ fontSize: 12, color: '#7d7a75', marginTop: 2 }}>
                {moves > 1 ? `${moves} jugadas` : '1 jugada'}
              </p>
            </div>
          </div>
          {wrongCount > 0 && (
            <div style={{
              backgroundColor: 'rgba(229,83,61,0.15)',
              padding: '5px 10px', borderRadius: 8, marginLeft: 8, flexShrink: 0,
            }}>
              <span style={{ color: '#e5533d', fontSize: 12, fontWeight: 700 }}>{wrongCount}× error</span>
            </div>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#7d7a75' }}>#{puzzleNum}/{totalPuzzles}</span>
          <div className="chip">
            <span style={{ color: '#f0b429', marginRight: 3, fontSize: 12 }}>★</span>
            <span style={{ color: '#f0b429', fontWeight: 700, fontSize: 12 }}>{currentPuzzle.rating}</span>
          </div>
          <div style={{ backgroundColor: diffColor + '25', padding: '3px 8px', borderRadius: 6 }}>
            <span style={{ color: diffColor, fontWeight: 700, fontSize: 11 }}>{diffLabel}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {stats.streak > 0 && (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <span style={{ fontSize: 13, marginRight: 2 }}>🔥</span>
              <span style={{ color: '#81b64c', fontWeight: 700, fontSize: 12 }}>{stats.streak}</span>
            </div>
          )}
          <div className="chip">
            <span style={{ color: '#5ba4cf', fontWeight: 700, fontSize: 12 }}>{stats.ratingEstimate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleHeader;
