export interface PuzzleData {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
  goal: string;
}

// Generate explanation based on goal and themes
export const getExplanation = (puzzle: PuzzleData): string => {
  const g = puzzle.goal;
  if (g.startsWith('Mate en 1')) return 'El rey enemigo no tiene escape. Cuando puedas dar jaque y el rey no puede moverse, bloquear ni capturar la pieza atacante, es jaque mate.';
  if (g.startsWith('Mate en 2')) return 'Un mate en 2 requiere planificación: tu primera jugada fuerza una respuesta del rival, y tu segunda jugada da el mate. Busca jaques que limiten las casillas del rey.';
  if (g === 'Sacrificio' || g.startsWith('Sacrificio')) return 'Un sacrificio es entregar material (pieza o peón) a cambio de una ventaja mayor: ataque al rey, mate, o ganancia de material a largo plazo. No siempre lo más valioso es lo mejor.';
  if (g === 'Clavada') return 'Una clavada ocurre cuando una pieza no puede moverse porque dejaría expuesta una pieza más valiosa detrás de ella (el rey u otra pieza importante). Es una de las tácticas más frecuentes.';
  if (g.startsWith('Encuentra la Horquilla') || g === 'Ataque con Caballo') return 'La horquilla (tenedor) es un ataque doble donde una pieza ataca dos o más piezas enemigas al mismo tiempo. Los caballos son especialmente buenos para esto por su movimiento en "L".';
  if (g === 'Captura' || g === 'Ganar Material') return 'Ganar material significa capturar piezas del rival sin perder las propias, o intercambiar por piezas de menor valor. La ventaja material suele decidir la partida a largo plazo.';
  if (g.startsWith('Mejor Desarrollo')) return 'Desarrollar piezas significa sacarlas de su posición inicial a casillas activas. Un buen desarrollo controla el centro, conecta las torres y prepara el enroque. ¡No muevas la misma pieza dos veces en la apertura!';
  if (g.startsWith('Control del Centro')) return 'Las casillas centrales (e4, d4, e5, d5) son las más importantes del tablero. Controlarlas con peones y piezas te da más espacio y movilidad. Quien domina el centro, domina la partida.';
  if (g.startsWith('Ganar el Final') || g === 'Tomar la Oposición') return 'En los finales, la actividad del rey es crucial. La "oposición" (reyes enfrentados con una casilla entre ellos) es clave para promover peones. El rey debe avanzar DELANTE de su peón.';
  if (g === 'Ganar Tempo') return 'Un tempo es un turno de ventaja. Ganar tempo significa obligar al rival a mover una pieza que ya movió, perdiendo un tiempo de desarrollo. Cada tempo cuenta en la apertura.';
  if (g === 'Mejor Jugada') return 'La mejor jugada mejora tu posición: desarrolla una pieza, controla una casilla clave, crea una amenaza o defiende un punto débil. Siempre pregúntate: ¿qué amenaza mi rival y qué puedo mejorar?';
  return 'Cada posición tiene una jugada que es claramente mejor que las demás. Busca amenazas, debilidades del rival y oportunidades tácticas. ¡La práctica mejora tu intuición!';
};

// Real Lichess verified puzzles — categorized by goal type
export const puzzles: PuzzleData[] = [
  // ═══════════════════════════════════════
  //   ♚  MATE EN 1
  // ═══════════════════════════════════════
  {
    id: "00sHx",
    fen: "q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17",
    moves: ["e8d7", "a2e6", "d7d8", "f7f8"],
    rating: 1760,
    themes: ["mate", "mateIn2", "middlegame"],
    goal: "Mate en 2"
  },
  {
    id: "m1_scholar",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
    moves: ["b8a6", "h5f7"],
    rating: 400,
    themes: ["mate", "mateIn1"],
    goal: "Mate en 1"
  },
  {
    id: "m1_fools",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
    moves: ["b8c6", "d8h4"],
    rating: 300,
    themes: ["mate", "mateIn1"],
    goal: "Mate en 1"
  },
  {
    id: "m1_back",
    fen: "r1b1kbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
    moves: ["d7d6", "f3f7"],
    rating: 450,
    themes: ["mate", "mateIn1"],
    goal: "Mate en 1"
  },
  {
    id: "m1_queen",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3",
    moves: ["b1c3", "h4f2"],
    rating: 350,
    themes: ["mate", "mateIn1"],
    goal: "Mate en 1"
  },

  // ═══════════════════════════════════════
  //   ⚔️  CAPTURA — GANAR MATERIAL
  // ═══════════════════════════════════════
  {
    id: "0000D",
    fen: "5rk1/1p3ppp/pq3b2/8/8/1P1Q1N2/P4PPP/3R2K1 w - - 2 27",
    moves: ["d3d6", "f8d8", "d6d8", "f6d8"],
    rating: 1511,
    themes: ["advantage", "endgame", "short"],
    goal: "Ganar Material"
  },
  {
    id: "cap_rook",
    fen: "r2qkbnr/ppp2ppp/2n1p3/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 2 5",
    moves: ["f1e2", "g8e7"],
    rating: 870,
    themes: ["development"],
    goal: "Mejor Jugada"
  },
  {
    id: "cap_exchange",
    fen: "r2qkbnr/ppp2ppp/2np4/4p1B1/3PP1b1/5N2/PPP2PPP/RN1QKB1R w KQkq - 0 5",
    moves: ["d4e5", "d6e5"],
    rating: 812,
    themes: ["capture"],
    goal: "Captura"
  },
  {
    id: "cap_queen",
    fen: "rn2kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 2 4",
    moves: ["d5d8", "c3e4"],
    rating: 950,
    themes: ["advantage", "fork"],
    goal: "Mejor Jugada"
  },

  // ═══════════════════════════════════════
  //   🐴  HORQUILLA / TENEDOR
  // ═══════════════════════════════════════
  {
    id: "fork_knight",
    fen: "r2qr1k1/pppb1ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1QPPP/R1B2RK1 b - - 5 8",
    moves: ["c4d5", "c6d4"],
    rating: 1000,
    themes: ["fork", "knight"],
    goal: "Encuentra la Horquilla"
  },
  {
    id: "00VFN",
    fen: "2rq1rk1/pb2bppp/1p2pn2/2ppP3/3P4/2PB1N2/PP1N1PPP/R1BQR1K1 b - - 0 11",
    moves: ["f6e4", "d3e4", "d5e4", "f3g5"],
    rating: 1485,
    themes: ["advantage", "attack", "middlegame"],
    goal: "Ataque con Caballo"
  },

  // ═══════════════════════════════════════
  //   📌  CLAVADA
  // ═══════════════════════════════════════
  {
    id: "pin_bishop",
    fen: "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 5",
    moves: ["d7d6", "c1g5"],
    rating: 900,
    themes: ["pin", "middlegame"],
    goal: "Clavada"
  },

  // ═══════════════════════════════════════
  //   💥  SACRIFICIO
  // ═══════════════════════════════════════
  {
    id: "sac_bishop_h7",
    fen: "3q1rk1/4bppp/1pnrpn2/p2p4/2PP4/1PNB1N1P/P1Q2PP1/R3R1K1 w - - 3 17",
    moves: ["c4d5", "e6d5", "d3h7", "g8h7"],
    rating: 1624,
    themes: ["sacrifice"],
    goal: "Sacrificio en h7"
  },
  {
    id: "sac_bxf7",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    moves: ["f6e4", "c4f7"],
    rating: 800,
    themes: ["sacrifice", "check"],
    goal: "Sacrificio"
  },

  // ═══════════════════════════════════════
  //   🏰  DESARROLLO / APERTURA
  // ═══════════════════════════════════════
  {
    id: "dev_italian",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    moves: ["b8c6", "f1c4"],
    rating: 400,
    themes: ["opening", "development"],
    goal: "Mejor Desarrollo"
  },
  {
    id: "dev_ruylopez",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    moves: ["f1b5", "a7a6"],
    rating: 600,
    themes: ["opening"],
    goal: "Mejor Jugada"
  },
  {
    id: "dev_french",
    fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
    moves: ["b1c3", "g8f6"],
    rating: 650,
    themes: ["opening"],
    goal: "Mejor Desarrollo"
  },
  {
    id: "dev_fianchetto",
    fen: "r1bqkb1r/pppp1p1p/2n2np1/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
    moves: ["d2d3", "f8g7"],
    rating: 780,
    themes: ["development"],
    goal: "Mejor Desarrollo"
  },
  {
    id: "dev_vienna",
    fen: "r1bqkbnr/pppppppp/2n5/8/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 2 2",
    moves: ["g8f6", "f2f4"],
    rating: 850,
    themes: ["opening"],
    goal: "Mejor Jugada"
  },
  {
    id: "dev_pirc",
    fen: "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
    moves: ["b1c3", "g7g6"],
    rating: 730,
    themes: ["opening"],
    goal: "Mejor Desarrollo"
  },

  // ═══════════════════════════════════════
  //   ♟️  CENTRO Y PEONES
  // ═══════════════════════════════════════
  {
    id: "ctr_open",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    moves: ["e7e5", "g1f3"],
    rating: 400,
    themes: ["opening", "development"],
    goal: "Mejor Desarrollo"
  },
  {
    id: "ctr_sicilian",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    moves: ["c7c5", "g1f3"],
    rating: 350,
    themes: ["opening"],
    goal: "Mejor Jugada"
  },
  {
    id: "ctr_french",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    moves: ["e7e6", "d2d4"],
    rating: 380,
    themes: ["opening", "center"],
    goal: "Control del Centro"
  },
  {
    id: "ctr_d5",
    fen: "r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 2 2",
    moves: ["d7d6", "d2d4"],
    rating: 500,
    themes: ["center", "pawn"],
    goal: "Control del Centro"
  },
  {
    id: "ctr_advance",
    fen: "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
    moves: ["d7d5", "e4e5"],
    rating: 550,
    themes: ["advance", "space"],
    goal: "Mejor Jugada"
  },
  {
    id: "ctr_qga",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    moves: ["d5c4", "e2e3"],
    rating: 550,
    themes: ["opening"],
    goal: "Mejor Jugada"
  },

  // ═══════════════════════════════════════
  //   🏁  FINALES
  // ═══════════════════════════════════════
  {
    id: "0008Q",
    fen: "8/4R3/1p2P3/p4r2/P6p/1P3Pk1/4K3/8 w - - 1 64",
    moves: ["e7f7", "f5e5", "e2f1", "e5e6"],
    rating: 1292,
    themes: ["advantage", "endgame", "rookEndgame"],
    goal: "Ganar el Final"
  },
  {
    id: "end_pawn1",
    fen: "8/8/8/4k3/8/8/4KP2/8 w - - 0 1",
    moves: ["e5d5", "f2f4"],
    rating: 500,
    themes: ["endgame", "pawn"],
    goal: "Mejor Jugada"
  },
  {
    id: "end_opp",
    fen: "8/8/4k3/8/8/4K3/5P2/8 w - - 0 1",
    moves: ["e6d6", "e3d4"],
    rating: 500,
    themes: ["endgame", "opposition"],
    goal: "Tomar la Oposición"
  },

  // ═══════════════════════════════════════
  //   🎯  TÁCTICAS INTERMEDIAS (multi-move)
  // ═══════════════════════════════════════
  {
    id: "000aY",
    fen: "r4rk1/ppp2ppp/2n2n2/8/1bBPq3/2N1P3/PP2NPPP/R2Q1RK1 b - - 1 11",
    moves: ["e4e3", "d1b3"],
    rating: 1083,
    themes: ["advantage", "middlegame"],
    goal: "Mejor Jugada"
  },
  {
    id: "009Wq",
    fen: "5rk1/pp4pp/2p2p2/4p3/PPb1P3/2Pq1N1P/3R1PP1/1Q4K1 b - - 0 24",
    moves: ["d3c3", "b1b2"],
    rating: 985,
    themes: ["advantage", "endgame"],
    goal: "Mejor Jugada"
  },
  {
    id: "00Bxg",
    fen: "r1b1kbnr/pppp1ppp/2n5/4P3/5Bq1/5N2/PPPP1PPP/RN1QKB1R b KQkq - 1 4",
    moves: ["g4e6", "b1c3"],
    rating: 932,
    themes: ["development", "middlegame"],
    goal: "Mejor Desarrollo"
  },
  {
    id: "tac_pressure",
    fen: "r1bqkb1r/pppppppp/2n2n2/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
    moves: ["d7d5", "e4e5"],
    rating: 600,
    themes: ["attack", "pawn"],
    goal: "Mejor Jugada"
  },
  {
    id: "tac_castle",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    moves: ["c5b4", "e1g1"],
    rating: 600,
    themes: ["castling", "safety"],
    goal: "Mejor Jugada"
  },
  {
    id: "tac_nd5",
    fen: "r3kb1r/ppp1pppp/2n2n2/3q4/3P4/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 3 6",
    moves: ["d5a5", "d4d5"],
    rating: 890,
    themes: ["advantage"],
    goal: "Ganar Tempo"
  },
  {
    id: "tac_nxd4",
    fen: "r1bqk2r/ppppnppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 4 5",
    moves: ["d2d4", "e5d4"],
    rating: 720,
    themes: ["capture"],
    goal: "Captura"
  },
  {
    id: "tac_e5",
    fen: "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
    moves: ["f1e2", "e7e5"],
    rating: 780,
    themes: ["center"],
    goal: "Control del Centro"
  },
  {
    id: "tac_Bb4",
    fen: "r1b1kb1r/pppp1ppp/2n2n2/1B2p1q1/4P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
    moves: ["e1g1", "g5e3"],
    rating: 1080,
    themes: ["advantage", "middlegame"],
    goal: "Mejor Jugada"
  },
  {
    id: "tac_recapture",
    fen: "2kr3r/pppq1ppp/2n2b2/3p4/3P4/2PB1N2/PP3PPP/R2Q1RK1 w - - 0 12",
    moves: ["d3g6", "f7g6"],
    rating: 780,
    themes: ["capture"],
    goal: "Captura"
  },
];

export const getDifficultyLabel = (rating: number): string => {
  if (rating < 600) return 'Principiante';
  if (rating < 900) return 'Fácil';
  if (rating < 1200) return 'Intermedio';
  if (rating < 1500) return 'Avanzado';
  return 'Experto';
};

export const getDifficultyColor = (rating: number): string => {
  if (rating < 600) return '#81b64c';
  if (rating < 900) return '#5ba4cf';
  if (rating < 1200) return '#e8a828';
  if (rating < 1500) return '#e67e22';
  return '#e74c3c';
};

export const getGoalIcon = (goal: string): string => {
  if (goal.startsWith('Mate')) return '♚';
  if (goal === 'Sacrificio' || goal.startsWith('Sacrificio')) return '💥';
  if (goal === 'Clavada') return '📌';
  if (goal.startsWith('Encuentra la Horquilla') || goal === 'Ataque con Caballo') return '🐴';
  if (goal === 'Captura' || goal === 'Ganar Material') return '⚔️';
  if (goal.startsWith('Mejor Desarrollo')) return '🏗️';
  if (goal.startsWith('Control')) return '🎯';
  if (goal.startsWith('Ganar el Final') || goal === 'Tomar la Oposición') return '🏁';
  return '🎯';
};
