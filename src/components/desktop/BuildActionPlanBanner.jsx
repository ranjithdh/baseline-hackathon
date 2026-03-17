import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// BuildActionPlanBanner
//
// Blue CTA strip rendered in the Playground panel when the slider drifts from
// the committed baseline. Draws attention with a continuous pulse ring.
//
// Props:
//   targetScore  {number}  – shown as the bold number in the subtitle
//   onClick      {func}    – optional click handler for the whole banner
// ─────────────────────────────────────────────────────────────────────────────

// Keyframe injected once — pulse ring radiates outward from the button edge.
const PULSE_CSS = `
@keyframes bap-pulse {
  0%   { box-shadow: 0 0 0 0   rgba(83,125,211,0.55), 0 4px 20px rgba(37,50,130,0.45); }
  60%  { box-shadow: 0 0 0 9px rgba(83,125,211,0),    0 4px 20px rgba(37,50,130,0.45); }
  100% { box-shadow: 0 0 0 0   rgba(83,125,211,0),    0 4px 20px rgba(37,50,130,0.45); }
}
@keyframes bap-pulse-hover {
  0%   { box-shadow: 0 0 0 0   rgba(83,125,211,0.75), 0 8px 28px rgba(37,50,130,0.65); }
  60%  { box-shadow: 0 0 0 12px rgba(83,125,211,0),   0 8px 28px rgba(37,50,130,0.65); }
  100% { box-shadow: 0 0 0 0   rgba(83,125,211,0),    0 8px 28px rgba(37,50,130,0.65); }
}
`;

let _styleInjected = false;
function injectPulseStyle() {
  if (_styleInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.dataset.id = 'bap-pulse';
  el.textContent = PULSE_CSS;
  document.head.appendChild(el);
  _styleInjected = true;
}

const BuildActionPlanBanner = React.memo(({ targetScore, onClick }) => {
  injectPulseStyle();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Tap press — gives tactile feedback on click
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        ...S.wrap,
        animation: hovered ? 'bap-pulse-hover 1.4s ease-out infinite'
                           : 'bap-pulse       1.8s ease-out infinite',
        // Subtle brightness lift on hover
        filter: hovered ? 'brightness(1.12)' : 'brightness(1)',
        transition: 'filter 0.2s ease',
      }}
    >
      {/* Left: text block */}
      <div style={S.textBlock}>
        <span style={S.title}>Build your Action Plan</span>
      </div>

      {/* Right: arrow — slides right slightly on hover */}
      <motion.div
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={S.arrow}
        aria-hidden="true"
      >
        →
      </motion.div>
    </motion.div>
  );
});

BuildActionPlanBanner.displayName = 'BuildActionPlanBanner';
export default BuildActionPlanBanner;

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  wrap: {
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'space-between',
    width:           '100%',
    boxSizing:       'border-box',
    padding:         '14px 20px',
    borderRadius:    '12px',
    background:      'linear-gradient(to right, #253282 0%, 21.09704613685608%, #374DAE 42.19409227371216%, 71.09704613685608%, #537DD3 100%)',
    cursor:          'pointer',
    userSelect:      'none',
    marginBottom:    '0px',
    // Base glow beneath the pulse animation
    outline:         'none',
  },

  textBlock: {
    display:        'flex',
    flexDirection:  'column',
    gap:            '2px',
  },

  title: {
    color:         '#FFFFFF',
    fontSize:      '14px',
    fontWeight:    '500',
    lineHeight:    '1',
    letterSpacing: '0.01em',
  },

  arrow: {
    color:       'rgba(255,255,255,0.90)',
    fontSize:    '20px',
    fontWeight:  '500',
    lineHeight:  '1',
    flexShrink:  0,
    marginLeft:  '12px',
  },
};
