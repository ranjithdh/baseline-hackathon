import React, { useEffect, useState } from 'react';

// ── Arc helpers (same pattern as DesktopScoreHero) ─────────────
const ARC_CIRC    = 283;
const ARC_VISIBLE = 226;
const getArcOffset = (score) => ARC_CIRC - (score / 100) * ARC_VISIBLE;

const BaselineScoreCard = ({
  score          = 65,
  status         = 'Stable',
  nextLevel      = 'Strong (70)',
  progress       = 65,
  progressMax    = 70,
  weeklyGain     = 4,
  pointsToUnlock = 5,
  topPercentage  = 35,
  biggestBoost   = 'Vitamin D3 + K2',
  biggestBoostGain = 7,
  onImprove,
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  const arcOffset = revealed ? getArcOffset(score) : ARC_CIRC;
  const barPct    = Math.min((progress / progressMax) * 100, 100);

  return (
    <>
      <style>{`
        .bsc-root {
          background: linear-gradient(135deg, #0f1729 0%, #111827 55%, #0e1a3a 100%);
          border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.28);
          box-shadow: 0 0 48px rgba(99,102,241,0.09), 0 2px 24px rgba(0,0,0,0.4);
          padding: 28px 32px;
          height: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .bsc-main-row {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .bsc-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .bsc-main-row { flex-wrap: wrap; }
          .bsc-bottom-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="bsc-root">
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 85% 10%, rgba(99,102,241,0.14) 0%, transparent 55%)',
        }} />

        {/* ── Row 1: Label + BETA + weekly gain ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)',
          }}>
            Baseline Score
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 9px',
            borderRadius: '100px',
            background: 'rgba(99,102,241,0.18)',
            color: 'rgb(165,180,252)',
            border: '1px solid rgba(99,102,241,0.32)',
            letterSpacing: '0.08em',
          }}>
            BETA
          </span>

          {/* Weekly gain — pushed right */}
          <div style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: '5px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'rgb(74,222,128)',
            fontWeight: 600,
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.5s 2s',
          }}>
            <span style={{ fontSize: '10px' }}>▲</span>
            {weeklyGain} this week
          </div>
        </div>

        {/* ── Row 2: Arc + Score info ── */}
        <div className="bsc-main-row" style={{ flex: 1 }}>
          {/* Circular arc */}
          <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
            <svg
              width="120" height="120"
              viewBox="0 0 110 110"
              style={{ transform: 'rotate(-220deg)' }}
            >
              <defs>
                <linearGradient id="bscArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              {/* Track */}
              <circle
                cx="55" cy="55" r="45"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray="226 57"
              />
              {/* Fill */}
              <circle
                cx="55" cy="55" r="45"
                fill="none"
                stroke="url(#bscArcGrad)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={String(ARC_CIRC)}
                strokeDashoffset={arcOffset}
                style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            {/* Center score */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '38px',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1,
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(5px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.8s',
              }}>
                {score}
              </span>
            </div>
          </div>

          {/* Score meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Score + status */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: '10px',
              marginBottom: '6px',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(6px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 2s',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '34px', fontWeight: 700, color: 'white', lineHeight: 1,
              }}>
                {score}
              </span>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '26px', fontWeight: 600,
                color: 'rgb(74,222,128)',
              }}>
                {status}
              </span>
            </div>

            {/* Next level */}
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.48)',
              marginBottom: '16px',
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.4s 2.2s',
            }}>
              Next Level: <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{nextLevel}</strong>
            </div>

            {/* Progress bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '10px',
            }}>
              <div style={{
                flex: 1,
                height: '8px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '100px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  borderRadius: '100px',
                  background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)',
                  width: revealed ? `${barPct}%` : '0%',
                  transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
                  boxShadow: '0 0 10px rgba(99,102,241,0.55)',
                }} />
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.38)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {progress} / {progressMax}
              </span>
            </div>

            {/* Points to unlock */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'rgb(74,222,128)',
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.4s 2.4s',
            }}>
              <span>⚡</span>
              <span>{pointsToUnlock} points to unlock</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

        {/* ── Row 3: Insights + CTA ── */}
        <div className="bsc-bottom-row">
          {/* Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', color: 'rgba(255,255,255,0.55)',
            }}>
              <span>🏆</span>
              <span>You are in top <strong style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{topPercentage}%</strong> of your age group</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', color: 'rgba(255,255,255,0.55)',
            }}>
              <span>🌟</span>
              <span>Biggest Boost: <strong style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{biggestBoost}</strong> (+{biggestBoostGain})</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BaselineScoreCard;
