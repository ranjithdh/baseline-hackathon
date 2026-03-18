import React from 'react';

const DashboardCard = React.forwardRef(({ children, style, className }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{
      background: 'rgba(20, 24, 35, 0.85)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
      padding: '24px',
      ...style,
    }}
  >
    {children}
  </div>
));

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
