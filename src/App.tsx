import React, { useEffect, useState } from 'react';
import { usePuzzleStore } from './store/puzzleStore';
import NavBar from './components/NavBar';
import PuzzleHeader from './components/PuzzleHeader';
import ChessBoard from './components/ChessBoard';
import PuzzleStatusBar from './components/PuzzleStatus';
import ActionButtons from './components/ActionButtons';
import MoveHistory from './components/MoveHistory';
import Explanation from './components/Explanation';
import PlayerBar from './components/PlayerBar';
import StatsPanel from './components/StatsPanel';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const { loadPuzzle, currentPuzzle } = usePuzzleStore();
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (!currentPuzzle) loadPuzzle();
    }, 1600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div style={{
      height: '100%', width: '100%',
      backgroundColor: '#1b1a18',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Nav — fixed top feel */}
        <div style={{ marginBottom: 4 }}>
          <NavBar onOpenStats={() => setShowStats(true)} onOpenSettings={() => setShowSettings(true)} />
        </div>

        {/* Goal card + rating info */}
        <div style={{ marginBottom: 10 }}>
          <PuzzleHeader />
        </div>

        {/* Opponent */}
        <PlayerBar position="top" />

        {/* Board */}
        <div style={{ marginTop: 4, marginBottom: 4 }}>
          <ChessBoard />
        </div>

        {/* Player */}
        <PlayerBar position="bottom" />

        {/* Gap before bottom controls */}
        <div style={{ height: 14 }} />

        {/* Status card */}
        <div style={{ marginBottom: 12 }}>
          <PuzzleStatusBar />
        </div>

        {/* Action buttons */}
        <div style={{ marginBottom: 12 }}>
          <ActionButtons />
        </div>

        {/* Move history */}
        <div style={{ marginBottom: 12 }}>
          <MoveHistory />
        </div>

        {/* Explanation after solving */}
        <div style={{ marginBottom: 28 }}>
          <Explanation />
        </div>
      </div>

      {/* Modals */}
      <StatsPanel isOpen={showStats} onClose={() => setShowStats(false)} />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

const SplashScreen: React.FC = () => (
  <div style={{
    height: '100%', width: '100%', backgroundColor: '#1b1a18',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      width: 100, height: 100, backgroundColor: '#81b64c', borderRadius: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 24, boxShadow: '0 8px 32px rgba(129,182,76,0.4)',
    }}>
      <svg width="56" height="56" viewBox="0 0 45 45">
        <g fill="none" fillRule="evenodd" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/>
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/>
          <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#333" stroke="#333"/>
        </g>
      </svg>
    </div>
    <p style={{ fontSize: 26, fontWeight: 800, color: '#f0ede8', marginBottom: 2 }}>Coipo Chess</p>
    <p style={{ fontSize: 14, color: '#7d7a75' }}>Puzzles — Entrena tu visión táctica</p>
  </div>
);

export default App;
