import React, { useCallback, useRef, useEffect, useState } from 'react';
import { type Square } from 'chess.js';
import { usePuzzleStore } from '../store/puzzleStore';
import { ChessPiece } from './ChessPieces';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const ChessBoard: React.FC = () => {
  const {
    chess, boardOrientation, selectedSquare, legalMoves,
    lastMove, status, lastMoveResult, hintSquare, showHint,
    selectSquare, makeMove, wrongMoveAnim, animatingPiece,
  } = usePuzzleStore();

  const wrapRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(300);
  const [dragState, setDragState] = useState<{
    square: Square; pieceType: string; pieceColor: 'w' | 'b';
    x: number; y: number; startX: number; startY: number; isDragging: boolean;
  } | null>(null);

  const [, setTick] = useState(0);
  useEffect(() => { setTick(v => v + 1); }, [lastMove, status, selectedSquare, lastMoveResult, wrongMoveAnim, animatingPiece]);

  // Board = wrapper width (full width minus padding), capped at 520, snapped to 8
  useEffect(() => {
    const update = () => {
      if (wrapRef.current) {
        const available = wrapRef.current.clientWidth;
        const capped = Math.min(available, 520);
        setBoardSize(Math.floor(capped / 8) * 8);
      }
    };
    update();
    window.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => { window.removeEventListener('resize', update); ro.disconnect(); };
  }, []);

  const sq = boardSize / 8;
  const ps = sq * 0.86;
  const dF = boardOrientation === 'white' ? FILES : [...FILES].reverse();
  const dR = boardOrientation === 'white' ? RANKS : [...RANKS].reverse();

  const isL = useCallback((fi: number, ri: number) => (fi + ri) % 2 === 0, []);

  const getBg = useCallback((s: string, light: boolean) => {
    if (wrongMoveAnim?.to === s) return light ? '#f5a0a0' : '#d45454';
    if (selectedSquare === s) return light ? '#f6f669' : '#bbcc44';
    if (lastMove && (lastMove.from === s || lastMove.to === s)) return light ? '#f5f682' : '#b9cc47';
    if (showHint && hintSquare === s) return light ? '#90EE90' : '#66c966';
    return light ? '#ebecd0' : '#779556';
  }, [selectedSquare, lastMove, showHint, hintSquare, wrongMoveAnim]);

  const sqPos = useCallback((s: string) => ({
    x: dF.indexOf(s[0]) * sq, y: dR.indexOf(s[1]) * sq,
  }), [dF, dR, sq]);

  const onDown = useCallback((e: React.PointerEvent, s: string) => {
    if (status !== 'playing') return;
    e.preventDefault();
    const pc = chess.get(s as Square);
    const pCol = boardOrientation === 'white' ? 'w' : 'b';
    if (pc && pc.color === pCol) {
      const r = boardRef.current?.getBoundingClientRect();
      if (r) setDragState({
        square: s as Square, pieceType: pc.type, pieceColor: pc.color,
        x: e.clientX - r.left, y: e.clientY - r.top,
        startX: e.clientX, startY: e.clientY, isDragging: false,
      });
      selectSquare(s as Square);
    } else if (selectedSquare) {
      selectSquare(s as Square);
    }
  }, [status, chess, boardOrientation, selectedSquare, selectSquare]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragState) return;
    const r = boardRef.current?.getBoundingClientRect();
    if (!r) return;
    const dx = Math.abs(e.clientX - dragState.startX);
    const dy = Math.abs(e.clientY - dragState.startY);
    setDragState(p => p ? {
      ...p, x: e.clientX - r.left, y: e.clientY - r.top,
      isDragging: p.isDragging || dx > 5 || dy > 5,
    } : null);
  }, [dragState]);

  const onUp = useCallback((e: React.PointerEvent) => {
    if (!dragState) return;
    if (dragState.isDragging) {
      const r = boardRef.current?.getBoundingClientRect();
      if (r) {
        const fi = Math.floor((e.clientX - r.left) / sq);
        const ri = Math.floor((e.clientY - r.top) / sq);
        if (fi >= 0 && fi < 8 && ri >= 0 && ri < 8) {
          const t = dF[fi] + dR[ri];
          if (t !== dragState.square) makeMove(dragState.square, t as Square);
        }
      }
    }
    setDragState(null);
  }, [dragState, sq, dF, dR, makeMove]);

  const shadow = lastMoveResult === 'correct'
    ? '0 0 24px rgba(129,182,76,0.45)'
    : lastMoveResult === 'wrong'
    ? '0 0 24px rgba(229,83,61,0.45)'
    : '0 4px 20px rgba(0,0,0,0.5)';

  return (
    // Wrapper fills width, board centers inside it
    <div ref={wrapRef} style={{ width: '100%', padding: '0 16px', display: 'flex', justifyContent: 'center' }}>
      <div
        ref={boardRef}
        className={status === 'wrong' ? 'animate-shake' : ''}
        style={{
          position: 'relative',
          width: boardSize, height: boardSize,
          borderRadius: 6, overflow: 'hidden',
          boxShadow: shadow, touchAction: 'none',
        }}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => setDragState(null)}
        onPointerLeave={() => { if (dragState?.isDragging) setDragState(null); }}
      >
        {/* Squares */}
        {dR.map((rank, ri) => dF.map((file, fi) => {
          const s = file + rank;
          const light = isL(fi, ri);
          const bg = getBg(s, light);
          const legal = legalMoves.includes(s);
          const piece = chess.get(s as Square);
          const has = piece !== undefined;
          const dragged = dragState?.isDragging && dragState.square === s;
          const hiddenByAnim = animatingPiece && animatingPiece.from === s;

          return (
            <div
              key={s}
              style={{
                position: 'absolute', left: fi * sq, top: ri * sq,
                width: sq, height: sq, backgroundColor: bg,
              }}
              onPointerDown={e => onDown(e, s)}
              onClick={() => { if (status === 'playing') selectSquare(s as Square); }}
            >
              {/* Coord labels */}
              {fi === 0 && (
                <span style={{
                  position: 'absolute', top: 2, left: 3,
                  fontSize: Math.max(9, sq * 0.19), fontWeight: 700, lineHeight: 1,
                  color: light ? '#779556' : '#ebecd0',
                }}>{rank}</span>
              )}
              {ri === 7 && (
                <span style={{
                  position: 'absolute', bottom: 1, right: 3,
                  fontSize: Math.max(9, sq * 0.19), fontWeight: 700, lineHeight: 1,
                  color: light ? '#779556' : '#ebecd0',
                }}>{file}</span>
              )}

              {/* Legal move dot */}
              {legal && !has && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: sq * 0.32, height: sq * 0.32,
                  borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.15)',
                }} />
              )}
              {/* Legal capture ring */}
              {legal && has && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: sq * 0.88, height: sq * 0.88,
                  borderRadius: '50%',
                  border: `${Math.max(3, sq * 0.07)}px solid rgba(0,0,0,0.15)`,
                  boxSizing: 'border-box',
                }} />
              )}

              {/* Piece — hidden if being animated from this square */}
              {piece && !dragged && !hiddenByAnim && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ChessPiece piece={piece.type} color={piece.color} size={ps} />
                </div>
              )}
            </div>
          );
        }))}

        {/* Wrong move ghost */}
        {wrongMoveAnim && <Ghost a={wrongMoveAnim} pos={sqPos} ps={ps} sq={sq} />}

        {/* Sliding animated piece */}
        {animatingPiece && <SlidingPiece a={animatingPiece} pos={sqPos} ps={ps} sq={sq} />}

        {/* Drag piece */}
        {dragState?.isDragging && (
          <div style={{
            position: 'absolute', zIndex: 50,
            left: dragState.x - ps * 0.6, top: dragState.y - ps * 0.6,
            width: ps * 1.2, height: ps * 1.2,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
          }}>
            <ChessPiece piece={dragState.pieceType} color={dragState.pieceColor} size={ps * 1.2} />
          </div>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 36, height: 36,
              border: '3px solid rgba(255,255,255,0.8)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
          </div>
        )}
      </div>
    </div>
  );
};

// Wrong-move ghost overlay
const Ghost: React.FC<{
  a: { from: string; to: string; pieceType: string; pieceColor: 'w' | 'b' };
  pos: (s: string) => { x: number; y: number };
  ps: number; sq: number;
}> = ({ a, pos, ps, sq }) => {
  const [phase, setPhase] = useState<'go' | 'back' | 'done'>('go');
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('back'), 350);
    const t2 = setTimeout(() => setPhase('done'), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (phase === 'done') return null;
  const t = phase === 'go' ? pos(a.to) : pos(a.from);
  const o = (sq - ps) / 2;
  return (
    <div style={{
      position: 'absolute', zIndex: 40,
      left: t.x + o, top: t.y + o,
      width: ps, height: ps,
      opacity: phase === 'go' ? 0.6 : 1,
      transition: 'left 0.3s ease, top 0.3s ease, opacity 0.2s',
    }}>
      <ChessPiece piece={a.pieceType} color={a.pieceColor} size={ps} />
    </div>
  );
};

// Sliding piece — animates from one square to another with CSS transition
const SlidingPiece: React.FC<{
  a: { from: string; to: string; pieceType: string; pieceColor: 'w' | 'b' };
  pos: (s: string) => { x: number; y: number };
  ps: number; sq: number;
}> = ({ a, pos, ps, sq }) => {
  const [arrived, setArrived] = useState(false);
  const fromPos = pos(a.from);
  const toPos = pos(a.to);
  const o = (sq - ps) / 2;

  // Start at 'from', then transition to 'to' on next frame
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setArrived(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const target = arrived ? toPos : fromPos;

  return (
    <div style={{
      position: 'absolute', zIndex: 45,
      left: target.x + o,
      top: target.y + o,
      width: ps, height: ps,
      transition: arrived ? 'left 0.3s ease, top 0.3s ease' : 'none',
      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
    }}>
      <ChessPiece piece={a.pieceType} color={a.pieceColor} size={ps} />
    </div>
  );
};

export default ChessBoard;
