import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// ActionPlanDownloadButton
//
// Icon-only button placed in the top-right corner of the "Build Your Action
// Plan" card. Renders a dark square tile with a centred download arrow — the
// visual from the design reference.
//
// Props
//   onClick  {function}  Handler called when the button is pressed
//
// Design tokens used
//   --font-main   body typeface (used for aria / title only)
//
// Usage
//   <ActionPlanDownloadButton onClick={onBookConsult} />
// ─────────────────────────────────────────────────────────────────────────────

const ActionPlanDownloadButton = React.memo(({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Download your plan"
      aria-label="Download your plan"
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        width:           '44px',
        height:          '44px',
        borderRadius:    '12px',
        background:      hovered
          ? 'rgba(255,255,255,0.10)'
          : 'rgba(255,255,255,0.06)',
        border:          '1px solid rgba(255,255,255,0.10)',
        cursor:          'pointer',
        transition:      'background 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
        transform:       hovered ? 'translateY(-1px)' : 'translateY(0)',
        flexShrink:      0,
        outline:         'none',
      }}
    >
      {/* Download icon — vertical arrow + baseline rule */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Shaft + arrowhead */}
        <path
          d="M9 2V11.5M9 11.5L5.5 8M9 11.5L12.5 8"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Baseline rule */}
        <path
          d="M3.5 15.5H14.5"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
});

ActionPlanDownloadButton.displayName = 'ActionPlanDownloadButton';
export default ActionPlanDownloadButton;
