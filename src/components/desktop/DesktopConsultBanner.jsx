import React from 'react';
import consultCrystal from '../../assets/consultation_crystal.png';

const DesktopConsultBanner = ({ onBookNow }) => {
  return (
    <>
      <style>{`
        .dcb-root {
          position: relative;
          border-radius: 20px;
          padding: 24px 28px;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 
            0 24px 64px rgba(0,0,0,0.4),
            0 0 0 1px rgba(255,255,255,0.02) inset;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .dcb-root:hover {
          transform: translateY(-4px);
          border-color: rgba(43, 127, 255, 0.2);
        }

        .dcb-glow {
          position: absolute;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(43, 127, 255, 0.12) 0%, transparent 70%);
          right: -40px; top: -40px;
          pointer-events: none;
        }

        .dcb-header-label {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #4c93ff;
          margin-bottom: 2px;
        }

        .dcb-layout {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: center;
          height: 100%;
        }

        .dcb-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dcb-title {
          font-family: var(--font-heading);
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .dcb-sub {
          font-family: var(--font-main);
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.45;
          max-width: 260px;
        }

        /* ── Huge CTA ── */
        .dcb-cta-wrap {
          margin-top: 4px;
        }
        .dcb-cta-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 14px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #8b5cf6 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }
        .dcb-cta-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.6);
        }
        .dcb-cta-btn:active { transform: scale(0.98); }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .dcb-cta-btn { animation: pulse-glow 2s infinite; }

        /* ── Trust Signals ── */
        .dcb-trust {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }
        .dcb-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.35);
        }
        .dcb-trust-item span { color: #facc15; }

        /* ── Floating Visual ── */
        .dcb-visual-wrap {
          position: relative;
          width: 140px;
          height: 140px;
        }
        @keyframes floating {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .dcb-crystal {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 15px 30px rgba(59, 130, 246, 0.4));
          animation: floating 6s ease-in-out infinite;
        }
      `}</style>

      <div className="dcb-root">
        <div className="dcb-glow" />
        
        <div className="dcb-header-label">Free Expert Advice</div>

        <div className="dcb-layout">
          <div className="dcb-content">
            <h2 className="dcb-title">Unlock Your<br/>Full Potential</h2>
            <p className="dcb-sub">
              Get a personalized plan to improve your score, energy, and overall health.
            </p>
            
            <div className="dcb-cta-wrap">
              <button className="dcb-cta-btn" onClick={onBookNow}>
                Get Your Personalized Plan <span style={{ fontSize: '20px' }}>→</span>
              </button>
            </div>

            <div className="dcb-trust">
              <div className="dcb-trust-item">
                <span>★</span> 4.8 review
              </div>
              <div className="dcb-trust-item">
                10,000+ Users
              </div>
              <div className="dcb-trust-item">
                15-min free session
              </div>
            </div>
          </div>

          <div className="dcb-visual-wrap">
            <img src={consultCrystal} alt="crystal" className="dcb-crystal" />
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopConsultBanner;
