import React from 'react';
import consultCrystal from '../../assets/consultation_crystal.png';

const DesktopConsultBanner = ({ onBookNow }) => {
  return (
    <>
      <style>{`
        .dcb-container {
          position: relative;
          background: #09090b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px; /* Reduced from 24 */
          padding: 24px; /* Reduced from 32px */
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
          font-family: var(--font-main);
        }

        .dcb-eyebrow {
          font-family: var(--font-mono);
          font-size: 8.5px; /* Reduced from 9px */
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #3b82f6;
          margin-bottom: 12px; /* Reduced from 16px */
        }

        .dcb-layout {
          display: grid;
          grid-template-columns: 1fr 120px; /* Reduced from 140px */
          gap: 12px; /* Reduced from 16px */
          flex: 1;
        }

        .dcb-title {
          font-family: var(--font-heading);
          font-size: 24px; /* Reduced from 28px */
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.01em;
          margin: 0 0 10px 0;
        }

        .dcb-desc {
          font-size: 12px; /* Reduced from 13px */
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.45);
          max-width: 280px; /* Reduced from 320px */
          margin: 0;
        }

        .dcb-cta-gradient {
          margin-top: 20px; /* Reduced from 24px */
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: fit-content;
          padding: 10px 28px; /* Reduced from 12px 32px */
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 40%, #8b5cf6 100%);
          border-radius: 12px; /* Reduced from 14px */
          color: #fff;
          font-weight: 800;
          font-size: 13px; /* Reduced from 14px */
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .dcb-urgency {
          font-size: 9px; /* Reduced from 10px */
          font-weight: 700;
          color: #fca5a5;
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .dcb-visual {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dcb-crystal {
          width: 140px; /* Reduced from 170px */
          height: 140px;
          object-fit: contain;
          filter: drop-shadow(0 12px 24px rgba(59, 130, 246, 0.3));
        }

        .dcb-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 20px; /* Reduced from 24px */
          padding-top: 20px; /* Reduced from 24px */
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .dcb-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px; /* Reduced from 11px */
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
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
              Get Your Personalized Plan <span style={{ fontSize: '20px' }}>→</span>
            </button>

            {/* <div className="dcb-urgency">
              <span className="dcb-pulse" />
              Limited free consultations today
            </div> */}
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
            <span style={{ opacity: 0.6 }}>👤</span> 100,000+ healthy users
          </div>
          <div className="dcb-item">
            <span style={{ opacity: 0.6 }}>📞</span> 30-min free consultation
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopConsultBanner;
