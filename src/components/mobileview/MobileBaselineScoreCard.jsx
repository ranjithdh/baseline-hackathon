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
          border-radius: 20px;
          padding: 16px 20px;
          height: auto;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mbsc-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mbsc-main-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mbsc-stats-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .mbsc-bottom-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .mb-insight-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          text-align: left;
          line-height: 1.4;
        }
        .mb-insight-item span:first-of-type {
          margin-top: 1px;
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
          <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
            <svg
              width="100" height="100"
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
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: 'white',
                  lineHeight: 1,
                }}>
                  {score}
                </span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '11px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.4)',
                  marginLeft: '2px',
                }}>
                  /100
                </span>
              </div>
            </div>
          </div>

          {/* Score stats group */}
          <div className="mbsc-stats-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '100px',
                background: 'rgba(48, 164, 108, 0.15)',
                color: '#30A46C',
                border: '1px solid rgba(48, 164, 108, 0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {status}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
              +10 points to reach <span style={{ color: '#ffffff', fontWeight: 600 }}>Robust</span>
            </div>


          </div>
        </div>

        {showRangeBar && (
          <div style={{ padding: '0 4px', marginTop: '-12px' }}>
            <ScoreRangeBar score={score} showLegend={true} maxWidth="100%" className="!px-0" />
          </div>
        )}

        <div className="mbsc-bottom-row">
          <div className="mb-insight-item">
            <span>🌟</span>
            <span>Biggest Boost: {biggestBoost} (+{biggestBoostGain})</span>
          </div>
          <div className="mb-insight-item">
            <span>🏆</span>
            <span>Your result is lower than 73 percent of people who have measured their baseline.</span>
          </div>
        </div>

        {/* Action Button */}
        {showActionButton && onImprove && (
          <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
            <PrimaryButton
              onClick={onImprove}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '13px',
                borderRadius: '10px',
                background: 'linear-gradient(to right, #253282 0%, 21.09704613685608%, #374DAE 42.19409227371216%, 71.09704613685608%, #537DD3 100%)',
                justifyContent: 'space-between'
              }}
            >
              <span>See how to improve</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </PrimaryButton>
          </div>
        )}
      </div>

    </>
  );
};

export default MobileBaselineScoreCard;
