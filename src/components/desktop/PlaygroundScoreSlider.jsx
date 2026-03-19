import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import sliderMarker from '../../assets/slider_marker.png';

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL CONSTANTS — change once, applies everywhere
// ─────────────────────────────────────────────────────────────────────────────
const TRACK_H           = 10;   // px — pill track height
const THUMB_D           = 30;   // px — thumb diameter
const THUMB_R           = THUMB_D / 2;
const WRAP_H            = THUMB_D + 20;  // px — track-area wrapper height
const SEG_GAP           = 3;    // px — gap between adjacent segment pills

// Marker geometry (everything lives ABOVE the track)
const MARKER_LINE_H     = 21;   // px — dashed line height above track (50% of original 42)
const MARKER_LABEL_GAP  = 6;    // px — space between label bottom and line top
const MARKER_LABEL_H    = 30;   // px — approximate label block height (score + text)
// Total clear-space reserved above the track-area wrapper
const MARKER_TOP_SPACE  = MARKER_LINE_H + MARKER_LABEL_GAP + MARKER_LABEL_H; // 76 px


// ─────────────────────────────────────────────────────────────────────────────
// SEGMENTS — mirrors HealthScoreSliderV2 exactly (same CSS vars + glowRgb)
// ─────────────────────────────────────────────────────────────────────────────
const SEGMENTS = [
  { min: 0,  max: 50,  label: 'Compromised', color: 'rgb(var(--chart-2))', glowRgb: '241,121,104' },
  { min: 50, max: 65,  label: 'Constrained', color: 'rgb(var(--chart-3))', glowRgb: '244,199,100' },
  { min: 65, max: 75,  label: 'Stable',      color: 'rgb(var(--chart-4))', glowRgb: '141,226,141' },
  { min: 75, max: 85,  label: 'Strong',      color: 'rgb(var(--chart-5))', glowRgb: '31,120,76'   },
  { min: 85, max: 100, label: 'Elite',       color: 'rgb(var(--chart-6))', glowRgb: '0,158,148'   },
];

// ─────────────────────────────────────────────────────────────────────────────
// PURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const snapTo = (v, step)   => Math.round(v / step) * step;

const getSegment = (score) => {
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    if (score >= SEGMENTS[i].min && score < SEGMENTS[i].max) return SEGMENTS[i];
  }
  return SEGMENTS[SEGMENTS.length - 1];
};

const buildVisibleSegments = (min, max) => {
  const span = max - min;
  return SEGMENTS
    .map(seg => {
      const visMin = Math.max(seg.min, min);
      const visMax = Math.min(seg.max, max);
      if (visMin >= visMax) return null;
      return { ...seg, widthPct: ((visMax - visMin) / span) * 100 };
    })
    .filter(Boolean);
};


// ─────────────────────────────────────────────────────────────────────────────
// Shared marker renderer
//
// Renders ONE marker column (dashed line + label) anchored ABOVE the track.
// • The line's bottom edge sits exactly at the track-area top  (bottom: 100%)
// • The label sits above the line                              (bottom: 100% + LINE_H + GAP)
// ─────────────────────────────────────────────────────────────────────────────
const MarkerColumn = ({ leftPct, score, label, glowRgb, color, transition }) => (
  <>
    {/* Label — sits above the dashed line */}
    <div
      style={{
        position:      'absolute',
        left:          `${leftPct}%`,
        // bottom: 100%  = top of track-area wrapper
        // + MARKER_LINE_H = clears the full line
        // + MARKER_LABEL_GAP = breathing room
        bottom:        `calc(100% + ${MARKER_LINE_H + MARKER_LABEL_GAP}px)`,
        transform:     'translateX(-50%)',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '3px',
        pointerEvents: 'none',
        whiteSpace:    'nowrap',
        transition:    transition || 'none',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize:   '14px',
        fontWeight: 600,
        lineHeight: 1,
        color:      color,
        transition: 'color 0.25s',
      }}>
        {score}
      </span>
      <span style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color:         `rgba(${glowRgb}, 0.5)`,
        transition:    'color 0.25s',
      }}>
        {label}
      </span>
    </div>

    {/* Dashed line — bottom edge anchored to track-area top, extends upward only */}
    <div
      style={{
        position:      'absolute',
        left:          `${leftPct}%`,
        // bottom: 100% → bottom of this div = top of the track-area wrapper
        bottom:        '100%',
        transform:     'translateX(-50%)',
        width:         '2px',
        height:        `${MARKER_LINE_H}px`,
        // Dashed stroke via repeating-gradient (no SVG, no extra DOM)
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          rgba(${glowRgb}, 0.65) 0px,
          rgba(${glowRgb}, 0.65) 5px,
          transparent 5px,
          transparent 9px
        )`,
        filter:        `drop-shadow(0 0 3px rgba(${glowRgb}, 0.35))`,
        zIndex:        5,
        pointerEvents: 'none',
        transition:    transition || 'none',
      }}
    />
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// PlaygroundScoreSlider
//
// Renders a segmented health-score slider with two above-track markers:
//   • "Current"   — follows the draggable thumb (controlled via `value`)
//   • "Potential" — fixed dashed marker at `initialScore`
//
// Props
//   initialScore   Fixed "Potential" score — shown as a dashed marker above the track
//   value          Controlled current value — drives the draggable thumb + "Current" marker
//   min / max      Track range  (default 0 / 100)
//   step           Snap increment (default 1)
//   onChange       Called on every drag tick with the live value
//   onChangeEnd    Called once per interaction on release / click / key press
// ─────────────────────────────────────────────────────────────────────────────
const PlaygroundScoreSlider = ({
  initialScore,
  value: valueProp,
  min  = 0,
  max  = 100,
  step = 1,
  onChange,
  onChangeEnd,
}) => {
  const span     = max - min;
  const potScore = clamp(initialScore, min, max);

  // ── Internal controlled state ─────────────────────────────────────────────
  const [value, setValue] = useState(() => clamp(snapTo(valueProp ?? min, step), min, max));

  useEffect(() => {
    const next = clamp(snapTo(valueProp ?? min, step), min, max);
    setValue(next);
    lastValue.current = next;
  }, [valueProp, min, max, step]);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const trackRef    = useRef(null);
  const dragging    = useRef(false);
  const wasDragging = useRef(false); // suppresses double-commit on thumb click
  const lastValue   = useRef(value);

  // ── Derived geometry ──────────────────────────────────────────────────────
  const currentPct   = ((value    - min) / span) * 100;  // thumb position only
  const potentialPct = ((potScore - min) / span) * 100;

  // "Current" marker is always pinned to the slider's start (min = 0 %).
  // It does NOT follow the thumb — it is a fixed reference for the baseline score.
  const currentMarkerPct = 0;

  // Segment colour is derived from min (the fixed Current score).
  const currentSeg   = getSegment(min);
  const potentialSeg = getSegment(potScore);
  const visSegs      = useMemo(() => buildVisibleSegments(min, max), [min, max]);

  // ── Pixel → score conversion ──────────────────────────────────────────────
  const clientXToValue = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return value;
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    return clamp(snapTo(pct * span + min, step), min, max);
  }, [min, max, span, step, value]);

  // ── Commit helper (during drag) ───────────────────────────────────────────
  const commitMove = useCallback((clientX) => {
    const next = clientXToValue(clientX);
    lastValue.current = next;
    setValue(next);
    onChange?.(next);
  }, [clientXToValue, onChange]);

  // ── Global mouse / touch listeners ───────────────────────────────────────
  useEffect(() => {
    const onMove      = (e) => { if (dragging.current) commitMove(e.clientX); };
    const onTouchMove = (e) => { if (dragging.current) commitMove(e.touches[0].clientX); };
    const onUp        = () => {
      if (dragging.current) {
        dragging.current    = false;
        wasDragging.current = true;   // block the bubbled onClick from re-firing
        onChangeEnd?.(lastValue.current);
      }
    };

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
  }, [commitMove, onChangeEnd]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const onKeyDown = (e) => {
    const delta = {
      ArrowRight: step,  ArrowUp:    step,
      ArrowLeft: -step,  ArrowDown: -step,
      Home: -(max - min), End: max - min,
    }[e.key];
    if (delta == null) return;
    e.preventDefault();
    const next = clamp(snapTo(value + delta, step), min, max);
    lastValue.current = next;
    setValue(next);
    onChange?.(next);
    onChangeEnd?.(next);
  };

  // ── Track / outer-wrapper click ───────────────────────────────────────────
  const onTrackClick = (e) => {
    if (wasDragging.current) { wasDragging.current = false; return; }
    const next = clientXToValue(e.clientX);
    lastValue.current = next;
    setValue(next);
    onChange?.(next);
    onChangeEnd?.(next);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width:           '100%',
        userSelect:      'none',
        WebkitUserSelect:'none',
        // Reserve exactly enough room above the track for both marker columns
        paddingTop:      `${MARKER_TOP_SPACE}px`,
      }}
    >
      {/*
        Track-area wrapper
        ─────────────────
        All markers use `position: absolute; bottom: 100%` relative to THIS div.
        That anchors their BOTTOM EDGE to the TOP of the track area, so they
        extend upward only — never through or below the slider track.
      */}
      <div
        style={{
          position: 'relative',
          height:   `${WRAP_H}px`,
          cursor:   'pointer',
        }}
        onClick={onTrackClick}
      >

        {/* ── POTENTIAL marker (fixed) ────────────────────────────────────── */}
        <MarkerColumn
          leftPct={potentialPct}
          score={potScore}
          label="Potential"
          glowRgb={potentialSeg.glowRgb}
          color={`rgba(${potentialSeg.glowRgb}, 0.42)`}
        />

        {/* ── CURRENT marker — fixed at the slider start (min score) ────────── */}
        {/* leftPct is always 0: this marker never moves regardless of thumb position */}
        <MarkerColumn
          leftPct={currentMarkerPct}
          score={min}
          label="Current"
          glowRgb={currentSeg.glowRgb}
          color={currentSeg.color}
        />

        {/* ── Segmented pill track ────────────────────────────────────────── */}
        <div
          ref={trackRef}
          style={{
            position:  'absolute',
            top:       '50%',
            left:      0,
            right:     0,
            transform: 'translateY(-50%)',
            height:    `${TRACK_H}px`,
            display:   'flex',
            gap:       `${SEG_GAP}px`,
          }}
        >
          {visSegs.map(seg => (
            <div
              key={seg.label}
              style={{
                flex:         `${seg.widthPct} 0 0`,
                height:       '100%',
                borderRadius: '999px',
                background:   seg.color,
              }}
            />
          ))}
        </div>

        {/* ── Draggable thumb ─────────────────────────────────────────────── */}
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={`Current score: ${value}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseDown={(e) => {
            e.preventDefault();
            wasDragging.current = false;
            dragging.current    = true;
          }}
          onTouchStart={() => {
            wasDragging.current = false;
            dragging.current    = true;
          }}
          style={{
            position:       'absolute',
            top:            '50%',
            left:           `calc(${currentPct}% - ${THUMB_R}px)`,
            transform:      'translateY(-50%)',
            width:          `${THUMB_D}px`,
            height:         `${THUMB_D}px`,
            zIndex:         10,
            cursor:         'grab',
            outline:        'none',
            background:     'none',
            border:         'none',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            transition:     'left 0.04s linear',
            willChange:     'left',
          }}
        >
          <img
            src={sliderMarker}
            alt=""
            style={{
              width:         '100%',
              height:        '100%',
              objectFit:     'contain',
              pointerEvents: 'none',
              userSelect:    'none',
              draggable:     false,
            }}
          />
        </div>

      </div>{/* end track-area wrapper */}
    </div>
  );
};

export default PlaygroundScoreSlider;
