import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// BuildActionPlanBanner
//
// Blue CTA strip rendered above HealthScoreLimitCard in the Playground panel.
// Props:
//   targetScore  {number}  – shown as the bold number in the subtitle
//   onClick      {func}    – optional click handler for the whole banner
// ─────────────────────────────────────────────────────────────────────────────

const BuildActionPlanBanner = React.memo(({ targetScore, onClick }) => (
  <div style={S.wrap} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
    {/* Left: text block */}
    <div style={S.textBlock}>
      <span style={S.title}>Build your Action Plan</span>
      {/* <span style={S.subtitle}>
        Lock in target:&nbsp;<strong style={S.boldNum}>{targetScore}</strong>&nbsp;and get personalized steps
      </span> */}
    </div>

    {/* Right: arrow */}
    <div style={S.arrow} aria-hidden="true">→</div>
  </div>
));

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
    background:    'linear-gradient(to right, #253282 0%, 21.09704613685608%, #374DAE 42.19409227371216%, 71.09704613685608%, #537DD3 100%)',
    cursor:          'pointer',
    userSelect:      'none',
    marginBottom:    '0px',
  },

  textBlock: {
    display:        'flex',
    flexDirection:  'column',
    gap:            '2px',
  },

  title: {
    color:       '#FFFFFF',
    fontSize:    '15px',
    fontWeight:  '700',
    lineHeight:  '1.3',
    letterSpacing: '0.01em',
  },

  subtitle: {
    color:       'rgba(255,255,255,0.85)',
    fontSize:    '13px',
    fontWeight:  '400',
    lineHeight:  '1.4',
  },

  boldNum: {
    color:       '#FFFFFF',
    fontWeight:  '700',
  },

  arrow: {
    color:       'rgba(255,255,255,0.90)',
    fontSize:    '20px',
    fontWeight:  '400',
    lineHeight:  '1',
    flexShrink:  0,
    marginLeft:  '12px',
  },
};
