import React, { useEffect, useState } from 'react';
import BaselineScoreInfoOverlay from './BaselineScoreInfoOverlay';


// ── Arc helpers ─────────────────────────────────────────────
const RADIUS = 48;
const CIRC = 2 * Math.PI * RADIUS;
const ARC_VISIBLE = CIRC * (270 / 360);
const GAP = CIRC - ARC_VISIBLE;
const getArcOffset = (score) => CIRC - (score / 100) * ARC_VISIBLE;

const BaselineScoreCard = ({
  score = 65,
  status = 'Stable',
  headline = "You're doing well — but there's strong potential to improve your energy, appearance, and performance.",
  topPercentage = 35,
  pointsToGrow = 18,
  onTap,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  const arcOffset = revealed ? getArcOffset(score) : CIRC;

  return (
    <>
      <style>{`
        .hso-root {
          position: relative;
          border-radius: 24px;
          padding: 32px;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow: hidden;
          cursor: pointer;
          background: rgb(var(--card));
          border: 1px solid rgba(var(--zinc-700), 0.5);
          box-shadow: 
            0 24px 64px rgba(0,0,0,0.4),
            0 0 0 1px rgba(255,255,255,0.03) inset;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .hso-root:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 32px 80px rgba(0,0,0,0.5),
            0 0 20px rgba(43, 127, 255, 0.1),
            0 0 0 1px rgba(255,255,255,0.08) inset;
        }

        /* ── Header ── */
        .hso-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hso-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        .hso-beta {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 100px;
          background: rgba(43, 127, 255, 0.15);
          color: #4c93ff;
          border: 1px solid rgba(43, 127, 255, 0.3);
        }
        .hso-info-btn {
          margin-left: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.2s;
        }
        .hso-info-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #ffffff;
        }

        /* ── Main Content Area (Layout Split) ── */
        .hso-content-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 32px;
          align-items: center;
        }

        /* ── Score Rings ── */
        .hso-score-wrap {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hso-score-rings svg {
          transform: rotate(135deg);
          width: 140px;
          height: 140px;
          filter: drop-shadow(0 0 15px rgba(43, 127, 255, 0.25));
        }
        .hso-score-center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .hso-score-num {
          font-family: var(--font-heading);
          font-size: 48px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .hso-score-max {
          font-family: var(--font-mono);
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
        }
        .hso-score-label {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          text-align: center;
          margin-top: 12px;
          line-height: 1.4;
          font-family: var(--font-main);
        }

        /* ── Right Meta ── */
        .hso-meta {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hso-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
          width: fit-content;
        }
        .hso-insight {
          font-family: var(--font-main);
          font-size: 15px;
          color: rgba(var(--zinc-200), 0.9);
          line-height: 1.5;
          font-weight: 500;
        }

        /* ── Ranking & Improvement ── */
        .hso-footer-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 20px;
          margin-top: 8px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .hso-rank-card {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .hso-rank-title {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }
        .hso-rank-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
        }

        .hso-improve-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .hso-potential {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #4c93ff;
          font-weight: 700;
        }
        .hso-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .hso-cta-btn:hover {
          background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%);
          transform: translateX(4px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        /* ── Key Issues Tags ── */
        .hso-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .hso-tag {
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        /* ── Ambient Glows ── */
        .hso-glow {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(43, 127, 255, 0.1) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .hso-glow-1 { top: -50px; left: -50px; }
        .hso-glow-2 { bottom: -50px; right: -50px; background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%); }
      `}</style>

      <div className="hso-root" onClick={onTap}>
        {/* ── Header ── */}
        <div className="hso-header">
          <span className="hso-title">Your Health Score</span>
          <span className="hso-beta">Beta</span>
          <button
            className="hso-info-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsInfoOpen(true);
            }}
          >
            i
          </button>
        </div>


        {/* ── Content ── */}
        <div className="hso-content-grid">
          <div className="hso-score-column">
            <div className="hso-score-wrap">
              <div className="hso-score-rings">
                <svg viewBox="0 0 110 110">
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  {/* Track */}
                  <circle
                    cx="55" cy="55" r={RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${ARC_VISIBLE} ${GAP}`}
                  />
                  {/* Fill */}
                  <circle
                    cx="55" cy="55" r={RADIUS}
                    fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${CIRC}`}
                    strokeDashoffset={arcOffset}
                    style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s' }}
                  />
                </svg>
              </div>
              <div className="hso-score-center">
                <span className="hso-score-num">{score}</span>
                <span className="hso-score-max">/ 100</span>
              </div>
            </div>
            <p className="hso-score-label">Based on Sleep, Fitness,<br />Nutrition, Stress</p>
          </div>

          <div className="hso-meta">
            <div className="hso-status-badge">
              <span>●</span> {status}
            </div>
            <p className="hso-insight">
              {headline}
            </p>
            <div className="hso-tags">
              <span className="hso-tag">Low Protein Intake</span>
              <span className="hso-tag">Poor Sleep</span>
              <span className="hso-tag">High Stress</span>
            </div>
          </div>
        </div>

        {/* ── Footer Stats ── */}
        <div className="hso-footer-grid">
          <div className="hso-rank-card">
            <div className="hso-rank-title">Top {topPercentage}% in age group</div>
            <div className="hso-rank-sub">Better than {100 - topPercentage}% of people your age</div>
          </div>

          <div className="hso-improve-section">
            <div className="hso-potential">+{pointsToGrow} points to reach potential</div>
            <button className="hso-cta-btn">
              See how to improve <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </div>
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
