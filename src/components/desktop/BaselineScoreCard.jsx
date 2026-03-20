import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import BaselineScoreInfoOverlay from './BaselineScoreInfoOverlay';


// ── Arc helpers ──────────────────────────────────────────────
const RADIUS = 35;
const CIRC = 2 * Math.PI * RADIUS;
const ARC_VISIBLE = CIRC * (270 / 360);
const GAP = CIRC - ARC_VISIBLE;
const getArcOffset = (pct) => CIRC - (pct / 100) * ARC_VISIBLE;

// ── Score ranges & colors ────────────────────────────────────
const RANGES = [
  { label: 'Compromised', min: 0, max: 50, color: '#ee7c64', flex: 5 },
  { label: 'Constrained', min: 50, max: 65, color: '#f9c56b', flex: 1.5 },
  { label: 'Stable', min: 65, max: 75, color: '#4ade80', flex: 1 },
  { label: 'Robust', min: 75, max: 85, color: '#2d8a57', flex: 1 },
  { label: 'Elite', min: 85, max: 100, color: '#139991', flex: 1.5 },
];

function getStatusColor(status) {
  const map = {
    Stable: '#4ade80',
    Robust: '#2d8a57',
    Elite: '#139991',
    Constrained: '#f9c56b',
    Compromised: '#ee7c64',
  };
  return map[status] || '#4ade80';
}

// Compute the % position of a score on the bar (0–100 mapped to 0%–100%)
function scoreToPct(score) {
  return Math.min(Math.max(score, 0), 100);
}

// ── Component ────────────────────────────────────────────────
const BaselineScoreCard = ({
  score = 65,
  status = 'Stable',
  headline = "You're doing well — with a few focused changes you can move from Stable to Robust.",
  pointsToGrow = 10,
  targetLevel = 'Robust',
  onTap,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  const arcOffset = revealed ? getArcOffset(score) : CIRC;
  const indicatorPct = scoreToPct(score); // e.g. 65 → 65%
  const ringColor = getStatusColor(status);

  return (
    <>
      <style>{`
        /* ── Card Shell ── */
        .bsc-card {
          position: relative;
          border-radius: 20px;
          padding: 18px 22px 16px;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #0f1729 0%, #111827 55%, #0e1a3a 100%);
          border: 1px solid rgba(99,102,241,0.22);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.06) inset;
        }
        .bsc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 85% 0%, rgba(99,102,241,0.12) 0%, transparent 55%);
          pointer-events: none;
        }

        /* ── Header ── */
        .bsc-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bsc-title {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        .bsc-beta {
          font-family: var(--font-mono);
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 1px 6px;
          border-radius: 100px;
          background: rgba(43, 127, 255, 0.12);
          color: #4c93ff;
          border: 1px solid rgba(43, 127, 255, 0.28);
        }
        .bsc-info-btn {
          margin-left: auto;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          z-index: 999;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto !important;
          cursor: pointer !important;
          background: rgba(255,255,255,0.06);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          backdrop-filter: blur(4px);
          overflow: hidden;
          animation: bsc-pulse 4s infinite ease-in-out;
        }
        .bsc-info-btn::after {
          content: '';
          position: absolute;
          top: -100%;
          left: -150%;
          width: 200%;
          height: 300%;
          background: linear-gradient(
            135deg,
            transparent 0%,
            transparent 45%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 55%,
            transparent 100%
          );
          transform: rotate(45deg);
          animation: bsc-glint 6s infinite ease-in-out;
          pointer-events: none;
        }
        @keyframes bsc-glint {
          0% { left: -150%; }
          15% { left: 150%; }
          100% { left: 150%; }
        }
        @keyframes bsc-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.1); }
          50% { box-shadow: 0 0 0 8px rgba(255,255,255,0), 0 4px 12px rgba(0,0,0,0.1); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 4px 12px rgba(0,0,0,0.1); }
        }
        .bsc-info-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
          transform: scale(1.08);
          box-shadow: 0 0 12px rgba(255,255,255,0.08);
          animation-play-state: paused;
        }
        .bsc-info-btn:active {
          transform: scale(0.95);
        }

        /* ── Score + Meta Row ── */
        .bsc-main-row {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* Arc ring */
        .bsc-score-area {
          flex-shrink: 0;
          display: flex;
          align-items: baseline;
          gap: 6px;
          padding-left: 4px;
        }
        .bsc-ring-svg {
          position: absolute;
          inset: 0;
          transform: rotate(135deg);
        }
        .bsc-ring-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
        }
        .bsc-score-num {
          font-family: var(--font-heading);
          font-size: 48px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.5s 0.8s, transform 0.5s 0.8s;
        }
        .bsc-score-num.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .bsc-score-denom {
          font-family: var(--font-mono);
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 4px;
        }

        /* Right‑side meta */
        .bsc-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        .bsc-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
        }
        .bsc-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
        .bsc-headline {
          font-family: var(--font-main);
          font-size: 11.5px;
          line-height: 1.45;
          color: rgba(255,255,255,0.5);
          font-weight: 400;
        }

        /* ── Scale Bar ── */
        .bsc-scale-wrap {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .bsc-scale-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .bsc-bar-outer {
          position: relative;
        }
        .bsc-bar-segments {
          display: flex;
          gap: 3px;
          height: 6px;
        }
        .bsc-seg {
          height: 100%;
          border-radius: 4px;
        }
        /* indicator needle */
        .bsc-needle-wrap {
          position: absolute;
          top: -8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateX(-50%);
          pointer-events: none;
          transition: left 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
        }
        .bsc-needle-tri {
          width: 0; height: 0;
          border-left: 4.5px solid transparent;
          border-right: 4.5px solid transparent;
          border-top: 6px solid currentColor;
        }
        /* numeric markers */
        .bsc-markers {
          position: relative;
          height: 14px;
          margin-top: 5px;
          font-family: var(--font-mono);
          font-size: 9px;
          color: rgba(255,255,255,0.3);
        }
        .bsc-mark {
          position: absolute;
          transform: translateX(-50%);
        }
        /* legend dots row */
        .bsc-legend {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .bsc-leg-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: rgba(255,255,255,0.4);
        }
        .bsc-leg-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Divider */
        .bsc-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* ── Footer ── */
        .bsc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .bsc-potential {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .bsc-pot-eyebrow {
          font-family: var(--font-mono);
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.3);
        }
        .bsc-pot-main {
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .bsc-pot-accent {
          color: #4ade80;
          filter: drop-shadow(0 0 8px rgba(74,222,128,0.5));
        }
        .bsc-pot-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
        }
        .bsc-cta {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1e40af 0%, #2b7fff 60%, #60a5fa 100%);
          color: #ffffff;
          font-family: var(--font-main);
          font-weight: 700;
          font-size: 12px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(43,127,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          white-space: nowrap;
        }
        .bsc-cta:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 28px rgba(43,127,255,0.5);
        }
        .bsc-cta-arrow {
          transition: transform 0.25s ease;
        }
        .bsc-cta:hover .bsc-cta-arrow {
          transform: translateX(3px);
        }
      `}</style>

      <div className="bsc-card" onClick={onTap}>

        {/* ── Header ── */}
        <div className="bsc-header">
          <span className="bsc-title">Your Health Score</span>
          <span className="bsc-beta">Beta</span>
          <div
      className="bsc-info-btn"
      onMouseDown={(e) => { e.stopPropagation(); }}
      onMouseUp={(e) => { e.stopPropagation(); }}
      onClick={(e) => { 
        console.log('Info clicked');
        e.preventDefault();
        e.stopPropagation(); 
        setIsInfoOpen(true); 
      }}
      role="button"
      aria-label="More information"
    >
      <Info size={16} strokeWidth={2.5} style={{ pointerEvents: 'none' }} />
    </div>
        </div>

        {/* ── Score Ring + Meta ── */}
        <div className="bsc-main-row">
          <div className="bsc-score-area">
            <span className={`bsc-score-num ${revealed ? 'visible' : ''}`}>{score}</span>
            <span className="bsc-score-denom">/ 100</span>
          </div>

          {/* Meta */}
          <div className="bsc-meta">
            <div
              className="bsc-status-pill"
              style={{
                background: `${ringColor}18`,
                color: ringColor,
                border: `1px solid ${ringColor}33`,
              }}
            >
              <span className="bsc-dot" style={{ background: ringColor }} />
              {status}
            </div>
            <p className="bsc-headline">{headline}</p>
          </div>
        </div>

        {/* ── Score Scale Bar ── */}
        <div className="bsc-scale-wrap">
          <span className="bsc-scale-label">Score Range</span>

          <div className="bsc-bar-outer" ref={barRef}>
            {/* Segments */}
            <div className="bsc-bar-segments">
              {RANGES.map((r) => (
                <div
                  key={r.label}
                  className="bsc-seg"
                  style={{ flex: r.flex, background: r.color }}
                />
              ))}
            </div>

            {/* Position needle */}
            <div
              className="bsc-needle-wrap"
              style={{ left: revealed ? `${indicatorPct}%` : `${indicatorPct}%` }}
            >
              <div className="bsc-needle-tri" style={{ color: ringColor }} />
            </div>
          </div>

          {/* Numeric markers */}
          <div className="bsc-markers">
            {[50, 65, 75, 85].map((v) => (
              <span key={v} className="bsc-mark" style={{ left: `${v}%` }}>{v}</span>
            ))}
          </div>

          {/* Legend */}
          <div className="bsc-legend">
            {RANGES.map((r) => (
              <div key={r.label} className="bsc-leg-item">
                <div className="bsc-leg-dot" style={{ background: r.color }} />
                {r.label}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="bsc-divider" />

        {/* ── Footer ── */}
        <div className="bsc-footer">
          <div className="bsc-potential" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)', paddingLeft: '0px', letterSpacing: '-0.01em' }}>
              <span style={{ color: '#4ade80' }}>+{pointsToGrow} points</span> to reach&nbsp;{targetLevel}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1 }}>
              {/* <span style={{ color: '#4ade80', fontSize: '11px', textShadow: '0 0 8px rgba(74,222,128,0.4)' }}>★</span> */}
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontFamily: 'var(--font-main)', lineHeight: 1.4 }}>
                Top <span style={{ color: '#fff', fontWeight: 800 }}>35%</span> in age Group | Better than <span style={{ color: '#fff', fontWeight: 800 }}>65%</span> of people your age
              </span>
            </div>
          </div>

          <button className="bsc-cta" onClick={onTap}>
            See how to improve
            <span className="bsc-cta-arrow">→</span>
          </button>
        </div>

      </div>

      <BaselineScoreInfoOverlay
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </>
  );
};

export default BaselineScoreCard;
