import React, { useState, useRef, useCallback, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// UI CONFIGURATION
// Change any value here to scale every visual aspect of the slider uniformly.
// ─────────────────────────────────────────────────────────────────────────────
const SLIDER_UI_CONFIG = {
  sliderHeight:  10,   // px — colored track height
  thumbSize:     25,   // base unit; rendered thumb = 3× this (60 px)
  trackRadius:   999,  // px — pill-shaped segment ends
  labelFontSize: 9,    // px — tick / label text (matches V1)
  segmentGap:    3,    // px — space between adjacent segment pills
  iconSize:      10,   // px — SVG icons inside each segment
  scoreFontSize: 18,   // px — reserved for future score-inside-thumb use
};

// Derived constants — computed once from config, never hard-coded in JSX
const D  = SLIDER_UI_CONFIG.thumbSize;          // thumb diameter  = 60 px
const R  = D / 2;                                    // thumb radius    = 30 px
const WH = D + Math.round(D * 0.8);                 // wrapper height  = 108 px (glow room)

// ─────────────────────────────────────────────────────────────────────────────
// SEGMENTS — single source of truth
// color   : CSS-variable string, used directly as inline background
// glowRgb : raw R,G,B triplet matching the token (used in rgba() JS calls)
// icon    : key into ICON_MAP
// ─────────────────────────────────────────────────────────────────────────────
const SEGMENTS = [
  { min: 0,  max: 50,  label: 'Compromised', color: 'rgb(var(--chart-2))', glowRgb: '241,121,104', icon: 'heartbeat'   },
  { min: 50, max: 65,  label: 'Constrained', color: 'rgb(var(--chart-3))', glowRgb: '244,199,100', icon: 'restriction' },
  { min: 65, max: 75,  label: 'Stable',      color: 'rgb(var(--chart-4))', glowRgb: '141,226,141', icon: 'heart'       },
  { min: 75, max: 85,  label: 'Strong',      color: 'rgb(var(--chart-5))', glowRgb: '31,120,76',   icon: 'shield'      },
  { min: 85, max: 100, label: 'Elite',       color: 'rgb(var(--chart-6))', glowRgb: '0,158,148',   icon: 'crown'       },
];

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS  (lightweight inline SVGs, one per segment concept)
// ─────────────────────────────────────────────────────────────────────────────
const HeartbeatIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const RestrictionIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="9" width="20" height="12" rx="2" />
    <path d="M8 9V6a4 4 0 0 1 8 0v3" />
    <line x1="12" y1="14" x2="12" y2="16" />
  </svg>
);

const HeartIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShieldIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CrownIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 19h20" />
    <path d="M2 7l4 5 6-7 6 7 4-5v12H2z" />
    <path d="M9 15c0-1.7 1.3-3 3-3s3 1.3 3 3" />
  </svg>
);

const ICON_MAP = {
  heartbeat:   HeartbeatIcon,
  restriction: RestrictionIcon,
  heart:       HeartIcon,
  shield:      ShieldIcon,
  crown:       CrownIcon,
};

// ─────────────────────────────────────────────────────────────────────────────
// PURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** Returns the SEGMENTS entry that owns `score` within [min, max]. */
const getSegment = (score, min, max) => {
  const s = clamp(score, min, max);
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    if (s >= SEGMENTS[i].min && s < SEGMENTS[i].max) return SEGMENTS[i];
  }
  return SEGMENTS[SEGMENTS.length - 1];
};

/**
 * Slice each global segment to the visible window [min, max].
 * Returns { ...seg, visMin, visMax, widthPct } where widthPct sums to 100.
 * Width is proportional: (visMax - visMin) / (max - min) * 100.
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

// ─────────────────────────────────────────────────────────────────────────────
// HealthScoreSliderV2
//
// New visual design — thin segmented pill track + oversized thumb with blue glow.
// Logic / API surface is identical to HealthScoreSlider (V1). V1 is untouched.
//
// Props:
//   score            {number}   Controlled current value
//   min              {number}   Track minimum  (default 0)
//   max              {number}   Track maximum  (default 100)
//   onChange         {Function} (score: number) => void
//   minAllowedScore  {number?}  Leftward drag boundary
//   maxRecommended   {number?}  Threshold that unlocks ExpertGuidanceCard
//   ticks            {number[]} Explicit tick values; if empty → auto segment labels
// ─────────────────────────────────────────────────────────────────────────────
const HealthScoreSliderV2 = ({
  score: scoreProp = 65,
  min = 0,
  max = 100,
  onChange,
  minAllowedScore,
  maxRecommended,
  ticks = [],
}) => {
  const floorVal = minAllowedScore != null ? clamp(minAllowedScore, min, max) : min;
  const [score, setScore]   = useState(clamp(scoreProp, floorVal, max));
  const trackRef            = useRef(null);
  const dragging            = useRef(false);

  // Sync with controlled prop changes from parent
  useEffect(() => {
    setScore(clamp(scoreProp, floorVal, max));
  }, [scoreProp, floorVal, max]);

  const activeSeg = getSegment(score, min, max);
  const visSegs   = buildVisibleSegments(min, max);
  const span      = max - min;

  // Thumb horizontal position as % of track width
  const markerPct = ((score - min) / span) * 100;

  // ── Drag logic ─────────────────────────────────────────────────
  const clientXToScore = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return score;
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(pct * span + min);
  }, [min, span, score]);

  const commit = useCallback((clientX) => {
    const next = clamp(clientXToScore(clientX), floorVal, max);
    setScore(next);
    onChange?.(next);
  }, [clientXToScore, floorVal, max, onChange]);

  useEffect(() => {
    const onMove      = (e) => { if (dragging.current) commit(e.clientX); };
    const onTouchMove = (e) => { if (dragging.current) commit(e.touches[0].clientX); };
    const onUp        = ()  => { dragging.current = false; };

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchmove',  onTouchMove, { passive: true });
    window.addEventListener('touchend',   onUp);
    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onUp);
    };
  }, [commit]);

  // ── Keyboard nav (matches V1 exactly) ─────────────────────────
  const onKeyDown = (e) => {
    const delta = {
      ArrowRight: 1, ArrowUp: 1,
      ArrowLeft: -1, ArrowDown: -1,
      Home: -span,   End: span,
    }[e.key];
    if (delta == null) return;
    e.preventDefault();
    const next = clamp(score + delta, floorVal, max);
    setScore(next);
    onChange?.(next);
  };

  // Active segment color helpers
  // glowColor : CSS var string  → safe for inline `color:` and `background:` values
  // glowRgba  : rgba() builder  → needed when embedding in template-literal box-shadow / gradient
  //             (CSS var strings cannot be suffixed with hex alpha like `${var}44`)
  const glowColor = activeSeg.color;
  const glowRgba  = (a) => `rgba(${activeSeg.glowRgb},${a})`;

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div style={S.root}>

      {/* ── Outer wrapper — tall enough to contain thumb + glow ── */}
      <div
        style={S.outerWrap}
        onClick={(e) => commit(e.clientX)}
      >
        {/* ── Segmented pill track ── */}
        <div ref={trackRef} style={S.track}>
          {visSegs.map((seg) => {
            const IconComp = ICON_MAP[seg.icon];
            return (
              <div
                key={seg.label}
                style={{
                  ...S.segment,
                  // flex-grow is proportional to segment width — handles gaps correctly
                  flex:       `${seg.widthPct} 0 0`,
                  background: seg.color,
                }}
              >
                {/* Subtle icon — clipped by the track height naturally */}
                {/* <IconComp
                  size={SLIDER_UI_CONFIG.iconSize}
                  color="rgba(0,0,0,0.22)"
                /> */}
              </div>
            );
          })}
        </div>

        {/* ── Thumb — large circle with blue concentric ring glow ── */}
        <div
          role="slider"
          aria-valuemin={floorVal}
          aria-valuemax={max}
          aria-valuenow={score}
          aria-label={`Health score: ${score}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseDown={(e) => { e.preventDefault(); dragging.current = true; }}
          onTouchStart={()  => { dragging.current = true; }}
          style={{
            ...S.thumb,
            left: `calc(${markerPct}% - ${R}px)`,
            // Concentric blue glow rings matching the design image.
            // Uses brand blue (43,127,255) independent of the active segment.
            boxShadow: [
              // Tight concentrated ring — visible bright halo
              `0 0 0 ${Math.round(D * 0.10)}px rgba(43,127,255,0.55)`,
              // Mid-range glow ring
              `0 0 0 ${Math.round(D * 0.22)}px rgba(43,127,255,0.22)`,
              // Outer soft halo
              `0 0 0 ${Math.round(D * 0.38)}px rgba(43,127,255,0.08)`,
              // Diffuse ambient glow
              `0 0 ${Math.round(D * 0.70)}px ${Math.round(D * 0.22)}px rgba(43,127,255,0.30)`,
              // Physical drop shadow
              '0 4px 18px rgba(0,0,0,0.65)',
            ].join(', '),
          }}
        >
          {/* Inner accent ring — creates the layered-depth look from the design */}
          <div style={S.thumbInnerRing} />
        </div>
      </div>

      {/* ── Tick / label row ──
           Positioning logic is identical to HealthScoreSlider (V1):
           • Explicit ticks  → position:absolute per tick, left:pct%, translateX(-50%)
           • Auto labels     → flex-width div per segment matching track proportions
      ── */}
      <div style={S.tickRow}>
        {ticks.length > 0 ? (
          ticks.map(v => {
            const pct       = ((v - min) / span) * 100;
            const isCurrent = v === score;
            const isPast    = v < score;
            const isBeyond  = maxRecommended != null && v > maxRecommended;
            return (
              <span
                key={v}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = clamp(v, floorVal, max);
                  setScore(next);
                  onChange?.(next);
                }}
                style={{
                  position:   'absolute',
                  left:       `${pct}%`,
                  transform:  'translateX(-50%)',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize:   `${SLIDER_UI_CONFIG.labelFontSize}px`,
                  fontWeight: isCurrent ? 700 : 400,
                  color: isCurrent
                    ? glowColor
                    : isBeyond  ? 'rgba(228,228,231,0.18)'
                    : isPast    ? 'rgba(228,228,231,0.22)'
                    :             'rgba(228,228,231,0.40)',
                  cursor:     'pointer',
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
          visSegs.map((seg) => {
            const isActive = activeSeg.label === seg.label;
            return (
              <div
                key={seg.label}
                style={{
                  width:         `${seg.widthPct}%`,
                  textAlign:     'center',
                  fontSize:      `${SLIDER_UI_CONFIG.labelFontSize}px`,
                  letterSpacing: '0.11em',
                  textTransform: 'uppercase',
                  fontFamily:    'var(--font-mono, monospace)',
                  color:         isActive ? seg.color : 'rgba(255,255,255,0.20)',
                  fontWeight:    isActive ? 700 : 400,
                  transition:    'color 0.3s',
                  overflow:      'hidden',
                  textOverflow:  'ellipsis',
                  whiteSpace:    'nowrap',
                }}
              >
                {seg.label}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STATIC STYLES  (computed from SLIDER_UI_CONFIG; defined once outside render)
// ─────────────────────────────────────────────────────────────────────────────
const { sliderHeight: SH, trackRadius: TR, segmentGap: SG, labelFontSize: LF } = SLIDER_UI_CONFIG;

const S = {
  root: {
    width:             '100%',
    userSelect:        'none',
    WebkitUserSelect:  'none',
  },

  // Outer wrapper — must be tall enough so the thumb + full glow rings are visible
  outerWrap: {
    position:     'relative',
    height:       `${WH}px`,
    marginTop:    '4px',
    marginBottom: '4px',
    cursor:       'pointer',
  },

  // Thin segmented pill track, vertically centered inside outerWrap
  track: {
    position:     'absolute',
    top:          '50%',
    left:         0,
    right:        0,
    transform:    'translateY(-50%)',
    height:       `${SH}px`,
    display:      'flex',
    gap:          `${SG}px`,
    // overflow:hidden is intentionally omitted — segment border-radii handle clipping,
    // and absence of overflow:hidden lets segments render their own full pill shape.
  },

  // Individual segment — each is a fully rounded pill with centered icon
  segment: {
    height:          '100%',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    borderRadius:    `${TR}px`,   // full pill per segment (not just first/last)
    overflow:        'hidden',    // clips icon to track height
    flexShrink:      0,
  },

  // Thumb — large dark circle; box-shadow (glow) injected inline so it animates with segment
  thumb: {
    position:     'absolute',
    top:          '50%',
    transform:    'translateY(-50%)',
    width:        `${D}px`,
    height:       `${D}px`,
    borderRadius: '50%',
    // Deep navy fill with a subtle top-left highlight for 3-D depth
    background:   'radial-gradient(circle at 38% 32%, rgba(22,32,72,0.97) 0%, rgba(3,5,16,0.99) 100%)',
    // Subtle border that separates thumb from track — faint blue tint
    border:       '1.5px solid rgba(80,120,255,0.50)',
    display:      'flex',
    alignItems:   'center',
    justifyContent: 'center',
    cursor:       'grab',
    zIndex:       10,
    outline:      'none',
    // `left` and `box-shadow` are injected inline (score-dependent)
    transition:   'left 0.04s linear, box-shadow 0.35s ease',
    willChange:   'left',
  },

  // Inner decorative ring — creates the concentric-circle depth in the design image
  thumbInnerRing: {
    width:        `${Math.round(D * 0.68)}px`,
    height:       `${Math.round(D * 0.68)}px`,
    borderRadius: '50%',
    border:       '1px solid rgba(100,150,255,0.18)',
    // Faint top-highlight to reinforce 3-D appearance
    background:   'radial-gradient(circle at 36% 30%, rgba(60,90,200,0.14) 0%, transparent 65%)',
    pointerEvents: 'none',
  },

  // Tick / label row — identical layout contract as HealthScoreSlider (V1)
  tickRow: {
    position:   'relative',
    display:    'flex',
    height:     `${Math.max(LF + 2, 11)}px`,
    marginTop:  '5px',
  },
};

export default HealthScoreSliderV2;
