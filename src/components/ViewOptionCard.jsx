import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// ViewOptionCard
//
// Reusable clickable card used on the ViewSelectorScreen.
// Renders a centred icon tile above a text label and triggers onClick when
// the user selects the option.
//
// Props
//   icon        {ReactNode}   SVG / element shown inside the icon tile
//   label       {string}      Primary label ("Mobile View", "Desktop View")
//   description {string}      Optional secondary line beneath the label
//   onClick     {function}    Called when the card is activated
// ─────────────────────────────────────────────────────────────────────────────

const ViewOptionCard = ({ icon, label, description, onClick, onMouseEnter, onMouseLeave }) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => { setHovered(true);  onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); setPressed(false); onMouseLeave?.(e); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      aria-label={label}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '20px',
        width:          '200px',
        height:         '220px',
        background:     hovered
          ? 'rgba(43,127,255,0.07)'
          : 'rgba(255,255,255,0.03)',
        border:         hovered
          ? '1px solid rgba(43,127,255,0.45)'
          : '1px solid rgba(255,255,255,0.10)',
        borderRadius:   '20px',
        cursor:         'pointer',
        outline:        'none',
        padding:        '32px 24px',
        transition:     'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        transform:      pressed
          ? 'translateY(0px) scale(0.98)'
          : hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:      hovered
          ? '0 12px 40px rgba(43,127,255,0.12), 0 0 0 4px rgba(43,127,255,0.05)'
          : 'none',
      }}
    >
      {/* ── Icon tile ── */}
      <div style={{
        width:          '64px',
        height:         '64px',
        borderRadius:   '16px',
        background:     hovered
          ? 'rgba(43,127,255,0.15)'
          : 'rgba(255,255,255,0.06)',
        border:         hovered
          ? '1px solid rgba(43,127,255,0.25)'
          : '1px solid rgba(255,255,255,0.08)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        transition:     'background 0.2s ease, border-color 0.2s ease',
        flexShrink:     0,
      }}>
        {icon}
      </div>

      {/* ── Text block ── */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize:      '15px',
          fontWeight:    600,
          fontFamily:    'var(--font-main)',
          color:         hovered
            ? 'rgb(var(--foreground))'
            : 'rgba(228,228,231,0.80)',
          transition:    'color 0.2s ease',
          letterSpacing: '0.01em',
          lineHeight:    1.3,
        }}>
          {label}
        </div>

        {description && (
          <div style={{
            marginTop:  '6px',
            fontSize:   '12px',
            fontFamily: 'var(--font-main)',
            color:      'rgba(228,228,231,0.35)',
            lineHeight: 1.5,
          }}>
            {description}
          </div>
        )}
      </div>
    </button>
  );
};

export default ViewOptionCard;
