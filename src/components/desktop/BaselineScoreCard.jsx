import React, { useEffect, useRef, useState } from 'react';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  'High Alert':  { color: '#ff4d4d', colorDim: '#7f1d1d', rgb: '255,77,77',   arcA: '#ff4d4d', arcB: '#ff9966', next: 'Constrained', nextAt: 50  },
  'Constrained': { color: '#ff8c42', colorDim: '#7c2d12', rgb: '255,140,66',  arcA: '#ff8c42', arcB: '#ffcc66', next: 'Stable',      nextAt: 65  },
  'Stable':      { color: '#f5c842', colorDim: '#78450a', rgb: '245,200,66',  arcA: '#f5c842', arcB: '#ffe066', next: 'Strong',      nextAt: 75  },
  'Strong':      { color: '#3de88c', colorDim: '#14532d', rgb: '61,232,140',  arcA: '#3de88c', arcB: '#a3ffcb', next: 'Elite',       nextAt: 85  },
  'Elite':       { color: '#c084fc', colorDim: '#3b0764', rgb: '192,132,252', arcA: '#c084fc', arcB: '#e8baff', next: null,          nextAt: 100 },
};

const LEVELS = ['High Alert', 'Constrained', 'Stable', 'Strong', 'Elite'];
const LEVEL_THRESHOLDS = [0, 50, 65, 75, 85, 100];

// ─── useCountUp ──────────────────────────────────────────────────────────────
function useCountUp(target, { delay = 600, duration = 1800 } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame, startTime, started = false;
    const timer = setTimeout(() => {
      const tick = (ts) => {
        if (!started) { startTime = ts; started = true; }
        const p = Math.min((ts - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 4); // ease-out-quart — snappier start
        setVal(Math.round(target * ease));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [target, delay, duration]);
  return val;
}

// ─── Arc math helpers ────────────────────────────────────────────────────────
const SWEEP_DEG = 260;   // how many degrees the arc spans
const GAP_DEG   = 100;   // remaining gap at the bottom
const START_DEG = 90 + GAP_DEG / 2; // starts at bottom-left

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function describeArc(cx, cy, r, startDeg, endDeg) {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

// ─── PremiumArc ──────────────────────────────────────────────────────────────
const PremiumArc = ({ score, cfg, revealed }) => {
  const SIZE = 260;
  const CX = SIZE / 2, CY = SIZE / 2;
  const R_OUTER = 108, R_MID = 96, R_INNER = 84;

  // Calculate fill end angle
  const fillFrac   = revealed ? score / 100 : 0;
  const fillEndDeg = START_DEG + SWEEP_DEG * fillFrac;
  const arcEndDeg  = START_DEG + SWEEP_DEG;

  // Tip dot position
  const tipPt = polarToXY(CX, CY, R_MID, fillEndDeg);

  const gradId   = 'arc-grad';
  const glowId   = 'arc-glow';
  const tipGlowId = 'tip-glow';

  return (
    <svg
      width={SIZE} height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        {/* Arc gradient */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={cfg.arcA} stopOpacity="0.55" />
          <stop offset="100%" stopColor={cfg.arcB} stopOpacity="1" />
        </linearGradient>

        {/* Outer glow filter */}
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Tip glow filter */}
        <filter id={tipGlowId} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Radial gradient for center fill */}
        <radialGradient id="center-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={`rgba(${cfg.rgb},0.08)`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* ── Outer decorative ring (faintest) ── */}
      <path
        d={describeArc(CX, CY, R_OUTER, START_DEG, arcEndDeg)}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* ── Track  ── */}
      <path
        d={describeArc(CX, CY, R_MID, START_DEG, arcEndDeg)}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* ── Inner decorative ring ── */}
      <path
        d={describeArc(CX, CY, R_INNER, START_DEG, arcEndDeg)}
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* ── Filled arc (glow layer — blurred duplicate) ── */}
      {revealed && (
        <path
          d={describeArc(CX, CY, R_MID, START_DEG, fillEndDeg)}
          fill="none"
          stroke={`rgba(${cfg.rgb},0.45)`}
          strokeWidth="18"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          style={{ transition: 'stroke-dashoffset 0.1s' }}
        />
      )}

      {/* ── Filled arc (sharp layer) ── */}
      {revealed && (
        <path
          d={describeArc(CX, CY, R_MID, START_DEG, fillEndDeg)}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="14"
          strokeLinecap="round"
        />
      )}

      {/* ── Center radial ambient ── */}
      <circle cx={CX} cy={CY} r={R_INNER - 10} fill="url(#center-radial)" />

      {/* ── Tip glow dot ── */}
      {revealed && score > 2 && (
        <>
          <circle
            cx={tipPt.x} cy={tipPt.y} r="14"
            fill={`rgba(${cfg.rgb},0.18)`}
            filter={`url(#${tipGlowId})`}
          />
          <circle
            cx={tipPt.x} cy={tipPt.y} r="7"
            fill={cfg.arcB}
            filter={`url(#${tipGlowId})`}
          />
          <circle cx={tipPt.x} cy={tipPt.y} r="3.5" fill="#fff" />
        </>
      )}
    </svg>
  );
};

// ─── FloatingOrb ─────────────────────────────────────────────────────────────
const FloatingOrb = ({ style }) => (
  <div style={{
    position: 'absolute',
    borderRadius: '50%',
    pointerEvents: 'none',
    ...style,
  }} />
);

// ─── MilestoneDots ───────────────────────────────────────────────────────────
const MilestoneDots = ({ score, status, cfg }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%' }}>
    {LEVELS.map((lvl, i) => {
      const threshold = LEVEL_THRESHOLDS[i];
      const reached   = score >= threshold;
      const isCurrent = lvl === status;
      const lvlCfg    = STATUS[lvl];
      return (
        <React.Fragment key={lvl}>
          {/* Connecting line */}
          {i > 0 && (
            <div style={{
              flex: 1, height: '2px',
              background: reached
                ? `linear-gradient(90deg, ${STATUS[LEVELS[i-1]].color}60, ${lvlCfg.color}60)`
                : 'rgba(255,255,255,0.07)',
              transition: 'background 0.4s ease',
            }} />
          )}
          {/* Dot */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
          }}>
            <div style={{
              width:  isCurrent ? '12px' : '8px',
              height: isCurrent ? '12px' : '8px',
              borderRadius: '50%',
              background: reached ? lvlCfg.color : 'rgba(255,255,255,0.12)',
              boxShadow: isCurrent ? `0 0 14px ${lvlCfg.color}, 0 0 28px ${lvlCfg.color}60` : 'none',
              border: isCurrent ? `2px solid rgba(255,255,255,0.6)` : 'none',
              transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: '8px',
              fontWeight: isCurrent ? 700 : 400,
              color: isCurrent ? lvlCfg.color : 'rgba(255,255,255,0.22)',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
              transition: 'color 0.4s',
            }}>
              {lvl === 'High Alert' ? 'Alert' : lvl}
            </span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

// ─── InsightChip ─────────────────────────────────────────────────────────────
const InsightChip = ({ icon, label, value, color, delay }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      padding: '12px 14px',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}12`,
        border: `1px solid ${color}25`,
        fontSize: '16px', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginBottom: '2px', whiteSpace: 'nowrap' }}>
          {label}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </div>
      </div>
    </div>
  );
};

// ─── Main Card ───────────────────────────────────────────────────────────────
const BaselineScoreCard = ({
  score          = 65,
  status         = 'Stable',
  weeklyGain     = 4,
  biggestBoost   = 'Vitamin D3 + K2',
  biggestBoostGain = 7,
  topPercentage  = 35,
  onDeepDive,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const displayScore = useCountUp(score, { delay: 500, duration: 2000 });

  useEffect(() => { const t = setTimeout(() => setRevealed(true), 150); return () => clearTimeout(t); }, []);

  const cfg = STATUS[status] || STATUS['Stable'];
  const nextLabel  = cfg.next;
  const nextAt     = cfg.nextAt;
  const pointsLeft = nextLabel ? Math.max(nextAt - score, 0) : 0;
  const prevAt     = LEVEL_THRESHOLDS[LEVELS.indexOf(status)];
  const barPct     = Math.min(Math.max(((score - prevAt) / (nextAt - prevAt)) * 100, 3), 100);

  const uniqueId = useRef(`bsc-${Math.random().toString(36).slice(2)}`).current;

  return (
    <>
      <style>{`
        /* ─ Keyframes ─────────────────────────────────────────── */
        @keyframes ${uniqueId}-orb1 {
          0%,100% { transform: translate(0,0) scale(1); opacity:0.35; }
          33%     { transform: translate(18px,-24px) scale(1.15); opacity:0.6; }
          66%     { transform: translate(-10px,14px) scale(0.88); opacity:0.28; }
        }
        @keyframes ${uniqueId}-orb2 {
          0%,100% { transform: translate(0,0) scale(1); opacity:0.25; }
          50%     { transform: translate(-22px,18px) scale(1.2); opacity:0.5; }
        }
        @keyframes ${uniqueId}-pulse-ring {
          0%   { transform: scale(0.92); opacity:0.5; }
          50%  { transform: scale(1.04); opacity:0.2; }
          100% { transform: scale(0.92); opacity:0.5; }
        }
        @keyframes ${uniqueId}-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ${uniqueId}-dot-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(${cfg.rgb},0.7); }
          50%     { box-shadow: 0 0 0 6px rgba(${cfg.rgb},0); }
        }
        @keyframes ${uniqueId}-bar-shine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes ${uniqueId}-scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }

        /* ─ Card root ─────────────────────────────────────────── */
        .${uniqueId}-root {
          position: relative;
          background: linear-gradient(155deg, #090e1c 0%, #0c1424 45%, #07101e 100%);
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 0 0 1px rgba(${cfg.rgb},0.0),
            0 0 60px rgba(${cfg.rgb},0.12),
            0 32px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.06);
          overflow: hidden;
          cursor: pointer;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', sans-serif;
          transition:
            transform 0.4s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.4s ease;
        }
        .${uniqueId}-root:hover {
          transform: translateY(-4px) scale(1.008);
          box-shadow:
            0 0 0 1px rgba(${cfg.rgb},0.28),
            0 0 100px rgba(${cfg.rgb},0.2),
            0 40px 100px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        /* ─ Top accent bar ─────────────────────────────────────── */
        .${uniqueId}-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, ${cfg.arcA}, ${cfg.arcB}, ${cfg.arcA});
          background-size: 200% 100%;
          animation: ${uniqueId}-shimmer 3s linear infinite;
          opacity: 0.9;
        }

        /* ─ Noise grain overlay ────────────────────────────────── */
        .${uniqueId}-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
          pointer-events: none;
          opacity: 0.6;
          mix-blend-mode: overlay;
        }

        /* ─ Scanline sweep ─────────────────────────────────────── */
        .${uniqueId}-scanline {
          position: absolute; left:0; right:0;
          height: 80px;
          background: linear-gradient(180deg, transparent, rgba(${cfg.rgb},0.04), transparent);
          pointer-events: none;
          animation: ${uniqueId}-scanline 6s linear infinite;
        }

        /* ─ Inner content ─────────────────────────────────────── */
        .${uniqueId}-inner {
          position: relative;
          z-index: 2;
          padding: 26px 28px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* ─ Progress bar fill animation ───────────────────────── */
        .${uniqueId}-bar-fill {
          height: 100%;
          border-radius: 100px;
          background: linear-gradient(90deg, ${cfg.arcA}90, ${cfg.arcB});
          box-shadow: 0 0 16px rgba(${cfg.rgb},0.6), 0 0 4px rgba(${cfg.rgb},0.4);
          width: 0%;
          transition: width 1.8s cubic-bezier(0.16,1,0.3,1) 1s;
          position: relative;
          overflow: hidden;
        }
        .${uniqueId}-root.revealed .${uniqueId}-bar-fill {
          width: ${barPct}%;
        }
        .${uniqueId}-bar-shine {
          position: absolute; top:0; bottom:0; width:30%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: ${uniqueId}-bar-shine 2.2s ease 2.2s infinite;
        }

        /* ─ Score text glow ───────────────────────────────────── */
        .${uniqueId}-score-num {
          font-size: 84px;
          font-weight: 900;
          line-height: 1;
          color: #fff;
          letter-spacing: -4px;
          font-variant-numeric: tabular-nums;
          text-shadow:
            0 0 40px rgba(${cfg.rgb},0.6),
            0 0 80px rgba(${cfg.rgb},0.25);
          opacity: ${revealed ? 1 : 0};
          transform: ${revealed ? 'scale(1)' : 'scale(0.88)'};
          transition: opacity 0.6s ease 0.5s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.5s;
        }
      `}</style>

      <div
        className={`${uniqueId}-root${revealed ? ' revealed' : ''}`}
        onClick={onDeepDive}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Grain texture */}
        <div className={`${uniqueId}-grain`} />
        {/* Scanline sweep */}
        <div className={`${uniqueId}-scanline`} />
        {/* Top shimmer accent */}
        <div className={`${uniqueId}-accent`} />

        {/* ── Floating ambient orbs ── */}
        <FloatingOrb style={{
          width: 260, height: 260,
          top: -60, right: -60,
          background: `radial-gradient(circle, rgba(${cfg.rgb},0.14) 0%, transparent 70%)`,
          animation: `${uniqueId}-orb1 9s ease-in-out infinite`,
        }} />
        <FloatingOrb style={{
          width: 200, height: 200,
          bottom: -80, left: -40,
          background: `radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)`,
          animation: `${uniqueId}-orb2 12s ease-in-out infinite 2s`,
        }} />

        <div className={`${uniqueId}-inner`}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.24em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
              }}>
                Baseline Score
              </span>
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '2px 8px',
                borderRadius: '100px', background: 'rgba(99,102,241,0.14)',
                color: 'rgba(165,180,252,0.8)', border: '1px solid rgba(99,102,241,0.28)',
                letterSpacing: '0.1em',
              }}>BETA</span>
            </div>

            {/* Weekly gain */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(61,232,140,0.08)', border: '1px solid rgba(61,232,140,0.2)',
              borderRadius: '100px', padding: '4px 10px',
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.5s ease 2.8s',
            }}>
              <span style={{ fontSize: '10px', color: '#3de88c' }}>▲</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#3de88c', letterSpacing: '0.02em' }}>
                +{weeklyGain} this week
              </span>
            </div>
          </div>

          {/* ── Arc + Score center ── */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '4px' }}>
            {/* Arc SVG */}
            <PremiumArc score={score} cfg={cfg} revealed={revealed} />

            {/* Pulse ring behind arc */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: '170px', height: '170px', borderRadius: '50%',
                border: `1px solid rgba(${cfg.rgb},0.2)`,
                animation: `${uniqueId}-pulse-ring 4s ease-in-out infinite`,
              }} />
            </div>

            {/* Center score block */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '2px',
            }}>
              {/* Score number */}
              <div className={`${uniqueId}-score-num`}>
                {displayScore}
              </div>

              {/* / 100 */}
              <div style={{
                fontSize: '13px', fontWeight: 500,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.06em',
                opacity: revealed ? 1 : 0,
                transition: 'opacity 0.4s ease 1.2s',
              }}>
                / 100
              </div>

              {/* Status badge — inside arc center */}
              <div style={{
                marginTop: '6px',
                display: 'flex', alignItems: 'center', gap: '7px',
                background: `rgba(${cfg.rgb},0.1)`,
                border: `1px solid rgba(${cfg.rgb},0.3)`,
                borderRadius: '100px',
                padding: '5px 13px',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(6px)',
                transition: 'opacity 0.5s ease 1.4s, transform 0.5s ease 1.4s',
              }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: cfg.color,
                  animation: `${uniqueId}-dot-pulse 2s infinite`,
                }} />
                <span style={{
                  fontSize: '12px', fontWeight: 700,
                  color: cfg.color, letterSpacing: '0.06em',
                }}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* ── Level milestones ── */}
          <div style={{
            marginBottom: '20px',
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.5s ease 1.8s',
          }}>
            <MilestoneDots score={score} status={status} cfg={cfg} />
          </div>

          {/* ── Progress to next level ── */}
          {nextLabel && (
            <div style={{
              marginBottom: '20px',
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.5s ease 2s',
            }}>
              {/* Progress header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: '10px',
              }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                    Next level:&nbsp;
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: STATUS[nextLabel].color }}>
                    {nextLabel}
                  </span>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: cfg.color,
                  background: `rgba(${cfg.rgb},0.09)`,
                  padding: '3px 9px', borderRadius: '100px',
                  border: `1px solid rgba(${cfg.rgb},0.2)`,
                }}>
                  ⚡ {pointsLeft} pts
                </span>
              </div>

              {/* Progress track */}
              <div style={{
                height: '6px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '100px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div className={`${uniqueId}-bar-fill`}>
                  <div className={`${uniqueId}-bar-shine`} />
                </div>
              </div>

              {/* Motivational line */}
              <div style={{
                marginTop: '8px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.28)',
                fontStyle: 'italic',
              }}>
                Push to <strong style={{ color: STATUS[nextLabel].color, fontStyle: 'normal' }}>{nextLabel}</strong> — only <strong style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'normal' }}>{pointsLeft} points</strong> separate you.
              </div>
            </div>
          )}

          {/* ── Divider ── */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)',
            marginBottom: '16px',
          }} />

          {/* ── Insight chips row ── */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <InsightChip
              icon="🌟" label="Biggest Boost"
              value={`${biggestBoost}  +${biggestBoostGain}`}
              color="#3de88c"
              delay={2400}
            />
            <InsightChip
              icon="🏆" label="Age Group Rank"
              value={`Top ${topPercentage}%`}
              color="#c084fc"
              delay={2600}
            />
          </div>

          {/* ── CTA Footer ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px 0 2px',
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.5s ease 3s',
          }}>
            <span style={{
              fontSize: '11px', fontWeight: 500,
              color: `rgba(${cfg.rgb},0.55)`,
              letterSpacing: '0.10em', textTransform: 'uppercase',
            }}>
              Tap to explore your full breakdown
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={`rgba(${cfg.rgb},0.55)`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

        </div>
      </div>
    </>
  );
};

export default BaselineScoreCard;
