import React from 'react';

const DesktopDownloadStrip = () => (
  <div style={{
    background: 'linear-gradient(135deg, rgb(var(--primary)) 0%, rgba(var(--primary), 0.75) 100%)',
    borderRadius: '20px',
    padding: '36px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0 48px 56px',
    flexWrap: 'wrap',
    gap: '20px',
  }}>
    <div>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '24px',
        color: 'white',
        marginBottom: '4px',
      }}>
        Your full protocol is ready.
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-main)' }}>
        Everything above, plus your food list, supplement timing, and retest schedule — in one beautifully designed PDF.
      </p>
    </div>

    <button
      style={{
        background: 'white',
        color: 'rgb(var(--primary))',
        border: 'none',
        padding: '12px 28px',
        borderRadius: '100px',
        fontSize: '13px',
        fontWeight: 700,
        fontFamily: 'var(--font-main)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span>↓</span> Download Your Plan
    </button>
  </div>
);

export default DesktopDownloadStrip;
