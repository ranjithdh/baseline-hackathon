import React from 'react';
import { motion } from 'framer-motion';
import ViewOptionCard from './ViewOptionCard';

// ─────────────────────────────────────────────────────────────────────────────
// ViewSelectorScreen
//
// Full-screen launch selector shown on first load (when no IS_DESKTOP value is
// present in localStorage). The user picks Mobile or Desktop and the choice is
// persisted so future visits skip this screen entirely.
//
// Props
//   onSelect  {function(isDesktop: boolean)}
//             Called with true (Desktop) or false (Mobile) after the user picks.
//             The parent is responsible for persisting the value to localStorage.
// ─────────────────────────────────────────────────────────────────────────────

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const MobileIcon = ({ active }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? 'rgb(43,127,255)' : 'rgba(255,255,255,0.65)'}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Phone body */}
    <rect x="5" y="2" width="14" height="20" rx="2.5" />
    {/* Home indicator */}
    <line x1="9.5" y1="18.5" x2="14.5" y2="18.5" />
  </svg>
);

const DesktopIcon = ({ active }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? 'rgb(43,127,255)' : 'rgba(255,255,255,0.65)'}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Monitor body */}
    <rect x="2" y="3" width="20" height="13" rx="2" />
    {/* Stand */}
    <line x1="12" y1="16" x2="12" y2="20" />
    {/* Base */}
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────

const ViewSelectorScreen = ({ onSelect }) => {
  const [hoveredCard, setHoveredCard] = React.useState(null); // 'mobile' | 'desktop' | null

  const handleSelect = (isDesktop) => {
    localStorage.setItem('IS_DESKTOP', String(isDesktop));
    onSelect(isDesktop);
  };

  // Framer-motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      minHeight:      '100vh',
      background:     'var(--bg-color)',
      padding:        '24px',
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '48px',
          width:         '100%',
          maxWidth:      '560px',
        }}
      >
        {/* ── Header ── */}
        <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
          {/* Wordmark / eyebrow */}
          <div style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'rgba(228,228,231,0.30)',
            marginBottom:  '20px',
          }}>
            Baseline · Health Dashboard
          </div>

          {/* Main heading */}
          <div style={{
            fontFamily:   'var(--font-heading)',
            fontSize:     'clamp(26px, 5vw, 36px)',
            fontWeight:   700,
            color:        'rgb(var(--foreground))',
            lineHeight:   1.15,
            marginBottom: '12px',
          }}>
            Choose your view
          </div>

          {/* Subheading */}
          <div style={{
            fontFamily: 'var(--font-main)',
            fontSize:   '14px',
            color:      'rgba(228,228,231,0.40)',
            lineHeight: 1.6,
          }}>
            Select how you'd like to experience the dashboard.
            <br />
            Your preference is saved for next time.
          </div>
        </motion.div>

        {/* ── Option cards ── */}
        <motion.div
          variants={itemVariants}
          style={{
            display:        'flex',
            justifyContent: 'center',
            alignItems:     'center',
            gap:            '24px',
            flexWrap:       'wrap',
          }}
        >
          <ViewOptionCard
            icon={<MobileIcon active={hoveredCard === 'mobile'} />}
            label="Mobile View"
            description="Touch-optimised layout"
            onMouseEnter={() => setHoveredCard('mobile')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleSelect(false)}
          />

          <ViewOptionCard
            icon={<DesktopIcon active={hoveredCard === 'desktop'} />}
            label="Desktop View"
            description="Full-width dashboard"
            onMouseEnter={() => setHoveredCard('desktop')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleSelect(true)}
          />
        </motion.div>

        {/* ── Footer hint ── */}
        <motion.div
          variants={itemVariants}
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '11px',
            color:         'rgba(228,228,231,0.20)',
            letterSpacing: '0.05em',
            textAlign:     'center',
          }}
        >
          You can reset your preference by clearing site data
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ViewSelectorScreen;
