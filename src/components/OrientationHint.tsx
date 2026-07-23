import React, { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'chess-orientation-hint-dismissed';
const SHOW_DELAY_MS = 3000;
const AUTO_HIDE_MS = 6000;

const OrientationHint: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Helper to track timers for cleanup
  const track = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    timersRef.current = [];

    // Don't show if previously dismissed
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch { /* empty */ }

    // Only show on narrow portrait screens (phones)
    const mq = window.matchMedia('(max-width: 767px) and (orientation: portrait)');
    if (!mq.matches) return;

    track(() => {
      setVisible(true);
      // Fade in on next frame
      requestAnimationFrame(() => setOpacity(1));

      // Auto-hide after a delay
      track(() => {
        setOpacity(0);
        track(() => setVisible(false), 400);
      }, AUTO_HIDE_MS);
    }, SHOW_DELAY_MS);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const dismiss = () => {
    setOpacity(0);
    setTimeout(() => setVisible(false), 400);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* empty */ }
  };

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        opacity,
        transition: 'opacity 0.4s ease',
        pointerEvents: opacity > 0 ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '10px 16px',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Rotating phone icon */}
      <svg
        width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="#81b64c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: 'rotateHint 2s ease-in-out infinite' }}
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
      <span style={{
        fontSize: 11, fontWeight: 600, color: '#b5b1ab',
        textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap',
      }}>
        Rota para mejor experiencia
      </span>
    </div>
  );
};

export default OrientationHint;
