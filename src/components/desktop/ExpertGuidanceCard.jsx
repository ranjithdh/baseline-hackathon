import React from 'react';

const ExpertGuidanceCard = ({ targetScore }) => {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      marginBottom: '0',
      borderRadius: 0,
      overflow: 'hidden',
      background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.45)), url('file:///Users/apple/.gemini/antigravity/brain/fa9c577f-ab0a-43f9-9bfe-3bd313206db4/media__1773387580265.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.6)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 48px',
      justifyContent: 'center',
    }}>
      <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: '0 0 8px 0',
            fontFamily: 'var(--font-main)',
          }}>
            Get Expert Guidance
          </h2>


          <p style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.6',
            fontFamily: 'var(--font-main)',
          }}>
            Reaching <strong style={{ color: '#FFC53D' }}>{targetScore}</strong> requires improving markers beyond current interventions.
          </p>
        </div>
        <button style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: '#E4E4E7',
          color: '#000000',
          fontSize: '14px',
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-main)',
          transition: 'transform 0.2s, background 0.2s',
          width: 'fit-content'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.background = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = '#E4E4E7';
          }}
        >
          Book a consult
        </button>
      </div>
    </div>
  );
};

export default ExpertGuidanceCard;
