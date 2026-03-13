import React, { useState, useRef, useCallback, useEffect } from 'react';

// ── Global segment palette (full 0–100 range) ────────────────────
const SEGMENTS = [
  { min: 0,  max: 50,  label: 'High Alert',  color: '#B45A5A', dimColor: '#5C2E2E', icon: 'heartbeat'   },
  { min: 50, max: 65,  label: 'Constrained', color: '#C79A45', dimColor: '#6B5020', icon: 'restriction' },
  { min: 65, max: 75,  label: 'Stable',      color: '#F2D94E', dimColor: '#7A6C24', icon: 'heart'       },
  { min: 75, max: 85,  label: 'Strong',      color: '#8ED081', dimColor: '#3E6637', icon: 'shield'      },
  { min: 85, max: 100, label: 'Elite',       color: '#2FA36B', dimColor: '#165432', icon: 'crown'       },
];

// ── SVG Icon library ─────────────────────────────────────────────
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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ICON_MAP = {
  heartbeat: HeartbeatIcon, restriction: RestrictionIcon, heart: HeartIcon,
  shield: ShieldHeartIcon,  crown: CrownHeartIcon,
};

// ── Helpers ──────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** Returns the segment that "owns" the score within [min, max]. */
const getSegment = (score, min, max) => {
  // Clip score to range first
  const s = clamp(score, min, max);
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    if (s >= SEGMENTS[i].min && s < SEGMENTS[i].max) return SEGMENTS[i];
  }
  return SEGMENTS[SEGMENTS.length - 1];
};

/**
 * Compute the slice of each global segment that falls within [min, max].
 * Returns an array of { ...seg, visMin, visMax, widthPct }.
 */
const buildVisibleSegments = (min, max) => {
  const span = max - min;
  return SEGMENTS
    .map(seg => {
      const visMin = Math.max(seg.min, min);
      const visMax = Math.min(seg.max, max);
      if (visMin >= visMax) return null;
      return { ...seg, visMin, visMax, widthPct: ((visMax - visMin) / span) * 100 };
    })
    .filter(Boolean);
};

// ── Component ────────────────────────────────────────────────────
/**
 * HealthScoreSlider
 *
 * @prop {number}   score            Controlled current value
 * @prop {number}   min              Track minimum  (default 0)
 * @prop {number}   max              Track maximum  (default 100)
 * @prop {Function} onChange         (score: number) => void
 * @prop {number}   [minAllowedScore]  Leftward drag boundary (forward-only)
 * @prop {number}   [maxRecommended]   When score exceeds this, renders amber "I want to reach" badge
 * @prop {number[]} [ticks]           Tick mark values rendered below the track
 */
const HealthScoreSlider = ({
  score: scoreProp = 65,
  min = 0,
  max = 100,
  onChange,
  minAllowedScore,
  maxRecommended,
  ticks = [],
}) => {
  const floorVal = minAllowedScore != null ? clamp(minAllowedScore, min, max) : min;
  const [score, setScore] = useState(clamp(scoreProp, floorVal, max));
  const trackRef = useRef(null);
  const dragging = useRef(false);

  // Keep in sync when controlled value changes from outside
  useEffect(() => {
    setScore(clamp(scoreProp, floorVal, max));
  }, [scoreProp, floorVal, max]);

  const activeSeg = getSegment(score, min, max);
  const visSegs   = buildVisibleSegments(min, max);
  const span      = max - min;

  // Marker left % within the track
  const markerPct = ((score - min) / span) * 100;

  // Convert raw clientX → integer score value
  const clientXToScore = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return score;
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(pct * span + min);
  }, [min, span, score]);

  const commit = useCallback((clientX) => {
    const raw  = clientXToScore(clientX);
    const next = clamp(raw, floorVal, max);
    setScore(next);
    onChange?.(next);
  }, [clientXToScore, floorVal, max, onChange]);

  // Global mouse + touch listeners
  useEffect(() => {
    const onMove      = (e) => { if (dragging.current) commit(e.clientX); };
    const onTouchMove = (e) => { if (dragging.current) commit(e.touches[0].clientX); };
    const onUp        = () => { dragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [commit]);

  // Keyboard navigation
  const onKeyDown = (e) => {
    const delta = {
      ArrowRight: 1, ArrowUp: 1,
      ArrowLeft: -1, ArrowDown: -1,
      Home: -(span), End: span,
    }[e.key];
    if (delta == null) return;
    e.preventDefault();
    const next = clamp(score + delta, floorVal, max);
    setScore(next);
    onChange?.(next);
  };

  // ── Dimming logic per visible segment ─────────────────────────
  const getSegBg = (seg) => {
    if (score <= seg.visMin) return seg.color;         // fully ahead  → lit
    if (score >= seg.visMax) return seg.dimColor;      // fully behind → dim

    // Marker straddles this segment → gradient split
    const splitPct = ((score - seg.visMin) / (seg.visMax - seg.visMin)) * 100;
    return `linear-gradient(90deg, ${seg.dimColor} ${splitPct}%, ${seg.color} ${splitPct}%)`;
  };

  const iconColorFor = (seg) =>
    score >= seg.visMax ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.44)';

  // ── "I want to reach" helper message ──────────────────────────
  const showGoalMessage = maxRecommended != null && score > maxRecommended;

  // ── Glow color follows active segment ─────────────────────────
  const glowColor = activeSeg.color;

  return (
    <div style={S.root}>

      {/* ── Track + Marker ── */}
      <div style={S.outerWrap} onClick={(e) => commit(e.clientX)}>

        {/* Colored pill track */}
        <div ref={trackRef} style={S.track}>
          {visSegs.map((seg) => {
            const IconComp = ICON_MAP[seg.icon];
            return (
              <div
                key={seg.label}
                style={{
                  ...S.segment,
                  width: `${seg.widthPct}%`,
                  background: getSegBg(seg),
                }}
              >
                <IconComp size={17} color={iconColorFor(seg)} />
              </div>
            );
          })}
        </div>

        {/* Draggable marker */}
        <div
          role="slider"
          aria-valuemin={floorVal}
          aria-valuemax={max}
          aria-valuenow={score}
          aria-label={`Health score: ${score}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseDown={(e) => { e.preventDefault(); dragging.current = true; }}
          onTouchStart={() => { dragging.current = true; }}
          style={{
            ...S.marker,
            left: `calc(${markerPct}% - 27px)`,
            boxShadow: [
              '0 0 0 5px rgba(255,255,255,0.06)',
              '0 0 0 10px rgba(255,255,255,0.025)',
              `0 0 30px 8px ${glowColor}44`,
              '0 6px 28px rgba(0,0,0,0.65)',
            ].join(', '),
          }}
        >
          <div style={{ ...S.markerGlow, background: `radial-gradient(circle, ${glowColor}20 0%, transparent 68%)` }} />
          <div style={S.markerInner}><LockIcon /></div>
        </div>
      </div>

      {/* ── Tick marks + segment labels row ── */}
      <div style={S.tickRow}>
        {ticks.length > 0 ? (
          /* Explicit ticks from parent */
          ticks.map(v => {
            const pct = ((v - min) / span) * 100;
            const isCurrent = v === score;
            const isPast    = v < score;
            const isBeyond  = maxRecommended != null && v > maxRecommended;
            return (
              <span
                key={v}
                onClick={(e) => { e.stopPropagation(); const next = clamp(v, floorVal, max); setScore(next); onChange?.(next); }}
                style={{
                  position: 'absolute',
                  left: `${pct}%`,
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '9px',
                  fontWeight: isCurrent ? 700 : 400,
                  color: isCurrent
                    ? glowColor
                    : isBeyond
                      ? 'rgba(228,228,231,0.18)'
                      : isPast
                        ? 'rgba(228,228,231,0.22)'
                        : 'rgba(228,228,231,0.40)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {v}
              </span>
            );
          })
        ) : (
          /* Auto segment labels */
          visSegs.map((seg) => {
            const isActive = activeSeg.label === seg.label;
            return (
              <div
                key={seg.label}
                style={{
                  width: `${seg.widthPct}%`,
                  textAlign: 'center',
                  fontSize: '8px',
                  letterSpacing: '0.11em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: isActive ? seg.color : 'rgba(255,255,255,0.20)',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'color 0.3s',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {seg.label}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes hss-fadein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

// ── Styles ───────────────────────────────────────────────────────
const S = {
  root: {
    width: '100%',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  headerLabel: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.28)',
    fontFamily: 'var(--font-mono, monospace)',
  },
  goalBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '100px',
    fontSize: '10px',
    fontWeight: 500,
    fontFamily: 'var(--font-mono, monospace)',
    color: 'rgba(255,197,61,0.85)',
    background: 'rgba(255,197,61,0.10)',
    border: '1px solid rgba(255,197,61,0.25)',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },
  activeLabel: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-mono, monospace)',
    transition: 'color 0.35s ease',
  },
  outerWrap: {
    position: 'relative',
    height: '48px',       // 80 × 0.6
    marginTop: '2px',     // 4 × 0.6
    marginBottom: '2px',  // 4 × 0.6
    cursor: 'pointer',
  },
  track: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: 'translateY(-50%)',
    height: '48px',       // 80 × 0.6
    display: 'flex',
    borderRadius: '36px', // 60 × 0.6
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.22s ease',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '54px',        // 90 × 0.6
    height: '54px',       // 90 × 0.6
    borderRadius: '50%',
    background: 'rgba(8,8,14,0.96)',
    border: '2px solid rgba(255,255,255,0.13)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    zIndex: 10,
    transition: 'left 0.04s linear, box-shadow 0.38s ease',
    willChange: 'left',
    outline: 'none',
  },
  markerGlow: {
    position: 'absolute',
    inset: '-13px',       // 22 × 0.6
    borderRadius: '50%',
    pointerEvents: 'none',
    transition: 'background 0.38s ease',
    zIndex: 0,
  },
  markerInner: {
    position: 'relative',
    zIndex: 1,
    width: '36px',        // 60 × 0.6
    height: '36px',       // 60 × 0.6
    borderRadius: '50%',
    background: 'linear-gradient(145deg, rgba(20,20,30,0.98) 0%, rgba(10,10,18,0.98) 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 1px 6px rgba(0,0,0,0.7)', // 10 × 0.6
  },
  tickRow: {
    position: 'relative',
    display: 'flex',
    height: '11px',       // 18 × 0.6
    marginTop: '5px',     // 8 × 0.6
  },
};

export default HealthScoreSlider;
