import { create } from 'zustand';
import { Chess, type Square } from 'chess.js';
import { puzzles, type PuzzleData } from '../data/puzzles';
import { validatePuzzle, generateRandomPuzzle } from '../engine/puzzleGenerator';
import {
  playMoveSound,
  playCaptureSound,
  playCorrectSound,
  playWrongSound,
  playPuzzleCompleteSound,
} from '../utils/sounds';

export type PuzzleStatus = 'loading' | 'playing' | 'thinking' | 'completed' | 'wrong';
export type MoveResult = 'correct' | 'wrong' | null;

interface MoveHistoryEntry {
  from: string;
  to: string;
  san: string;
  isPlayer: boolean;
  isCorrect?: boolean;
}

interface PuzzleStats {
  totalSolved: number;
  totalAttempted: number;
  streak: number;
  bestStreak: number;
  ratingEstimate: number;
  puzzleHistory: { id: string; solved: boolean; rating: number; date: string }[];
}

interface WrongMoveAnim {
  from: string;
  to: string;
  pieceType: string;
  pieceColor: 'w' | 'b';
}

export interface AnimatingPiece {
  from: string;
  to: string;
  pieceType: string;
  pieceColor: 'w' | 'b';
}

interface PuzzleState {
  currentPuzzle: PuzzleData | null;
  chess: Chess;
  boardOrientation: 'white' | 'black';
  currentMoveIndex: number;
  status: PuzzleStatus;
  lastMoveResult: MoveResult;
  moveHistory: MoveHistoryEntry[];
  hintSquare: string | null;
  showHint: boolean;
  selectedSquare: Square | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  stats: PuzzleStats;
  validPuzzles: PuzzleData[];
  puzzleIndex: number;
  wrongMoveAnim: WrongMoveAnim | null;
  wrongCount: number;
  showSolution: boolean;
  animatingPiece: AnimatingPiece | null;

  loadPuzzle: (puzzle?: PuzzleData) => void;
  loadNextPuzzle: () => void;
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square, promotion?: string) => boolean;
  getHint: () => void;
  resetStats: () => void;
  clearSelection: () => void;
  viewSolution: () => void;
  autoSolve: () => void;
}

const STORAGE_KEY = 'chess-puzzles-stats-v3';

const loadStats = (): PuzzleStats => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* empty */ }
  return {
    totalSolved: 0,
    totalAttempted: 0,
    streak: 0,
    bestStreak: 0,
    ratingEstimate: 800,
    puzzleHistory: [],
  };
};

const saveStats = (stats: PuzzleStats) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch { /* empty */ }
};

const validatedPuzzles = puzzles.filter(p => validatePuzzle(p));

const ensureEnoughPuzzles = (existing: PuzzleData[]): PuzzleData[] => {
  const target = 25;
  const result = [...existing];
  let attempts = 0;
  while (result.length < target && attempts < 60) {
    const gen = generateRandomPuzzle();
    if (gen && validatePuzzle(gen)) result.push(gen);
    attempts++;
  }
  return result;
};

const allPuzzles = ensureEnoughPuzzles(validatedPuzzles);

const shuffleArray = <T,>(arr: T[]): T[] => {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
};

const getSoundEnabled = (): boolean => {
  try { return localStorage.getItem('chess-sound') !== 'false'; } catch { return true; }
};

export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  currentPuzzle: null,
  chess: new Chess(),
  boardOrientation: 'white',
  currentMoveIndex: 0,
  status: 'loading',
  lastMoveResult: null,
  moveHistory: [],
  hintSquare: null,
  showHint: false,
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,
  stats: loadStats(),
  validPuzzles: shuffleArray(allPuzzles),
  puzzleIndex: 0,
  wrongMoveAnim: null,
  wrongCount: 0,
  showSolution: false,
  animatingPiece: null,

  loadPuzzle: (puzzle?: PuzzleData) => {
    const state = get();
    let p: PuzzleData;
    if (puzzle) {
      p = puzzle;
    } else {
      const idx = state.puzzleIndex % state.validPuzzles.length;
      p = state.validPuzzles[idx];
    }
    const chess = new Chess(p.fen);
    const currentTurn = chess.turn();
    const playerColor = currentTurn === 'w' ? 'black' : 'white';

    set({
      currentPuzzle: p,
      chess,
      boardOrientation: playerColor,
      currentMoveIndex: 0,
      status: 'loading',
      lastMoveResult: null,
      moveHistory: [],
      hintSquare: null,
      showHint: false,
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      wrongMoveAnim: null,
      wrongCount: 0,
      showSolution: false,
    });

    // Play opponent's setup move with animation
    setTimeout(() => {
      const cur = get();
      if (cur.currentPuzzle?.id !== p.id) return;
      const move = p.moves[0];
      const from = move.substring(0, 2) as Square;
      const to = move.substring(2, 4) as Square;
      const promotion = move.length > 4 ? move.substring(4) : undefined;

      const piece = chess.get(from);
      if (piece) {
        set({ animatingPiece: { from, to, pieceType: piece.type, pieceColor: piece.color } });
      }

      setTimeout(() => {
        try {
          const result = chess.move({ from, to, promotion });
          if (result) {
            if (getSoundEnabled()) { result.captured ? playCaptureSound() : playMoveSound(); }
            set({ currentMoveIndex: 1, status: 'playing', lastMove: { from, to }, animatingPiece: null, moveHistory: [{ from, to, san: result.san, isPlayer: false }] });
          } else {
            set({ animatingPiece: null }); get().loadNextPuzzle();
          }
        } catch {
          set({ animatingPiece: null }); get().loadNextPuzzle();
        }
      }, 350);
    }, 600);
  },

  loadNextPuzzle: () => {
    const state = get();
    const nextIndex = (state.puzzleIndex + 1) % state.validPuzzles.length;
    let newPuzzles = state.validPuzzles;
    if (nextIndex === 0) newPuzzles = shuffleArray(state.validPuzzles);
    set({ puzzleIndex: nextIndex, validPuzzles: newPuzzles });
    get().loadPuzzle(newPuzzles[nextIndex]);
  },

  selectSquare: (square: Square) => {
    const { chess, selectedSquare, status, boardOrientation } = get();
    if (status !== 'playing') return;
    const playerColor = boardOrientation === 'white' ? 'w' : 'b';

    if (selectedSquare) {
      const moveSuccess = get().makeMove(selectedSquare, square);
      if (!moveSuccess) {
        const piece = chess.get(square);
        if (piece && piece.color === playerColor) {
          const moves = chess.moves({ square, verbose: true });
          set({ selectedSquare: square, legalMoves: moves.map(m => m.to) });
        } else {
          set({ selectedSquare: null, legalMoves: [] });
        }
      }
      return;
    }

    const piece = chess.get(square);
    if (piece && piece.color === playerColor) {
      const moves = chess.moves({ square, verbose: true });
      set({ selectedSquare: square, legalMoves: moves.map(m => m.to) });
    }
  },

  makeMove: (from: Square, to: Square, promotion?: string) => {
    const { chess, currentPuzzle, currentMoveIndex, moveHistory } = get();
    if (!currentPuzzle) return false;

    const piece = chess.get(from);
    if (piece?.type === 'p') {
      const rank = to[1];
      if ((piece.color === 'w' && rank === '8') || (piece.color === 'b' && rank === '1')) {
        if (!promotion) promotion = 'q';
      }
    }

    try {
      const result = chess.move({ from, to, promotion });
      if (!result) return false;

      const playerMoveStr = from + to + (promotion || '');
      const expectedMove = currentPuzzle.moves[currentMoveIndex];
      const isCorrect = playerMoveStr === expectedMove;

      const newHistory: MoveHistoryEntry[] = [
        ...moveHistory,
        { from, to, san: result.san, isPlayer: true, isCorrect },
      ];

      if (isCorrect) {
        // ✅ CORRECT MOVE
        const nextMoveIndex = currentMoveIndex + 1;

        if (getSoundEnabled()) {
          result.captured ? playCaptureSound() : playMoveSound();
        }

        if (nextMoveIndex >= currentPuzzle.moves.length) {
          // 🏆 PUZZLE COMPLETE
          const stats = { ...get().stats };
          const wasClean = get().wrongCount === 0;
          if (wasClean) {
            stats.totalSolved++;
            stats.streak++;
            if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak;
            stats.ratingEstimate = Math.min(3000, stats.ratingEstimate + Math.max(5, Math.floor((currentPuzzle.rating - stats.ratingEstimate) * 0.1 + 10)));
          }
          stats.totalAttempted++;
          stats.puzzleHistory = [...stats.puzzleHistory.slice(-50), {
            id: currentPuzzle.id,
            solved: wasClean,
            rating: currentPuzzle.rating,
            date: new Date().toISOString(),
          }];
          saveStats(stats);

          if (getSoundEnabled()) {
            setTimeout(() => playPuzzleCompleteSound(), 200);
          }

          set({
            currentMoveIndex: nextMoveIndex,
            status: 'completed',
            lastMoveResult: 'correct',
            moveHistory: newHistory,
            selectedSquare: null,
            legalMoves: [],
            lastMove: { from, to },
            stats,
          });
        } else {
          // ✅ Correct but more moves needed — opponent responds
          if (getSoundEnabled()) {
            setTimeout(() => playCorrectSound(), 100);
          }

          set({
            currentMoveIndex: nextMoveIndex,
            status: 'thinking',
            lastMoveResult: 'correct',
            moveHistory: newHistory,
            selectedSquare: null,
            legalMoves: [],
            lastMove: { from, to },
            showHint: false,
            hintSquare: null,
          });

          setTimeout(() => {
            const state = get();
            if (state.currentMoveIndex !== nextMoveIndex) return;
            const opMove = currentPuzzle.moves[nextMoveIndex];
            const opFrom = opMove.substring(0, 2) as Square;
            const opTo = opMove.substring(2, 4) as Square;
            const opPromo = opMove.length > 4 ? opMove.substring(4) : undefined;

            // Animate opponent piece
            const opPiece = chess.get(opFrom);
            if (opPiece) {
              set({ animatingPiece: { from: opFrom, to: opTo, pieceType: opPiece.type, pieceColor: opPiece.color } });
            }

            setTimeout(() => {
              try {
                const opResult = chess.move({ from: opFrom, to: opTo, promotion: opPromo });
                if (opResult) {
                  if (getSoundEnabled()) { opResult.captured ? playCaptureSound() : playMoveSound(); }
                  set({
                    currentMoveIndex: nextMoveIndex + 1, status: 'playing', lastMoveResult: null, animatingPiece: null,
                    moveHistory: [...get().moveHistory, { from: opFrom, to: opTo, san: opResult.san, isPlayer: false }],
                    lastMove: { from: opFrom, to: opTo },
                  });
                } else { set({ animatingPiece: null }); }
              } catch {
                set({ status: 'completed', animatingPiece: null });
              }
            }, 350);
          }, 500);
        }
      } else {
        // ❌ WRONG MOVE — undo, shake board, auto-retry
        chess.undo();

        if (getSoundEnabled()) playWrongSound();

        const newWrongCount = get().wrongCount + 1;

        // Update stats on first wrong attempt only
        if (newWrongCount === 1) {
          const stats = { ...get().stats };
          stats.streak = 0;
          stats.ratingEstimate = Math.max(100, stats.ratingEstimate - 5);
          saveStats(stats);
          set({ stats });
        }

        // Show the wrong move animation (piece moves then bounces back)
        set({
          status: 'wrong',
          lastMoveResult: 'wrong',
          selectedSquare: null,
          legalMoves: [],
          wrongMoveAnim: {
            from,
            to,
            pieceType: piece?.type || 'p',
            pieceColor: piece?.color || 'w',
          },
          wrongCount: newWrongCount,
        });

        // Auto-retry: after shake animation, return to playing
        setTimeout(() => {
          const cur = get();
          if (cur.status !== 'wrong') return;
          set({
            status: 'playing',
            lastMoveResult: null,
            wrongMoveAnim: null,
          });
        }, 1200);
      }

      return true;
    } catch {
      return false;
    }
  },

  getHint: () => {
    const { currentPuzzle, currentMoveIndex } = get();
    if (!currentPuzzle || currentMoveIndex >= currentPuzzle.moves.length) return;
    const expectedMove = currentPuzzle.moves[currentMoveIndex];
    const from = expectedMove.substring(0, 2);
    set({ hintSquare: from, showHint: true });
  },

  clearSelection: () => {
    set({ selectedSquare: null, legalMoves: [] });
  },

  viewSolution: () => {
    const { currentPuzzle, currentMoveIndex } = get();
    if (!currentPuzzle || currentMoveIndex >= currentPuzzle.moves.length) return;
    set({ showSolution: true });
    const expected = currentPuzzle.moves[currentMoveIndex];
    const from = expected.substring(0, 2);
    set({ hintSquare: from, showHint: true });
  },

  autoSolve: () => {
    const { currentPuzzle, currentMoveIndex, chess, status } = get();
    if (!currentPuzzle || status === 'completed' || status === 'loading') return;

    const playNext = (idx: number) => {
      if (idx >= currentPuzzle.moves.length) {
        const stats = { ...get().stats };
        stats.totalAttempted++;
        stats.puzzleHistory = [...stats.puzzleHistory.slice(-50), {
          id: currentPuzzle.id, solved: false, rating: currentPuzzle.rating, date: new Date().toISOString(),
        }];
        saveStats(stats);
        set({ status: 'completed', lastMoveResult: 'correct', stats, wrongCount: 999, animatingPiece: null });
        return;
      }

      const moveStr = currentPuzzle.moves[idx];
      const from = moveStr.substring(0, 2) as Square;
      const to = moveStr.substring(2, 4) as Square;
      const promo = moveStr.length > 4 ? moveStr.substring(4) : undefined;

      // Step 1: Read the piece BEFORE moving, show animation overlay
      const piece = chess.get(from);
      if (!piece) { playNext(idx + 1); return; }

      set({
        animatingPiece: { from, to, pieceType: piece.type, pieceColor: piece.color },
      });

      // Step 2: After animation (350ms), actually execute the move
      setTimeout(() => {
        try {
          const result = chess.move({ from, to, promotion: promo });
          if (result) {
            if (getSoundEnabled()) {
              result.captured ? playCaptureSound() : playMoveSound();
            }
            set({
              currentMoveIndex: idx + 1,
              lastMove: { from, to },
              animatingPiece: null,
              moveHistory: [...get().moveHistory, { from, to, san: result.san, isPlayer: idx % 2 === 1, isCorrect: true }],
            });
          } else {
            set({ animatingPiece: null });
          }
        } catch {
          set({ animatingPiece: null });
        }

        // Step 3: Next move after a small pause
        setTimeout(() => playNext(idx + 1), 350);
      }, 380);
    };

    set({ status: 'thinking', wrongCount: 999, showSolution: false, selectedSquare: null, legalMoves: [] });
    playNext(currentMoveIndex);
  },

  resetStats: () => {
    const defaultStats: PuzzleStats = {
      totalSolved: 0, totalAttempted: 0,
      streak: 0, bestStreak: 0,
      ratingEstimate: 800, puzzleHistory: [],
    };
    saveStats(defaultStats);
    set({ stats: defaultStats });
  },
}));
