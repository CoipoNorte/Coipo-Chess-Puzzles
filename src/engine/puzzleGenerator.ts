import { Chess } from 'chess.js';
import type { PuzzleData } from '../data/puzzles';

export function validatePuzzle(puzzle: PuzzleData): boolean {
  try {
    const chess = new Chess(puzzle.fen);
    for (const move of puzzle.moves) {
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      const promotion = move.length > 4 ? move.substring(4) : undefined;
      const result = chess.move({ from, to, promotion });
      if (!result) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getValidPuzzles(puzzleList: PuzzleData[]): PuzzleData[] {
  return puzzleList.filter(validatePuzzle);
}

export function generateRandomPuzzle(): PuzzleData | null {
  try {
    const chess = new Chess();
    const moveCount = 4 + Math.floor(Math.random() * 8);
    for (let i = 0; i < moveCount; i++) {
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) return null;
      const captures = moves.filter(m => m.captured);
      const checks = moves.filter(m => m.san.includes('+'));
      let pool = moves;
      if (checks.length > 0 && Math.random() < 0.3) pool = checks;
      else if (captures.length > 0 && Math.random() < 0.4) pool = captures;
      chess.move(pool[Math.floor(Math.random() * pool.length)]);
    }
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return null;
    const mates = moves.filter(m => m.san.includes('#'));
    const checks = moves.filter(m => m.san.includes('+'));
    const captures = moves.filter(m => m.captured);
    let bestMove;
    let goal = 'Mejor Jugada';
    let rating = 600;
    const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    if (mates.length > 0) {
      bestMove = mates[0]; goal = 'Mate en 1'; rating = 500;
    } else if (checks.length > 0) {
      bestMove = checks[Math.floor(Math.random() * checks.length)]; goal = 'Mejor Jugada'; rating = 700;
    } else if (captures.length > 0) {
      captures.sort((a, b) => (pieceValues[b.captured!] || 0) - (pieceValues[a.captured!] || 0));
      bestMove = captures[0]; goal = 'Captura'; rating = 600;
    } else {
      bestMove = moves[Math.floor(Math.random() * moves.length)]; rating = 800;
    }
    const undone = chess.undo();
    if (!undone) return null;
    const setupFen = chess.fen();
    const opponentMove = undone.from + undone.to + (undone.promotion || '');
    const solutionMove = bestMove.from + bestMove.to + (bestMove.promotion || '');
    return {
      id: `gen_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      fen: setupFen,
      moves: [opponentMove, solutionMove],
      rating,
      themes: ['generated'],
      goal,
    };
  } catch {
    return null;
  }
}
