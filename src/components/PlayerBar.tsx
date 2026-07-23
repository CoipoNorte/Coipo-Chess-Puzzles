import React, { useMemo } from 'react';
import { usePuzzleStore } from '../store/puzzleStore';

interface PlayerBarProps { position: 'top' | 'bottom'; }

const VALS: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
const INIT: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };

const PlayerBar: React.FC<PlayerBarProps> = ({ position }) => {
  const { chess, boardOrientation, lastMove, status } = usePuzzleStore();
  const color = position === 'bottom' ? (boardOrientation === 'white' ? 'w' : 'b') : (boardOrientation === 'white' ? 'b' : 'w');
  const isPlayer = position === 'bottom';
  const isActive = chess.turn() === color && (status === 'playing' || status === 'thinking');

  const { captured, matDiff } = useMemo(() => {
    const board = chess.board();
    const op: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    board.forEach(r => r.forEach(s => { if (s && s.color !== color && s.type !== 'k') op[s.type]++; }));
    const caps: string[] = []; let md = 0;
    const sym: Record<string, Record<string, string>> = {
      w: { q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }, b: { q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
    };
    ['q', 'r', 'b', 'n', 'p'].forEach(p => {
      const d = INIT[p] - op[p];
      for (let i = 0; i < d; i++) { caps.push(sym[color === 'w' ? 'b' : 'w'][p]); md += VALS[p]; }
    });
    return { captured: caps, matDiff: md };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chess, color, lastMove, status]);

  return (
    <div style={{ padding: '1px 12px', width: '100%', maxWidth: 500 }}>
      <div style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        padding: '4px 8px', borderRadius: 8,
        backgroundColor: isActive ? '#2a2826' : 'transparent',
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          backgroundColor: color === 'w' ? '#ddd' : '#444',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 8, flexShrink: 0,
        }}>
          <span style={{ fontSize: 11 }}>{isPlayer ? '👤' : '🤖'}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#f0ede8' : '#7d7a75', marginRight: 4 }}>
          {isPlayer ? 'Tú' : 'Bot'}
        </span>
        {isActive && <div style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#81b64c', marginRight: 4 }} />}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {captured.slice(0, 6).map((c, i) => (
            <span key={i} style={{ fontSize: 11, opacity: 0.5 }}>{c}</span>
          ))}
          {matDiff > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#7d7a75', marginLeft: 2 }}>+{matDiff}</span>}
        </div>
        <div style={{ padding: '2px 6px', borderRadius: 5, backgroundColor: isActive ? '#f0ede8' : '#2f2d2a' }}>
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: isActive ? '#1b1a18' : '#7d7a75' }}>∞</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
