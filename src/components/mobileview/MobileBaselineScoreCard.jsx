import React, { useEffect, useState } from 'react';
import PrimaryButton from '../desktop/PrimaryButton';
import ScoreRangeBar from '../ScoreRangeBar';

// ── Arc helpers (same pattern as DesktopScoreHero) ─────────────
const ARC_CIRC = 283;
const ARC_VISIBLE = 226;
const getArcOffset = (score) => ARC_CIRC - (score / 100) * ARC_VISIBLE;

const MobileBaselineScoreCard = ({
  score = 65,
  status = 'Stable',
  nextLevel = 'Robust (70)',
  progress = 65,
  progressMax = 70,
  weeklyGain = 4,
  pointsToUnlock = 5,
  topPercentage = 35,
  biggestBoost = 'Vitamin D3 + K2',
  biggestBoostGain = 7,
  onImprove,
  showRangeBar = true,
  showActionButton = true,
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  const arcOffset = revealed ? getArcOffset(score) : ARC_CIRC;
  const barPct = Math.min((progress / progressMax) * 100, 100);

  return (
    <>
      <style>{`
        .mbsc-root {
          background: rgb(var(--card));
          border-radius: 24px;
          padding: 24px;
          height: auto;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mbsc-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mbsc-main-row {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .mbsc-stats-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .mbsc-bottom-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .mb-insight-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          text-align: left;
        }
        .mb-insight-item span:first-of-type {
          margin-top: 2px;
        }
        .mb-insight-item strong {
          color: #ffffff;
          font-weight: 600;
        }
      `}</style>

      <div className="mbsc-root">
        {/* Row 1: Label + BETA + Weekly Gain */}
        <div className="mbsc-header-row">
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}>
            Baseline Score
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            BETA
          </span>

        </div>


        {/* Row 2: Arc + Score info */}
        <div className="mbsc-main-row">
          {/* Circular arc */}
          <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
            <svg
              width="120" height="120"
              viewBox="0 0 110 110"
              style={{ transform: 'rotate(-220deg)' }}
            >
              <defs>
                <linearGradient id="mbscArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2B63FF" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <circle
                cx="55" cy="55" r="45"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="226 57"
              />
              <circle
                cx="55" cy="55" r="45"
                fill="none"
                stroke="url(#mbscArcGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={String(ARC_CIRC)}
                strokeDashoffset={arcOffset}
                style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '36px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1,
              }}>
                {score}
              </span>
            </div>
          </div>

          {/* Score stats group */}
          <div className="mbsc-stats-col">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#30A46C', fontFamily: 'var(--font-heading)' }}>{status}</span>
            </div>

            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
              Next Level: <span style={{ color: '#ffffff', fontWeight: 600 }}>{nextLevel}</span>
            </div>

            {/* Progress Bar Item */}
            <div style={{ width: '100%', marginBottom: '4px' }}>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ height: '100%', background: '#2B63FF', width: `${barPct}%`, borderRadius: '100px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
                <span>{progress}/{progressMax}</span>
              </div>
            </div>
          </div>
        </div>

        {showRangeBar && (
          <div style={{ padding: '0 4px' }}>
            <ScoreRangeBar score={score} showLegend={false} maxWidth="100%" className="!px-0" />
          </div>
        )}

        <div className="mbsc-bottom-row">
          <div className="mb-insight-item">
            <span>🌟</span>
            <span>Boost: <strong>{biggestBoost}</strong> (+{biggestBoostGain})</span>
          </div>
          <div className="mb-insight-item">
            <span>🏆</span>
            <span>Your result is lower than 73 percent of people who have measured their baseline.</span>
          </div>
        </div>

        {/* Action Button */}
        {showActionButton && onImprove && (
          <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
            <PrimaryButton
              onClick={onImprove}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(to right, #253282 0%, 21.09704613685608%, #374DAE 42.19409227371216%, 71.09704613685608%, #537DD3 100%)',
                justifyContent: 'space-between'
              }}
            >
              <span>Build Action Plan</span>
              <span style={{ fontSize: '18px' }}>→</span>
            </PrimaryButton>
          </div>
        )}
      </div>

    </>
  );
};

export default MobileBaselineScoreCard;
