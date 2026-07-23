import React, { useState } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem('chess-sound') !== 'false'; } catch { return true; }
  });

  const toggleSound = () => {
    const v = !soundEnabled;
    setSoundEnabled(v);
    try { localStorage.setItem('chess-sound', String(v)); } catch { /* empty */ }
  };

  if (!isOpen) return null;

  return (
    <div
      className="panel-overlay"
      onClick={onClose}
    >
      <div className="animate-fade-in" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)' }} />

      <div
        className="animate-slide-up bottom-sheet panel-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="panel-handle" style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        </div>

        <div className="panel-content">
          <p className="font-title" style={{ fontWeight: 800, color: '#f0ede8', marginBottom: 20 }}>⚙️ Configuración</p>

          {/* Sound Toggle */}
          <button onClick={toggleSound} style={{
            width: '100%',
            backgroundColor: '#2f2d2a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: 18,
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: 16,
          }}>
            <div style={{ textAlign: 'left' }}>
              <p className="font-heading" style={{ fontWeight: 700, color: '#f0ede8' }}>🔊 Sonido</p>
              <p className="font-small" style={{ color: '#7d7a75', marginTop: 4 }}>Efectos al mover piezas</p>
            </div>
            <div style={{
              width: 52, height: 30, borderRadius: 15,
              backgroundColor: soundEnabled ? '#81b64c' : '#3d3b37',
              padding: 3,
              transition: 'background-color 0.2s',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transform: soundEnabled ? 'translateX(22px)' : 'translateX(0)',
                transition: 'transform 0.2s',
              }} />
            </div>
          </button>

          {/* About */}
          <div className="card" style={{ marginBottom: 20 }}>
            <p className="font-subtitle" style={{ fontWeight: 700, color: '#f0ede8', marginBottom: 8 }}>Acerca de</p>
            <p className="font-small" style={{ color: '#7d7a75', lineHeight: 1.6 }}>
              Chess Puzzles es un entrenador de tácticas de ajedrez. Cada puzzle indica
              qué tipo de jugada debes encontrar: mate, captura, clavada, horquilla,
              sacrificio, desarrollo, y más. Diseñado para una futura migración a React Native con Expo.
            </p>
          </div>

          {/* Close */}
          <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
            <span className="font-heading" style={{ color: '#fff', fontWeight: 700 }}>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
