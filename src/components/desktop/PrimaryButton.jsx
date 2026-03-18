import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PrimaryButton
//
// Single source of truth for the main CTA button style used across the
// desktop dashboard. Use this wherever "Book your Consultation", "Download
// your plan", "Build your Action Plan", etc. appear so all CTAs look identical.
//
// Props
//   children    {ReactNode}  Button label / content
//   onClick     {function}   Click handler
//   style       {object}     Optional overrides (merged last — can override defaults)
//   ...rest     {}           Any other <button> HTML props (disabled, aria-*, etc.)
//
// Design tokens used
//   --primary       brand blue for background
//   --font-main     body typeface for the label
//
// Usage
//   <PrimaryButton onClick={handleAction}>Build your Action Plan</PrimaryButton>
//   <PrimaryButton onClick={handleAction} style={{ width: '100%' }}>...</PrimaryButton>
// ─────────────────────────────────────────────────────────────────────────────

const PrimaryButton = React.memo(({ children, onClick, style, ...rest }) => (
  <button
    onClick={onClick}
    style={{
      background:     'rgb(var(--primary))',
      color:          'white',
      border:         'none',
      padding:        '9px 20px',
      borderRadius:   '100px',
      fontSize:       '12px',
      fontFamily:     'var(--font-main)',
      fontWeight:     600,
      cursor:         'pointer',
      letterSpacing:  '0.02em',
      transition:     'transform 0.2s, opacity 0.2s',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '6px',
      whiteSpace:     'nowrap',
      ...style,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.opacity   = '0.9';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.opacity   = '1';
    }}
    {...rest}
  >
    {children}
  </button>
));

PrimaryButton.displayName = 'PrimaryButton';
export default PrimaryButton;
