import React from 'react';
import consultCrystal from '../../assets/consultation_crystal.png';

const DesktopConsultBanner = ({ onBookNow }) => {
  return (
    <>
      <style>{`
        .dcb-container {
          position: relative;
          background: var(--ui-bg-gradient);
          border: 1px solid var(--ui-border);
          border-radius: var(--ui-radius);
          padding: var(--ui-card-padding);
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
          font-family: var(--font-main);
          box-shadow: var(--ui-shadow-elevated);
        }

        /* Radial glow to match BaselineScoreCard */
        .dcb-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 85% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .dcb-eyebrow {
          font-family: var(--font-mono);
          font-size: var(--ui-font-size-xs);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--ui-accent);
          margin-bottom: 16px;
          opacity: 0.9;
        }

        .dcb-layout {
          display: grid;
          grid-template-columns: 1fr 160px;
          gap: 20px;
          flex: 1;
          align-items: center;
        }

        .dcb-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 12px 0;
        }

        .dcb-desc {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.5);
          max-width: 320px;
          margin: 0;
        }

        .dcb-cta-gradient {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: fit-content;
          padding: 12px 32px;
          background: var(--ui-accent-gradient);
          border-radius: 14px;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 8px 24px var(--ui-accent-glow);
        }

        .dcb-cta-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px var(--ui-accent-glow);
        }

        .dcb-cta-arrow {
          transition: transform 0.25s ease;
          font-size: 20px;
        }

        .dcb-cta-gradient:hover .dcb-cta-arrow {
          transform: translateX(4px);
        }

        .dcb-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .dcb-visual::after {
          content: '';
          position: absolute;
          width: 120px;
          height: 120px;
          background: var(--ui-accent);
          filter: blur(60px);
          opacity: 0.15;
          z-index: 0;
        }

        .dcb-crystal {
          width: 180px;
          height: 180px;
          object-fit: contain;
          z-index: 1;
          filter: drop-shadow(0 12px 32px rgba(59, 130, 246, 0.2));
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .dcb-container:hover .dcb-crystal {
          transform: scale(1.05) rotate(5deg);
        }

        .dcb-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .dcb-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.35);
        }

        .dcb-icon {
          font-size: 12px;
          opacity: 0.7;
        }
      `}</style>

      <div className="dcb-container">
        <div className="dcb-eyebrow">Free Expert Advice</div>

        <div className="dcb-layout">
          <div className="dcb-content-left">
            <h2 className="dcb-title">Unlock Your<br />Full Potential</h2>
            <p className="dcb-desc">
              Get a personalized plan to improve your score, energy, and overall health.
            </p>

            <button className="dcb-cta-gradient" onClick={onBookNow}>
              Get Your Personalized Plan <span className="dcb-cta-arrow">→</span>
            </button>
          </div>

          <div className="dcb-visual">
            <img
              src={consultCrystal}
              alt="crystal"
              className="dcb-crystal"
            />
          </div>
        </div>

        <div className="dcb-footer">
          <div className="dcb-item">
            <span style={{ color: '#facc15' }}>★</span> 4.9 rating by community
          </div>
          <div className="dcb-item">
            <span className="dcb-icon">👤</span> 100,000+ healthy users
          </div>
          <div className="dcb-item">
            <span className="dcb-icon">📞</span> 30-min free consultation
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopConsultBanner;
