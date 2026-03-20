import React, { useState, useRef, useCallback, useEffect } from 'react';

const SLIDER_UI_CONFIG = {
  sliderHeight: 10,
  thumbSize: 30,
  trackRadius: 999,
  labelFontSize: 10,
  segmentGap: 3,
  iconSize: 10,
  scoreFontSize: 18,
};

const D = SLIDER_UI_CONFIG.thumbSize;
const R = D / 2;
const WH = D + Math.round(D * 0.5);

const SEGMENTS = [
  { min: 0,  max: 50,  label: 'Compromised', color: 'rgb(var(--chart-2))', glowRgb: '241,121,104', icon: 'heartbeat' },
  { min: 50, max: 65,  label: 'Constrained', color: 'rgb(var(--chart-3))', glowRgb: '244,199,100', icon: 'restriction' },
  { min: 65, max: 75,  label: 'Stable',      color: 'rgb(var(--chart-4))', glowRgb: '141,226,141', icon: 'heart' },
  { min: 75, max: 85,  label: 'Robust',      color: 'rgb(var(--chart-5))', glowRgb: '31,120,76',   icon: 'shield' },
  { min: 85, max: 100, label: 'Elite',       color: 'rgb(var(--chart-6))', glowRgb: '0,158,148',   icon: 'crown' },
];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const getSegment = (score, min, max) => {
  const s = clamp(score, min, max);
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    if (s >= SEGMENTS[i].min && s < SEGMENTS[i].max) return SEGMENTS[i];
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
      return { ...seg, visMin, visMax, widthPct: ((visMax - visMin) / span) * 100 };
    })
    .filter(Boolean);
};

const MobileHealthScoreSlider = ({
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

  useEffect(() => {
    setScore(clamp(scoreProp, floorVal, max));
  }, [scoreProp, floorVal, max]);

  const activeSeg = getSegment(score, min, max);
  const visSegs = buildVisibleSegments(min, max);
  const span = max - min;
  const markerPct = ((score - min) / span) * 100;

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
    const onMove = (e) => { if (dragging.current) commit(e.clientX); };
    const onTouchMove = (e) => { if (dragging.current) commit(e.touches[0].clientX); };
    const onUp = () => { dragging.current = false; };

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

  const onKeyDown = (e) => {
    const delta = {
      ArrowRight: 1, ArrowUp: 1,
      ArrowLeft: -1, ArrowDown: -1,
      Home: -span, End: span,
    }[e.key];
    if (delta == null) return;
    e.preventDefault();
    const next = clamp(score + delta, floorVal, max);
    setScore(next);
    onChange?.(next);
  };

  const glowColor = activeSeg.color;

  return (
    <div style={S.root}>
      <div style={S.outerWrap} onClick={(e) => commit(e.clientX)}>
        <div ref={trackRef} style={S.track}>
          {visSegs.map((seg) => (
            <div
              key={seg.label}
              style={{
                ...S.segment,
                flex: `${seg.widthPct} 0 0`,
                background: seg.color,
              }}
            />
          ))}
        </div>

        <div
          role="slider"
          aria-valuemin={floorVal}
          aria-valuemax={max}
          aria-valuenow={score}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseDown={(e) => { e.preventDefault(); dragging.current = true; }}
          onTouchStart={() => { dragging.current = true; }}
          style={{
            ...S.thumb,
            left: `calc(${markerPct}% - ${R}px)`,
          }}
        />
      </div>

      <div style={S.tickRow}>
        {/* Fixed first label correctly aligned to left */}
        <div style={{ position: 'absolute', left: 0, height: '100%', display: 'flex', alignItems: 'center' }}>
          <span
            onClick={() => {
              setScore(min);
              onChange?.(min);
            }}
            style={{
              ...S.tickLabel,
              color: score === min ? glowColor : 'rgba(255,255,255,0.4)',
              fontWeight: score === min ? 800 : 500,
            }}
          >
            {min}
          </span>
        </div>

        {/* Dynamic labels mirrored to segments and gaps */}
        {visSegs.map((seg, idx) => {
          const isLast = idx === visSegs.length - 1;
          const labelVal = seg.max;
          const isActive = score === labelVal;

          return (
            <div
              key={idx}
              style={{
                flex: `${seg.widthPct} 0 0`,
                position: 'relative',
                height: '100%',
              }}
            >
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  right: `-${SG}px`, 
                  width: `${SG}px`,
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  <span
                    onClick={() => {
                      const next = clamp(labelVal, floorVal, max);
                      setScore(next);
                      onChange?.(next);
                    }}
                    style={{
                      ...S.tickLabel,
                      color: isActive ? glowColor : 'rgba(255,255,255,0.4)',
                      fontWeight: isActive ? 800 : 500,
                    }}
                  >
                    {labelVal}
                  </span>
                </div>
              )}
              {isLast && (
                <div style={{ position: 'absolute', right: 0, height: '100%', display: 'flex', alignItems: 'center' }}>
                  <span
                    onClick={() => {
                      setScore(max);
                      onChange?.(max);
                    }}
                    style={{
                      ...S.tickLabel,
                      color: score === max ? glowColor : 'rgba(255,255,255,0.4)',
                      fontWeight: score === max ? 800 : 500,
                    }}
                  >
                    {max}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const { sliderHeight: SH, trackRadius: TR, segmentGap: SG } = SLIDER_UI_CONFIG;

const S = {
  root: { width: '100%', userSelect: 'none', padding: '0 4px' },
  outerWrap: { position: 'relative', height: `${WH}px`, marginTop: '4px', marginBottom: '0px', cursor: 'pointer' },
  track: { position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', height: `${SH}px`, display: 'flex', gap: `${SG}px` },
  segment: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: `${TR}px`, overflow: 'hidden', flexShrink: 0 },
  thumb: { 
    position: 'absolute', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    width: `${D}px`, 
    height: `${D}px`, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    cursor: 'grab', 
    zIndex: 10, 
    outline: 'none', 
    transition: 'left 0.1s linear', 
    willChange: 'left', 
    background: '#1a1a2e', 
    border: '2.5px solid rgba(255,255,255,0.85)', 
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
  },
  tickRow: { 
    position: 'relative', 
    display: 'flex', 
    height: '14px', 
    marginTop: '6px', 
    gap: `${SG}px`,
    padding: '0', 
    pointerEvents: 'auto' 
  },
  tickLabel: {
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  }
};

export default MobileHealthScoreSlider;
