import React from 'react';

const DesktopTopBar = ({ onBookConsult }) => {
  const now = new Date();
  const dayName  = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div style={{
      padding: '28px 48px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Greeting */}
      <div style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
      }}>
        {dayName}, {monthYear} · ARJUN'S DASHBOARD
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={onBookConsult}
          style={{
            background: 'rgb(var(--primary))',
            color: 'white',
            border: 'none',
            padding: '9px 20px',
            borderRadius: '100px',
            fontSize: '12px',
            fontFamily: 'var(--font-main)',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.02em',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.opacity = '1';
          }}
        >
          Download your plan
        </button>
      </div>
    </div>
  );
};

export default DesktopTopBar;
