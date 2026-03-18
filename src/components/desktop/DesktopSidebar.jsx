import React from 'react';

const NAV_ITEMS = [
  { icon: '◎', label: 'Dashboard',     id: 'dashboard' },
  { icon: '↑', label: 'Improve Score', id: 'improve' },
  { icon: '⊞', label: 'All Markers',   id: 'markers' },
  { icon: '⊙', label: 'Simulator',     id: 'simulator' },
  { icon: '↓', label: 'My Report',     id: 'report' },
  { icon: '◷', label: 'History',       id: 'history' },
  { icon: '◌', label: 'Consult',       id: 'consult' },
];

const styles = {
  sidebar: {
    background: 'rgb(var(--zinc-950))',
    padding: '40px 28px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
    overflow: 'hidden',
  },
  logo: {
    fontFamily: 'var(--font-heading)',
    fontSize: '15px',
    color: 'rgb(var(--zinc-100))',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  logoSub: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'rgba(var(--zinc-100), 0.35)',
    letterSpacing: '0.2em',
    marginTop: '4px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 16px',
    borderRadius: '8px',
    color: active ? 'rgb(var(--zinc-100))' : 'rgba(var(--zinc-100), 0.45)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
    textDecoration: 'none',
    fontFamily: 'var(--font-main)',
  }),
  navIcon: (active) => ({
    width: '18px',
    textAlign: 'center',
    fontSize: '15px',
    color: active ? 'rgb(var(--amber-9))' : 'inherit',
  }),
  userSection: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingTop: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgb(var(--red-9)), rgb(var(--amber-9)))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 600,
    color: 'white',
    flexShrink: 0,
  },
  userName: {
    fontSize: '13px',
    color: 'rgb(var(--zinc-100))',
    fontWeight: 500,
    fontFamily: 'var(--font-main)',
  },
  userDate: {
    fontSize: '11px',
    color: 'rgba(var(--zinc-100), 0.35)',
    fontFamily: 'var(--font-mono)',
    marginTop: '1px',
  },
};

const DesktopSidebar = ({ activeNav = 'dashboard', onNavigate, onSwitchView }) => {
  const [switchHovered, setSwitchHovered] = React.useState(false);

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        Baseline
        <span style={styles.logoSub}>by Smitch Health</span>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(item => {
          const active = item.id === activeNav;
          return (
            <a
              key={item.id}
              style={styles.navItem(active)}
              onClick={() => onNavigate?.(item.id)}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={styles.navIcon(active)}>{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Switch View */}
      <button
        onClick={onSwitchView}
        onMouseEnter={() => setSwitchHovered(true)}
        onMouseLeave={() => setSwitchHovered(false)}
        title="Go back to view selector"
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '10px',
          width:          '100%',
          padding:        '10px 14px',
          borderRadius:   '8px',
          background:     switchHovered ? 'rgba(255,255,255,0.06)' : 'transparent',
          border:         '1px solid rgba(255,255,255,0.08)',
          color:          switchHovered ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.30)',
          fontSize:       '12px',
          fontFamily:     'var(--font-main)',
          fontWeight:     500,
          cursor:         'pointer',
          letterSpacing:  '0.01em',
          transition:     'background 0.2s ease, color 0.2s ease',
          outline:        'none',
        }}
      >
        {/* Phone icon */}
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <rect x="5" y="2" width="14" height="20" rx="2.5" />
          <line x1="9.5" y1="18.5" x2="14.5" y2="18.5" />
        </svg>
        Switch View
      </button>

      {/* User */}
      <div style={styles.userSection}>
        <div style={styles.avatar}>AR</div>
        <div>
          <div style={styles.userName}>Arjun R.</div>
          <div style={styles.userDate}>Tested Feb 14, 2026</div>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
