import React from 'react';

const DesktopTopBar = () => {
  const now = new Date();
  const dayName  = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div style={{
      padding: '28px 48px 0',
      display: 'flex',
      alignItems: 'center',
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
    </div>
  );
};

export default DesktopTopBar;
