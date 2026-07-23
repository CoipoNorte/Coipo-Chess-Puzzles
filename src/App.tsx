import React, { useEffect, useRef, useState } from 'react';
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
  const { loadPuzzle, currentPuzzle, status } = usePuzzleStore();
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const middleRef = useRef<HTMLDivElement>(null);
  const [boardArea, setBoardArea] = useState<{ w: number; h: number }>({ w: 300, h: 300 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (!currentPuzzle) loadPuzzle();
    }, 1600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure the middle area precisely
  useEffect(() => {
    const update = () => {
      if (middleRef.current) {
        setBoardArea({ w: middleRef.current.clientWidth, h: middleRef.current.clientHeight });
      }
    };
    update();
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    if (middleRef.current) ro.observe(middleRef.current);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [showSplash]);

  if (showSplash) return <SplashScreen />;

  const showExtra = status === 'completed';

  return (
    <div style={{
      height: '100dvh', width: '100vw',
      backgroundColor: '#1b1a18',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* TOP */}
      <div style={{ flexShrink: 0 }}>
        <NavBar onOpenStats={() => setShowStats(true)} onOpenSettings={() => setShowSettings(true)} />
        <PuzzleHeader />
      </div>

      {/* MIDDLE — board area, flex: 1 fills all remaining space */}
      <div ref={middleRef} style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <PlayerBar position="top" />
        <ChessBoard areaWidth={boardArea.w} areaHeight={boardArea.h} />
        <PlayerBar position="bottom" />
      </div>

      {/* BOTTOM */}
      <div style={{
        flexShrink: 0,
        maxHeight: showExtra ? '38%' : undefined,
        overflowY: showExtra ? 'auto' : undefined,
        paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      }}>
        <div style={{ height: 6 }} />
        <PuzzleStatusBar />
        <div style={{ height: 8 }} />
        <ActionButtons />
        <div style={{ height: 6 }} />
        <MoveHistory />
        {showExtra && (
          <>
            <div style={{ height: 8 }} />
            <Explanation />
            <div style={{ height: 12 }} />
          </>
        )}
      </div>

      <StatsPanel isOpen={showStats} onClose={() => setShowStats(false)} />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

const SplashScreen: React.FC = () => (
  <div style={{
    height: '100dvh', width: '100vw', backgroundColor: '#1b1a18',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      width: 80, height: 80, backgroundColor: '#81b64c', borderRadius: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 20, boxShadow: '0 6px 24px rgba(129,182,76,0.4)',
    }}>
      <svg width="44" height="44" viewBox="0 0 45 45">
        <g fill="none" fillRule="evenodd" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/>
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/>
          <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#333" stroke="#333"/>
        </g>
      </svg>
    </div>
    <p style={{ fontSize: 22, fontWeight: 800, color: '#f0ede8', marginBottom: 2 }}>Coipo Chess</p>
    <p style={{ fontSize: 13, color: '#7d7a75' }}>Puzzles</p>
  </div>
);

export default App;
