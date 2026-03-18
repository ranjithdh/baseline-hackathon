import React, { useState } from 'react';

/**
 * High-conversion primary call-to-action button for a dark-themed dashboard UI.
 * Designed for performance/health score improvement contexts.
 * 
 * Features:
 * - Green to Teal vibrant gradient
 * - Premium glow and elevation
 * - Modern pill shape
 * - Smooth hover/active states with motion effect
 */
const ConversionCTA = React.memo(({ 
  children, 
  onClick, 
  style, 
  targetScore,
  ...rest 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Use the provided score in children if needed, or fallback to fixed text
  const label = children || (targetScore ? `Reach ${targetScore} faster →` : "Improve my score →");

  const baseStyle = {
    // 1. Visual Style (Modern, premium, gradient)
    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', // vibrant green -> teal
    border: 'none',
    borderRadius: '100px', // pill-shaped
    color: '#ffffff',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
    outline: 'none',

    // 2. Size & Spacing (dominant, generous padding)
    padding: '14px 28px',
    minWidth: '200px',

    // 3. Typography (bold, clean, high contrast)
    fontFamily: 'var(--font-main), -apple-system, sans-serif',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.02em',

    // 1. Elevation & Glow
    boxShadow: isHovered 
      ? '0 10px 25px -5px rgba(16, 185, 129, 0.5), 0 8px 10px -6px rgba(16, 185, 129, 0.5)'
      : '0 4px 12px rgba(16, 185, 129, 0.3)',

    // 5. Interaction States (Smooth transitions)
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isActive ? 'scale(0.96)' : isHovered ? 'scale(1.04) translateY(-1px)' : 'scale(1)',
    
    // Merge with optional external style
    ...style,
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={baseStyle}
      {...rest}
    >
      {/* 6. Micro-interactions: Shimmer effect */}
      {isHovered && (
        <span style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          animation: 'shimmer 1.5s infinite',
          zIndex: 1,
        }} />
      )}
      
      <span style={{ position: 'relative', zIndex: 2 }}>
        {label}
      </span>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </button>
  );
});

ConversionCTA.displayName = 'ConversionCTA';
export default ConversionCTA;
