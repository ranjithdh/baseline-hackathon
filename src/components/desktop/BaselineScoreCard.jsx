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
          border-radius: var(--ui-radius);
          padding: var(--ui-card-padding);
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow: hidden;
          background: var(--ui-bg-gradient);
          border: 1px solid var(--ui-border);
          box-shadow: var(--ui-shadow-elevated);
          font-family: var(--font-main);
        }
        .bsc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 85% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        /* ── Header ── */
        .bsc-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bsc-title {
          font-size: var(--ui-font-size-sm);
          font-weight: var(--ui-heading);
          color: #fff;
          letter-spacing: -0.01em;
        }
        .bsc-beta {
          font-family: var(--font-mono);
          font-size: var(--ui-font-size-xs);
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.12);
          color: var(--ui-accent);
          border: 1px solid rgba(59, 130, 246, 0.15);
        }
        .bsc-info-btn {
          margin-left: auto;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.4);
          border: 1px solid var(--ui-border);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bsc-info-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
          transform: scale(1.05);
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
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: var(--ui-font-size-xs);
          font-weight: 800;
          text-transform: uppercase;
          width: fit-content;
        }
        .bsc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .bsc-headline {
          font-size: var(--ui-font-size-sm);
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.45);
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
          color: rgba(228,228,231,0.4);
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
          color: rgba(228,228,231,0.4);
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
          color: rgba(228,228,231,0.4);
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
          gap: 8px;
          padding: 10px 24px;
          border-radius: 12px;
          background: var(--ui-accent-gradient);
          color: #fff;
          font-size: var(--ui-font-size-sm);
          font-weight: 800;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px var(--ui-accent-glow);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          white-space: nowrap;
        }
        .bsc-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px var(--ui-accent-glow);
        }
        .bsc-cta-arrow {
          transition: transform 0.25s ease;
          font-size: 18px;
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
