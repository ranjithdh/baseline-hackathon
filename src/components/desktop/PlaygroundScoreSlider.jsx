import React, {
  useState, useRef, useCallback, useEffect,
  useLayoutEffect, useMemo, memo,
} from 'react';
import sliderMarker from '../../assets/slider_marker.png';

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL CONSTANTS — change once, applies everywhere
// ─────────────────────────────────────────────────────────────────────────────
const TRACK_H        = 10;
const THUMB_D        = 30;
const THUMB_R        = THUMB_D / 2;
const WRAP_H         = THUMB_D + 20;
const SEG_GAP        = 3;

const MARKER_LINE_H    = 21;
const MARKER_LABEL_GAP = 6;
const MARKER_LABEL_H   = 30;
const MARKER_TOP_SPACE = MARKER_LINE_H + MARKER_LABEL_GAP + MARKER_LABEL_H; // 57 px

// ─────────────────────────────────────────────────────────────────────────────
// SEGMENTS
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
// MarkerColumn — purely presentational, no internal state
// ─────────────────────────────────────────────────────────────────────────────
const MarkerColumn = memo(({ leftPct, score, label, glowRgb, color, transition }) => (
  <>
    <div
      style={{
        position:      'absolute',
        left:          `${leftPct}%`,
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

    <div
      style={{
        position:      'absolute',
        left:          `${leftPct}%`,
        bottom:        '100%',
        transform:     'translateX(-50%)',
        width:         '2px',
        height:        `${MARKER_LINE_H}px`,
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
));
MarkerColumn.displayName = 'MarkerColumn';

// ─────────────────────────────────────────────────────────────────────────────
// PlaygroundScoreSlider
//
// Performance contract:
//   • During drag  → only internal setValue() fires; NO parent re-render
//   • On release   → onChangeEnd(value) fires exactly once
//   • RAF-batched  → at most one commitMove() per animation frame (~60fps)
//   • Stable deps  → window event listeners NEVER re-register during drag
// ─────────────────────────────────────────────────────────────────────────────
const PlaygroundScoreSlider = memo(({
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

  // ── Internal drag state (never escapes to parent during drag) ─────────────
  const [value, setValue] = useState(
    () => clamp(snapTo(valueProp ?? min, step), min, max)
  );

  // Sync from controlled prop — fires only when parent deliberately changes it
  // (i.e. on release, NOT during drag, because we stopped calling onGoalChange live)
  useEffect(() => {
    const next = clamp(snapTo(valueProp ?? min, step), min, max);
    setValue(next);
    lastValue.current = next;
  }, [valueProp, min, max, step]);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const trackRef    = useRef(null);
  const dragging    = useRef(false);
  const wasDragging = useRef(false);
  const lastValue   = useRef(value);
  const rafRef      = useRef(null);   // pending animation frame ID
  const pendingX    = useRef(null);   // latest clientX buffered for next RAF tick

  // ── Stable callback refs ──────────────────────────────────────────────────
  // Always hold the latest prop value, but their IDENTITY never changes.
  // This breaks the dep-chain:  onChange → commitMove → effect → listener churn
  const onChangeRef    = useRef(onChange);
  const onChangeEndRef = useRef(onChangeEnd);
  useLayoutEffect(() => { onChangeRef.current    = onChange;    }, [onChange]);
  useLayoutEffect(() => { onChangeEndRef.current = onChangeEnd; }, [onChangeEnd]);

  // ── Derived geometry ──────────────────────────────────────────────────────
  const currentPct       = ((value    - min) / span) * 100;
  const potentialPct     = ((potScore - min) / span) * 100;
  const currentMarkerPct = 0; // "Current" marker always pinned to track start
  const currentSeg       = getSegment(min);
  const potentialSeg     = getSegment(potScore);
  const visSegs          = useMemo(() => buildVisibleSegments(min, max), [min, max]);

  // ── Pixel → score conversion ──────────────────────────────────────────────
  // FIX: `value` removed from deps — it was only used as a fallback, which we
  // now satisfy via `lastValue` ref.  This makes clientXToValue stable for the
  // entire drag gesture (min/max/span/step never change mid-drag).
  const clientXToValue = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return lastValue.current; // ← ref fallback, no stale closure
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    return clamp(snapTo(pct * span + min, step), min, max);
  }, [min, max, span, step]); // ← `value` intentionally excluded

  // ── Commit a drag position ────────────────────────────────────────────────
  // FIX: `onChange` removed from deps — we call it through the stable ref.
  // commitMove is now stable for the entire drag gesture.
  const commitMove = useCallback((clientX) => {
    const next = clientXToValue(clientX);
    lastValue.current = next;
    setValue(next);
    onChangeRef.current?.(next); // ← ref, not closure — zero dep cost
  }, [clientXToValue]); // ← `onChange` intentionally excluded

  // ── RAF-batched global move / up listeners ────────────────────────────────
  // FIX: Because commitMove is now stable for the entire drag, this effect
  // registers its listeners ONCE on mount and never re-registers mid-drag.
  useEffect(() => {
    // Flush the latest buffered clientX in the next animation frame.
    // This caps DOM writes to 60fps even when the device polls at 1000Hz.
    const scheduleCommit = (clientX) => {
      pendingX.current = clientX;
      if (rafRef.current !== null) return; // already scheduled this frame
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (dragging.current && pendingX.current !== null) {
          commitMove(pendingX.current);
        }
      });
    };

    const onMove      = (e) => { if (dragging.current) scheduleCommit(e.clientX); };
    const onTouchMove = (e) => { if (dragging.current) scheduleCommit(e.touches[0].clientX); };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current    = false;
      wasDragging.current = true;

      // Cancel any pending RAF so we don't fire commitMove after release
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      onChangeEndRef.current?.(lastValue.current); // ← ref, not closure
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
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [commitMove]); // commitMove is now stable for entire drag — registers once

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const onKeyDown = useCallback((e) => {
    const delta = {
      ArrowRight:  step,  ArrowUp:    step,
      ArrowLeft:  -step,  ArrowDown: -step,
      Home: -(max - min), End: max - min,
    }[e.key];
    if (delta == null) return;
    e.preventDefault();
    const next = clamp(snapTo(value + delta, step), min, max);
    lastValue.current = next;
    setValue(next);
    onChangeRef.current?.(next);
    onChangeEndRef.current?.(next);
  }, [value, min, max, step]);

  // ── Track click ───────────────────────────────────────────────────────────
  const onTrackClick = useCallback((e) => {
    if (wasDragging.current) { wasDragging.current = false; return; }
    const next = clientXToValue(e.clientX);
    lastValue.current = next;
    setValue(next);
    onChangeRef.current?.(next);
    onChangeEndRef.current?.(next);
  }, [clientXToValue]);

  // ── Thumb pointer-down ────────────────────────────────────────────────────
  const onThumbMouseDown = useCallback((e) => {
    e.preventDefault();
    wasDragging.current = false;
    dragging.current    = true;
  }, []);

  const onThumbTouchStart = useCallback(() => {
    wasDragging.current = false;
    dragging.current    = true;
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width:            '100%',
        userSelect:       'none',
        WebkitUserSelect: 'none',
        paddingTop:       `${MARKER_TOP_SPACE}px`,
      }}
    >
      <div
        style={{
          position: 'relative',
          height:   `${WRAP_H}px`,
          cursor:   'pointer',
        }}
        onClick={onTrackClick}
      >
        {/* ── POTENTIAL marker ── */}
        <MarkerColumn
          leftPct={potentialPct}
          score={potScore}
          label="Potential"
          glowRgb={potentialSeg.glowRgb}
          color={`rgba(${potentialSeg.glowRgb}, 0.42)`}
        />

        {/* ── CURRENT marker (fixed at track start) ── */}
        <MarkerColumn
          leftPct={currentMarkerPct}
          score={min}
          label="Current"
          glowRgb={currentSeg.glowRgb}
          color={currentSeg.color}
        />

        {/* ── Segmented pill track ── */}
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

        {/* ── Draggable thumb ── */}
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={`Current score: ${value}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseDown={onThumbMouseDown}
          onTouchStart={onThumbTouchStart}
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
            // 'transform' hint keeps the thumb on its own compositor layer
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

      </div>
    </div>
  );
});

PlaygroundScoreSlider.displayName = 'PlaygroundScoreSlider';
export default PlaygroundScoreSlider;
