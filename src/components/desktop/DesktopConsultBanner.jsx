import React from 'react';
import consultIcon from '../../assets/consult-icon.png';

const DesktopConsultBanner = ({ onBookNow }) => {
  return (
    <div style={{
      borderRadius: '20px',
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(120deg, #0d1b4b 0%, #0a2a8a 45%, #1a4fd6 100%)',
      display: 'flex',
      alignItems: 'flex-start',
      height: '100%',
      boxSizing: 'border-box',
      padding: '36px 180px 36px 40px',
    }}>
      {/* Radial glow behind icon */}
      <div style={{
        position: 'absolute',
        right: 0, top: 0, bottom: 0,
        width: '55%',
        background: 'radial-gradient(ellipse at 85% 50%, rgba(80,130,255,0.45) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Left: text + button */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '10px',
          lineHeight: 1.2,
        }}>
          Let's Get Started
        </div>
        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.65)',
          marginBottom: '24px',
          lineHeight: 1.6,
          maxWidth: '280px',
        }}>
          Get the best out of your result with a consultation from our expert for free.
        </div>
        <button
          onClick={onBookNow}
          style={{
            background: '#ffffff',
            color: '#0d1b4b',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 28px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'var(--font-main)',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Book your Consultation
        </button>
      </div>

      {/* Right: icon — touches bottom-right corner */}
      <div style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '180px',
        height: '180px',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <img
          src={consultIcon}
          alt="consult icon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom right',
            filter: 'drop-shadow(0 8px 24px rgba(80,130,255,0.5))',
          }}
        />
      </div>
    </div>
  );
};

export default DesktopConsultBanner;
