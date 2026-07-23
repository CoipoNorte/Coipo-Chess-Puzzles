import React from 'react';


interface NavBarProps {
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onOpenStats, onOpenSettings }) => {
  return (
    <div className="page-padding" style={{ paddingBottom: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{
            width: 44, height: 44,
            backgroundColor: '#81b64c',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: 12,
            boxShadow: '0 4px 12px rgba(129,182,76,0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 45 45">
              <g fill="none" fillRule="evenodd" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/>
                <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/>
                <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#333"/>
              </g>
            </svg>
          </div>
          <div>
            <p className="font-nav" style={{ fontWeight: 800, color: '#f0ede8', lineHeight: 1.1 }}>Puzzles</p>
            <p className="font-caption" style={{ fontWeight: 600, color: '#7d7a75', letterSpacing: 1.5 }}>COIPO CHESS</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="gap-md" style={{ display: 'flex', flexDirection: 'row' }}>
          <button onClick={onOpenStats} className="btn-secondary" style={{ padding: 10, borderRadius: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5b1ab" strokeWidth="2">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
          </button>
          <button onClick={onOpenSettings} className="btn-secondary" style={{ padding: 10, borderRadius: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5b1ab" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
