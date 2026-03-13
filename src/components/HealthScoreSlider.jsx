import React, { useState, useRef, useCallback, useEffect } from 'react';

// ── Segment configuration ────────────────────────────────────────
const SEGMENTS = [
  { min: 0,  max: 50,  label: 'High Alert',  color: '#B45A5A', dimColor: '#5C2E2E', icon: 'heartbeat'   },
  { min: 50, max: 65,  label: 'Constrained', color: '#C79A45', dimColor: '#6B5020', icon: 'restriction' },
  { min: 65, max: 75,  label: 'Stable',      color: '#F2D94E', dimColor: '#7A6C24', icon: 'heart'       },
  { min: 75, max: 85,  label: 'Strong',      color: '#8ED081', dimColor: '#3E6637', icon: 'shield'      },
  { min: 85, max: 100, label: 'Elite',       color: '#2FA36B', dimColor: '#165432', icon: 'crown'       },
];

// Total range
const TOTAL = 100;

// ── SVG Icons ────────────────────────────────────────────────────
const HeartbeatIcon = ({ size = 28, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const RestrictionIcon = ({ size = 28, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="9" width="20" height="12" rx="2" />
    <path d="M8 9V6a4 4 0 0 1 8 0v3" />
    <line x1="12" y1="14" x2="12" y2="16" />
  </svg>
);

const HeartIcon = ({ size = 28, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShieldHeartIcon = ({ size = 28, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9.5 10a2.5 2.5 0 0 1 5 0c0 2-2.5 4-5 5.5C7 14 4.5 12 4.5 10a2.5 2.5 0 0 1 5 0z"
      transform="translate(2.5 0.5)" />
  </svg>
);

const CrownHeartIcon = ({ size = 28, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 19h20" />
    <path d="M2 7l4 5 6-7 6 7 4-5v12H2z" />
    <path d="M9 15c0-1.7 1.3-3 3-3s3 1.3 3 3" />
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.88)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ICON_MAP = {
  heartbeat:   HeartbeatIcon,
  restriction: RestrictionIcon,
  heart:       HeartIcon,
  shield:      ShieldHeartIcon,
  crown:       CrownHeartIcon,
};

// ── Helpers ──────────────────────────────────────────────────────
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/** Returns which segment "owns" this score. Uses [min, max) except last seg. */
const getSegment = (score) => {
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    if (score >= SEGMENTS[i].min && score < SEGMENTS[i].max) return SEGMENTS[i];
  }
  return SEGMENTS[SEGMENTS.length - 1]; // 100 belongs to Elite
};

// ── Component ────────────────────────────────────────────────────
const HealthScoreSlider = ({ score: initScore = 65, minAllowedScore = 65, onChange }) => {
  const [score, setScore] = useState(clamp(initScore, minAllowedScore, 100));
  const trackRef  = useRef(null);
  const dragging  = useRef(false);

  const activeSeg = getSegment(score);

  // Convert clientX → score, mapping across the usable track area
  const clientXToScore = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return score;
    const pct  = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(pct * TOTAL);
  }, [score]);

  const commit = useCallback((clientX) => {
    const raw = clientXToScore(clientX);
    const next = clamp(raw, minAllowedScore, 100);
    setScore(next);
    onChange?.(next);
  }, [clientXToScore, minAllowedScore, onChange]);

  // Mouse / touch events
  useEffect(() => {
    const onMove = (e) => { if (dragging.current) commit(e.clientX); };
    const onTouchMove = (e) => { if (dragging.current) commit(e.touches[0].clientX); };
    const onUp = () => { dragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend',  onUp);
    };
  }, [commit]);

  // Keyboard control
  const onKeyDown = (e) => {
    const delta = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, Home: -100, End: 100 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = clamp(score + delta, minAllowedScore, 100);
    setScore(next);
    onChange?.(next);
  };

  const markerPct = score / TOTAL; // 0–1

  return (
    <div style={S.wrapper}>
      {/* ── Header row ── */}
      <div style={S.header}>
        <span style={S.labelSmall}>Health Score</span>
        <span style={{ ...S.labelLarge, color: activeSeg.color }}>
          {score} &nbsp;·&nbsp; {activeSeg.label}
        </span>
      </div>

      {/* ── Track + Marker ── */}
      <div
        style={S.outerWrap}
        onClick={(e) => commit(e.clientX)}
      >
        {/* Colored pill track */}
        <div ref={trackRef} style={S.track}>
          {SEGMENTS.map((seg) => {
            const segW  = seg.max - seg.min;
            const pctW  = (segW / TOTAL) * 100;
            const isDimmed  = score >= seg.max;          // fully behind marker
            const isPartial = score > seg.min && score < seg.max; // straddles marker
            const isAhead   = score <= seg.min;          // fully ahead of marker

            let bg;
            if (isDimmed) {
              bg = seg.dimColor;
            } else if (isPartial) {
              const splitPct = ((score - seg.min) / segW) * 100;
              bg = `linear-gradient(90deg, ${seg.dimColor} ${splitPct}%, ${seg.color} ${splitPct}%)`;
            } else {
              bg = seg.color;
            }

            const IconComp   = ICON_MAP[seg.icon];
            const iconColor  = isDimmed
              ? 'rgba(0,0,0,0.28)'
              : isAhead
                ? 'rgba(0,0,0,0.42)'
                : 'rgba(0,0,0,0.38)';

            return (
              <div key={seg.label} style={{ ...S.segment, width: `${pctW}%`, background: bg }}>
                <IconComp size={28} color={iconColor} />
              </div>
            );
          })}
        </div>

        {/* Floating marker */}
        <div
          onMouseDown={(e) => { e.preventDefault(); dragging.current = true; }}
          onTouchStart={() => { dragging.current = true; }}
          role="slider"
          aria-valuemin={minAllowedScore}
          aria-valuemax={100}
          aria-valuenow={score}
          aria-label="Health score"
          tabIndex={0}
          onKeyDown={onKeyDown}
          style={{
            ...S.marker,
            left: `calc(${markerPct * 100}% - 45px)`,
            boxShadow: [
              '0 0 0 5px rgba(255,255,255,0.07)',
              '0 0 0 10px rgba(255,255,255,0.03)',
              `0 0 32px 6px ${activeSeg.color}50`,
              '0 8px 28px rgba(0,0,0,0.6)',
            ].join(', '),
          }}
        >
          {/* Outer glow bloom */}
          <div style={{ ...S.markerGlow, background: `radial-gradient(circle, ${activeSeg.color}2a 0%, transparent 68%)` }} />
          {/* Inner dark circle */}
          <div style={S.markerInner}>
            <LockIcon />
          </div>
        </div>
      </div>

      {/* ── Segment labels ── */}
      <div style={S.labels}>
        {SEGMENTS.map((seg) => {
          const isActive = activeSeg.label === seg.label;
          return (
            <div
              key={seg.label}
              style={{
                ...S.segLabel,
                width: `${(seg.max - seg.min) / TOTAL * 100}%`,
                color:      isActive ? seg.color           : 'rgba(255,255,255,0.20)',
                fontWeight: isActive ? 700                  : 400,
                transition: 'color 0.35s ease, font-weight 0.2s ease',
              }}
            >
              {seg.label}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes hss-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

// ── Style objects ─────────────────────────────────────────────────
const S = {
  wrapper: {
    width: '100%',
    padding: '22px 28px 18px',
    background: 'linear-gradient(135deg, rgba(24,24,32,0.98) 0%, rgba(16,16,22,0.98) 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 24px 64px rgba(0,0,0,0.55)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  labelSmall: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.30)',
    fontFamily: 'var(--font-mono, monospace)',
  },
  labelLarge: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-mono, monospace)',
    transition: 'color 0.35s ease',
  },
  outerWrap: {
    position: 'relative',
    height: '80px',
    // Extra vertical room for the 90px marker to overflow without layout shift
    marginTop: '5px',
    marginBottom: '5px',
    cursor: 'pointer',
  },
  track: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: 'translateY(-50%)',
    height: '80px',
    display: 'flex',
    borderRadius: '60px',
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.25s ease',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'rgba(8,8,14,0.96)',
    border: '2px solid rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    zIndex: 10,
    transition: 'left 0.04s linear, box-shadow 0.4s ease',
    willChange: 'left',
    outline: 'none',
  },
  markerGlow: {
    position: 'absolute',
    inset: '-24px',
    borderRadius: '50%',
    pointerEvents: 'none',
    transition: 'background 0.4s ease',
    zIndex: 0,
  },
  markerInner: {
    position: 'relative',
    zIndex: 1,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, rgba(22,22,32,0.98) 0%, rgba(12,12,18,0.98) 100%)',
    border: '1px solid rgba(255,255,255,0.09)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.7)',
  },
  labels: {
    display: 'flex',
    marginTop: '10px',
  },
  segLabel: {
    fontSize: '8px',
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'var(--font-mono, monospace)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingTop: '2px',
  },
};

export default HealthScoreSlider;
