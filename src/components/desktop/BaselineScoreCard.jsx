import React, { useEffect, useRef, useState } from 'react';

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  'High Alert': {
    color: '#ff6060', rgb: '255,96,96',
    arcGold: '#e05010', arcRed: '#7a1010',
    badge: '⚡', badgeBg: 'rgba(180,40,20,0.18)', badgeBorder: 'rgba(200,60,30,0.45)', badgeColor: '#ff8060',
    tagTitle: 'Your body needs\nattention now.',
    tagSub: 'Early action creates the biggest impact.',
    motiveLine: 'Small steps today build a healthier tomorrow.',
    next: 'Constrained', nextAt: 50,
  },
  'Constrained': {
    color: '#e8c030', rgb: '232,192,48',
    arcGold: '#d4a012', arcRed: '#8b4008',
    badge: '▲', badgeBg: 'rgba(180,140,20,0.15)', badgeBorder: 'rgba(210,160,30,0.4)', badgeColor: '#e8c030',
    tagTitle: 'Building back.\nKeep going.',
    tagSub: 'Progress is happening beneath the surface.',
    motiveLine: 'Consistency is the bridge between goals and results.',
    next: 'Stable', nextAt: 65,
  },
  'Stable': {
    color: '#a0c840', rgb: '160,200,64',
    arcGold: '#d4a012', arcRed: '#8b2808',
    badge: '★', badgeBg: 'rgba(160,160,30,0.14)', badgeBorder: 'rgba(185,160,40,0.42)', badgeColor: '#c8b840',
    tagTitle: 'Good foundations.\nReal room to grow.',
    tagSub: "You're on track for something great.",
    motiveLine: 'Keep pursuing your health goals to reach peak wellness.',
    next: 'Strong', nextAt: 75,
  },
  'Strong': {
    color: '#3a9050', rgb: '58,144,80',
    arcGold: '#c8a010', arcRed: '#1e6030',
    badge: '◆', badgeBg: 'rgba(40,140,60,0.14)', badgeBorder: 'rgba(60,160,80,0.38)', badgeColor: '#50b868',
    tagTitle: "You're thriving.\nKeep it up.",
    tagSub: 'Your body is performing at a high level.',
    motiveLine: 'Elite health is within your reach.',
    next: 'Elite', nextAt: 85,
  },
  'Elite': {
    color: '#20b8c8', rgb: '32,184,200',
    arcGold: '#20a0c0', arcRed: '#1050a0',
    badge: '✦', badgeBg: 'rgba(20,150,180,0.14)', badgeBorder: 'rgba(30,170,200,0.38)', badgeColor: '#40c8d8',
    tagTitle: 'Peak performance.\nExceptional health.',
    tagSub: "You've reached the top tier.",
    motiveLine: "You're an inspiration. Maintain your excellence.",
    next: null, nextAt: 100,
  },
};

const LEVELS = ['High Alert', 'Constrained', 'Stable', 'Strong', 'Elite'];
const LEVEL_THRESHOLDS = [0, 50, 65, 75, 85, 100];

// ─── Segments for the progress track ──────────────────────────────────────────
const PROGRESS_SEGMENTS = [
  { label: 'Alert', min: 0, max: 50, width: 28, color: '#ff6060' },
  { label: 'Constrained', min: 50, max: 65, width: 16, color: '#e8c030' },
  { label: 'Stable', min: 65, max: 75, width: 14, color: '#a0c840' },
  { label: 'Strong', min: 75, max: 85, width: 14, color: '#3a9050' },
  { label: 'Elite', min: 85, max: 100, width: 28, color: '#20b8c8' },
];

// ─── useCountUp ───────────────────────────────────────────────────────────────
function useCountUp(target, { delay = 600, duration = 1800 } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame, startTime, started = false;
    const timer = setTimeout(() => {
      const tick = (ts) => {
        if (!started) { startTime = ts; started = true; }
        const p = Math.min((ts - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(target * ease));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [target, delay, duration]);
  return val;
}

// ─── Arc math ─────────────────────────────────────────────────────────────────
const SWEEP_DEG = 270;
const GAP_DEG = 90;
const START_DEG = 90 + GAP_DEG / 2;

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

// ─── WarmArc ──────────────────────────────────────────────────────────────────
// The large warm gold→red arc matching the screenshot aesthetic
const WarmArc = ({ score, cfg, revealed, uid }) => {
  const SIZE = 190;
  const CX = SIZE / 2, CY = SIZE / 2 + 8;
  const R = 76;

  const fillFrac = revealed ? score / 100 : 0;
  const fillEnd = START_DEG + SWEEP_DEG * fillFrac;
  const arcEnd = START_DEG + SWEEP_DEG;

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}>
      <defs>
        {/* Warm gradient: gold → orange → deep-red */}
        <linearGradient id={`${uid}-arc-grad`} x1="0%" y1="100%" x2="80%" y2="0%">
          <stop offset="0%" stopColor="#d4a012" />
          <stop offset="50%" stopColor="#c86420" />
          <stop offset="100%" stopColor={cfg.arcRed} />
        </linearGradient>
        {/* Softer glow filter */}
        <filter id={`${uid}-arc-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Inner ambient */}
        <radialGradient id={`${uid}-center-glow`} cx="50%" cy="62%" r="48%">
          <stop offset="0%" stopColor="rgba(210,140,30,0.18)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Ambient center glow */}
      <circle cx={CX} cy={CY} r={R - 8} fill={`url(#${uid}-center-glow)`} />

      {/* Track (very faint warm) */}
      <path d={describeArc(CX, CY, R, START_DEG, arcEnd)}
        fill="none" stroke="rgba(220,160,60,0.09)" strokeWidth="16" strokeLinecap="round" />

      {/* Glow halo behind arc */}
      {revealed && score > 2 && (
        <path d={describeArc(CX, CY, R, START_DEG, fillEnd)}
          fill="none"
          stroke="rgba(200,110,20,0.38)"
          strokeWidth="24" strokeLinecap="round"
          filter={`url(#${uid}-arc-glow)`} />
      )}

      {/* Main filled arc */}
      {revealed && score > 2 && (
        <path d={describeArc(CX, CY, R, START_DEG, fillEnd)}
          fill="none"
          stroke={`url(#${uid}-arc-grad)`}
          strokeWidth="16" strokeLinecap="round" />
      )}
    </svg>
  );
};

// ─── SegmentedProgress ────────────────────────────────────────────────────────
const SegmentedProgress = ({ score, status, revealed }) => {
  const scorePct = revealed ? score : 0;
  const activeSeg = PROGRESS_SEGMENTS.find(
    (s) => status === (s.label === 'Alert' ? 'High Alert' : s.label)
  ) || PROGRESS_SEGMENTS[2];

  return (
    <div style={{ width: '100%' }}>
      {/* Label row */}
      <div style={{
        display: 'flex', width: '100%', marginBottom: '8px',
        opacity: revealed ? 1 : 0, transition: 'opacity 0.6s ease 1.2s',
      }}>
        {PROGRESS_SEGMENTS.map((s) => {
          const isActive = status === (s.label === 'Alert' ? 'High Alert' : s.label);
          return (
            <div key={s.label} style={{
              flex: s.width,
              textAlign: 'center',
              fontSize: '7.5px',
              fontWeight: isActive ? 800 : 500,
              color: isActive ? s.color : 'rgba(220,180,120,0.22)',
              letterSpacing: isActive ? '0.10em' : '0.06em',
              textTransform: 'uppercase',
              transition: 'color 0.4s',
              position: 'relative',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {s.label}
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: '-5px', left: '50%',
                  transform: 'translateX(-50%)',
                  width: '3px', height: '3px', borderRadius: '50%',
                  background: s.color, boxShadow: `0 0 5px ${s.color}`,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Pill track */}
      <div style={{
        position: 'relative', height: '12px', width: '100%',
        display: 'flex', gap: '3px', alignItems: 'center',
      }}>
        {PROGRESS_SEGMENTS.map((s, i) => {
          const fillAmt = Math.min(Math.max((scorePct - s.min) / (s.max - s.min), 0), 1);
          const isEmpty = scorePct <= s.min;
          const isActive = status === (s.label === 'Alert' ? 'High Alert' : s.label);
          const isFull = scorePct >= s.max;

          return (
            <div key={s.label} style={{
              flex: s.width,
              height: isActive ? '12px' : '7px',
              borderRadius: i === 0 ? '100px 3px 3px 100px'
                : i === PROGRESS_SEGMENTS.length - 1 ? '3px 100px 100px 3px'
                  : '3px',
              background: `${s.color}18`,
              position: 'relative', overflow: 'hidden',
              transition: 'height 0.3s ease',
              flexShrink: 0,
            }}>
              {!isEmpty && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  width: revealed ? `${fillAmt * 100}%` : '0%',
                  background: isFull ? s.color : `linear-gradient(90deg, ${s.color}88, ${s.color})`,
                  transition: 'width 2s cubic-bezier(0.16,1,0.3,1) 0.6s',
                  boxShadow: isActive ? `0 0 10px ${s.color}90` : 'none',
                }}>
                  {isActive && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)',
                      animation: 'bsc-shimmer 2.5s ease-in-out infinite',
                    }} />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Score dot indicator */}
        <div style={{
          position: 'absolute',
          left: `${scorePct}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '17px', height: '17px',
          borderRadius: '50%',
          background: '#fff',
          border: `2.5px solid ${activeSeg.color}`,
          boxShadow: `0 0 10px ${activeSeg.color}, 0 0 24px ${activeSeg.color}60`,
          transition: 'left 2s cubic-bezier(0.16,1,0.3,1) 0.6s',
          zIndex: 10,
        }} />
      </div>
    </div>
  );
};

// ─── InfoModal – "What is Baseline Score" ────────────────────────────────────
const InfoModal = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }, []);
  const handleClose = () => { setVisible(false); setTimeout(onClose, 350); };

  return (
    <div onClick={handleClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: '480px', borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      }}>
        {/* Hero banner */}
        <div style={{
          height: '180px', position: 'relative',
          background: 'linear-gradient(135deg, #3d1a0a 0%, #6b2a1a 40%, #8c3a20 70%, #4a1206 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          <h2 style={{
            position: 'relative', zIndex: 1,
            fontSize: '22px', fontWeight: 800, color: '#fff',
            textAlign: 'center', textShadow: '0 2px 20px rgba(0,0,0,0.5)', padding: '0 24px',
          }}>
            What is Baseline Score?
          </h2>
          <button onClick={handleClose} style={{
            position: 'absolute', top: '14px', right: '14px',
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.8)', fontSize: '15px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
          }}>✕</button>
        </div>
        {/* Body */}
        <div style={{ background: '#111318', padding: '28px 28px 32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(245,200,66,0.10)', border: '1px solid rgba(245,200,66,0.28)',
            borderRadius: '100px', padding: '6px 14px', marginBottom: '20px',
          }}>
            <span style={{ fontSize: '14px' }}>💳</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f5c842', letterSpacing: '0.05em' }}>
              Like CIBIL Score — but for your body health
            </span>
          </div>
          {[
            { icon: '🧬', text: "The Baseline Score is Deep Holistics' proprietary health score, developed through clinical research, systems-based analysis, and years of preventive health insight." },
            { icon: '🔗', text: 'Instead of looking at individual markers in isolation, it brings together data across key body systems to reflect how your body is actually functioning today.' },
            { icon: '🎯', text: 'This allows you to move beyond "normal" ranges and focus on what needs attention now.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: i < 2 ? '18px' : 0 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
              }}>{item.icon}</div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.62)', fontWeight: 400 }}>{item.text}</p>
            </div>
          ))}
          <div style={{
            marginTop: '24px', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px',
            display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginBottom: '4px' }}>CIBIL Score</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#3de88c' }}>Finance</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Credit health</div>
            </div>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: 'rgba(255,255,255,0.4)',
            }}>≈</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginBottom: '4px' }}>Baseline Score</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#f5c842' }}>Body</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Body health</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Card ────────────────────────────────────────────────────────────────
const BaselineScoreCard = ({
  score = 65,
  status = 'Stable',
  weeklyGain = 4,
  biggestBoost = 'Vitamin D3 + K2',
  biggestBoostGain = 7,
  topPercentage = 35,
  potentialScore = 80,
  onSimulate,
  onDeepDive,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const displayScore = useCountUp(score, { delay: 500, duration: 2000 });

  useEffect(() => { const t = setTimeout(() => setRevealed(true), 150); return () => clearTimeout(t); }, []);

  const cfg = STATUS[status] || STATUS['Stable'];
  const nextLabel = cfg.next;
  const gap = Math.max(potentialScore - score, 0);
  const potLabel = nextLabel || 'Elite';
  const potCfg = STATUS[potLabel] || STATUS['Strong'];
  const uid = useRef(`bsc-${Math.random().toString(36).slice(2)}`).current;

  // Derive active segment color for dot indicator
  const activeSeg = PROGRESS_SEGMENTS.find(
    (s) => status === (s.label === 'Alert' ? 'High Alert' : s.label)
  ) || PROGRESS_SEGMENTS[2];

  return (
    <>
      <style>{`
        @keyframes bsc-shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        @keyframes ${uid}-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes ${uid}-scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        @keyframes ${uid}-topbar {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ${uid}-info-pulse {
          0%,100% { box-shadow: 0 0 0 0 ${cfg.badgeBorder}; }
          50%     { box-shadow: 0 0 0 4px transparent; }
        }
        @keyframes ${uid}-sim-shine {
          0%   { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(350%) skewX(-15deg); }
        }
        @keyframes ${uid}-dot-pulse {
          0%,100% { box-shadow: 0 0 0 0 ${cfg.badgeBorder}; }
          50%     { box-shadow: 0 0 0 5px transparent; }
        }

        /* ── Card shell ── */
        .${uid}-card {
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', sans-serif;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;

          /* Warm dark-brown background matching the screenshot */
          background:
            radial-gradient(ellipse at 30% 25%, rgba(80,30,10,0.90) 0%, transparent 65%),
            radial-gradient(ellipse at 75% 70%, rgba(50,15,5,0.70) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 50%, #1e0c04 0%, #130804 50%, #0c0502 100%);

          border: 1px solid rgba(200,140,60,0.12);
          box-shadow:
            0 0 60px rgba(180,80,20,0.12),
            0 32px 80px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(220,160,80,0.08);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
        }
        .${uid}-card:hover {
          transform: translateY(-4px) scale(1.005);
          box-shadow:
            0 0 80px rgba(200,110,30,0.20),
            0 40px 100px rgba(0,0,0,0.75),
            inset 0 1px 0 rgba(220,160,80,0.12);
        }

        /* Grain texture overlay */
        .${uid}-grain {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");
          background-size: 160px 160px;
          mix-blend-mode: overlay; opacity: 0.9; z-index: 0;
        }

        /* Warm amber scanline */
        .${uid}-scanline {
          position: absolute; left: 0; right: 0; height: 60px;
          background: linear-gradient(180deg, transparent, rgba(210,140,40,0.03), transparent);
          pointer-events: none; z-index: 1;
          animation: ${uid}-scanline 10s linear infinite;
        }

        /* Top shimmer bar */
        .${uid}-topbar {
          position: absolute; top: 0; left: 0; right: 0; height: 2.5px;
          background: linear-gradient(90deg, #c87020, #d4a012, #c8600c, #d4a012);
          background-size: 200% 100%;
          animation: ${uid}-topbar 4s linear infinite;
          opacity: 0.8; z-index: 3;
        }

        /* Info button */
        .${uid}-info-btn {
          width: 20px; height: 20px; border-radius: 50%;
          background: ${cfg.badgeBg};
          border: 1.5px solid ${cfg.badgeBorder};
          color: ${cfg.badgeColor};
          font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
          animation: ${uid}-info-pulse 3s ease-in-out infinite;
          font-style: italic; font-family: Georgia, serif;
        }
        .${uid}-info-btn:hover { background: ${cfg.badgeBg}; transform: scale(1.15); }

        /* Inner content wrapper */
        .${uid}-inner {
          position: relative; z-index: 2;
          padding: 20px 22px 18px;
          display: flex; flex-direction: column; flex: 1;
        }
      `}</style>

      <div className={`${uid}-card`} onClick={onDeepDive}>
        <div className={`${uid}-grain`} />
        <div className={`${uid}-scanline`} />
        <div className={`${uid}-topbar`} />

        <div className={`${uid}-inner`}>

          {/* ── Top header: label + BETA + ⓘ ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '14px',
          }}>
            {/* Left: dash + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '18px', height: '1px',
                background: 'rgba(200,150,70,0.45)',
              }} />
              <span style={{
                fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.20em',
                textTransform: 'uppercase', color: 'rgba(210,170,100,0.55)',
              }}>
                Your Baseline Score
              </span>
            </div>
            {/* Right: BETA + ⓘ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{
                fontSize: '7.5px', fontWeight: 700, padding: '2px 8px',
                borderRadius: '100px', background: 'rgba(99,102,241,0.12)',
                color: 'rgba(165,180,252,0.75)', border: '1px solid rgba(99,102,241,0.22)',
                letterSpacing: '0.12em',
              }}>BETA</span>
              <button
                className={`${uid}-info-btn`}
                onClick={(e) => { e.stopPropagation(); setShowInfo(true); }}
                title="What is Baseline Score?"
              >i</button>
            </div>
          </div>

          {/* ── Thin divider ── */}
          <div style={{
            height: '1px', marginBottom: '18px',
            background: 'linear-gradient(90deg, rgba(200,150,60,0.18), rgba(200,150,60,0.06) 60%, transparent)',
          }} />

          {/* ── Main hero row: Arc left + Content right ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', flex: 1 }}>

            {/* Arc + score center */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <WarmArc score={score} cfg={cfg} revealed={revealed} uid={uid} />
              {/* Score overlaid in arc center */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                paddingTop: '16px',
              }}>
                <div style={{
                  fontSize: '52px', fontWeight: 900, lineHeight: 1,
                  color: '#f0e4cc',
                  letterSpacing: '-3px',
                  textShadow: '0 0 30px rgba(210,140,40,0.45), 0 2px 4px rgba(0,0,0,0.5)',
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'scale(1)' : 'scale(0.85)',
                  transition: 'opacity 0.6s ease 0.5s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.5s',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {displayScore}
                </div>
                <div style={{
                  fontSize: '10px', fontWeight: 500,
                  color: 'rgba(210,175,120,0.38)', letterSpacing: '0.04em',
                  marginTop: '1px',
                  opacity: revealed ? 1 : 0,
                  transition: 'opacity 0.4s ease 1.2s',
                }}>/ 100</div>
              </div>
            </div>

            {/* Right content */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              gap: '10px', paddingTop: '10px', minWidth: 0,
            }}>

              {/* Status badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: cfg.badgeBg,
                border: `1px solid ${cfg.badgeBorder}`,
                borderRadius: '100px',
                padding: '5px 13px',
                width: 'fit-content',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s ease 1s, transform 0.5s ease 1s',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: cfg.badgeColor,
                  animation: `${uid}-dot-pulse 2.5s infinite`,
                }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: cfg.badgeColor, letterSpacing: '0.10em' }}>
                  {cfg.badge} {status.toUpperCase()}
                </span>
              </div>

              {/* Bold tagline – matches "Good foundations. Real room to grow." style */}
              <div style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.6s ease 1.2s, transform 0.6s ease 1.2s',
              }}>
                {cfg.tagTitle.split('\n').map((line, i) => (
                  <div key={i} style={{
                    fontSize: '17px', fontWeight: 800,
                    color: '#f0e0c4',
                    lineHeight: 1.25,
                    letterSpacing: '-0.3px',
                    textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                  }}>{line}</div>
                ))}
              </div>

              {/* Subtitle */}
              <div style={{
                fontSize: '11.5px', color: 'rgba(210,170,110,0.50)',
                lineHeight: 1.5, fontWeight: 400,
                opacity: revealed ? 1 : 0,
                transition: 'opacity 0.5s ease 1.5s',
              }}>
                {cfg.tagSub}
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{
            height: '1px', margin: '16px 0',
            background: 'linear-gradient(90deg, transparent, rgba(200,150,60,0.12) 30%, rgba(200,150,60,0.12) 70%, transparent)',
          }} />


          {/* ── Bottom info panel (frosted row – like screenshot) ── */}
          <div style={{
            background: 'rgba(255,220,150,0.04)',
            border: '1px solid rgba(200,150,60,0.12)',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1px 1fr',
            gap: '12px',
            alignItems: 'center',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease 2.2s, transform 0.5s ease 2.2s',
          }}>
            {/* Left: potential + simulate */}


            {/* Right: top % + biggest boost */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'rgba(210,175,110,0.42)', marginBottom: '3px' }}>
                🏆 Age Group Rank
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#f0e0c4' }}>
                Top <span style={{ color: '#c084fc' }}>{topPercentage}%</span>
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(210,170,100,0.38)', marginTop: '2px' }}>
                in your age group
              </div>
            </div>

            {/* Center divider */}
            <div style={{ width: '1px', height: '44px', background: 'rgba(200,150,60,0.15)', justifySelf: 'center' }} />


            <div>
              <div style={{ fontSize: '11px', color: 'rgba(210,175,110,0.55)', marginBottom: '3px' }}>
                Your potential:{' '}
                <span style={{ fontWeight: 800, color: potCfg.color }}>{potLabel}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: potCfg.color }}>
                  {gap} pts
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(210,175,100,0.45)', fontWeight: 500 }}>
                  to reach your potential
                </span>
              </div>
              {/* Simulate button – inline text style */}
              <button
                onClick={(e) => { e.stopPropagation(); onSimulate?.(); }}
                style={{
                  marginTop: '7px',
                  background: 'none', border: 'none', padding: 0,
                  display: 'flex', alignItems: 'center', gap: '5px',
                  color: potCfg.color, fontSize: '11px', fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.04em',
                  opacity: 0.85, transition: 'opacity 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Simulate it
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>



          </div>

          {/* ── Biggest Boost chip ── */}
          {/* <div style={{
            marginTop: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.5s ease 2.5s',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,220,100,0.05)',
              border: '1px solid rgba(200,160,50,0.12)',
              borderRadius: '100px', padding: '5px 11px',
            }}>
              <span style={{ fontSize: '9px' }}>🌟</span>
              <span style={{ fontSize: '9.5px', color: 'rgba(210,175,100,0.55)', fontWeight: 500 }}>Biggest Boost</span>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'rgba(240,220,160,0.75)' }}>
                {biggestBoost}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#6abf70' }}>+{biggestBoostGain}</span>
            </div>
          </div> */}

          {/* ── Motivational footer line ── */}
          <div style={{
            marginTop: '12px', paddingTop: '10px',
            borderTop: '1px solid rgba(200,150,60,0.07)',
            textAlign: 'center',
            fontSize: '10px', color: 'rgba(210,170,100,0.32)',
            fontWeight: 400, letterSpacing: '0.04em',
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.5s ease 2.8s',
          }}>
            {cfg.motiveLine}
          </div>

        </div>
      </div>

      {/* ── Info Modal ── */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </>
  );
};

export default BaselineScoreCard;
