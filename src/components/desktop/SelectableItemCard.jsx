import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// SelectableItemCard
//
// Replaces the old ItemCard. The only things that differ from the original:
//   • Top-right indicator: stacked pill button (+ Add / − Remove) above +N points
//   • Card background:     deep blue gradient tint when selected
//   • Card border:         blue accent + glow when selected
//
// All typography, spacing, content structure, and tag / timeline / badge styles
// are preserved 1-to-1 from the original ItemCard.
//
// Props
//   item       {object}   Plan item from desktopPlanData — id, name, gain,
//                         timeline, tags, detail
//   catType    {string}   Category type string (passed through, not rendered)
//   isSelected {boolean}  Whether this item is in the user's plan
//   isNeeded   {boolean}  Whether the greedy algorithm flagged this as required
//   onToggle   {Function} (id: string) => void — called on card or button click
// ─────────────────────────────────────────────────────────────────────────────

const SelectableItemCard = React.memo(({ item, catType, isSelected, isNeeded, onToggle }) => {
  const [hovered, setHovered] = useState(false);

  // ── Gradient border technique ─────────────────────────────────────────────
  // CSS `border-image` doesn't work with border-radius, so we simulate a
  // gradient border by rendering a gradient wrapper (1.5 px padding) around
  // an inner card div. When unselected the wrapper is transparent (no border).

  // Inner card background — deep navy with radial blue ambient glow (50% intensity)
  const cardBg = isSelected
    ? `linear-gradient(135deg, #0f1729 0%, #111827 55%, #0e1a3a 100%),
       linear-gradient(170deg, rgba(8,14,48,0.99) 0%, rgba(11,20,65,0.98) 45%, rgba(6,11,40,0.99) 100%)`
    : hovered
      ? 'rgba(255,255,255,0.055)'
      : 'rgba(255,255,255,0.03)';

  // Outer wrapper — electric-blue gradient border stroke (50% opacity)
  const wrapperBg = isSelected
    ? `linear-gradient(135deg,
        rgba(140,190,255,0.5)  0%,
        rgba(60,110,255,0.5)  20%,
        rgba(90,150,255,0.5)  45%,
        rgba(50, 90,240,0.5)  65%,
        rgba(120,175,255,0.5) 85%,
        rgba(70,120,255,0.5) 100%)`
    : 'transparent';

  // Outer glow — halved from original intensity
  const wrapperShadow = isSelected
    ? '0 0 0px rgba(80,140,255,0.27), 0 0 2px rgba(60,110,255,0.17), 0 0 4px rgba(50,100,255,0.09)'
    : 'none';

  // Unselected hover/default border rendered via outline on the inner card
  const innerBorder = isSelected
    ? 'none'
    : `1px solid ${hovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'}`;

  return (
    // ── Gradient-border wrapper ──
    <div
      onClick={() => onToggle(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   wrapperBg,
        borderRadius: '17.5px',           // wrapper radius = inner radius + padding
        padding:      isSelected ? '1.5px' : '0',
        boxShadow:    wrapperShadow,
        cursor:       'pointer',
        transition:   'background 0.22s, box-shadow 0.22s, padding 0.22s',
        // Needed so inner card's border-radius clips correctly
        isolation:    'isolate',
      }}
    >
    {/* ── Inner card ── */}
    <div
      style={{
        background:    cardBg,
        border:        innerBorder,
        borderRadius:  '16px',
        padding:       '20px',
        transition:    'background 0.22s, border-color 0.22s',
        display:       'flex',
        flexDirection: 'column',
        gap:           '12px',
      }}
    >
      {/* ── Row 1: left metadata  |  right indicator ── */}
      <div style={{
        display:        'flex',
        alignItems:     'flex-start',
        justifyContent: 'space-between',
        gap:            '12px',
      }}>

        {/* Left: name + timeline badge + ★ needed badge — unchanged from ItemCard */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

            <span style={{
              fontSize:   '15px',
              fontWeight: 700,
              color:      'rgb(var(--zinc-100))',
              fontFamily: 'var(--font-main)',
              lineHeight: 1.3,
            }}>
              {item.name}
            </span>

            {item.timeline && item.gain > 0 && (
              <span style={{
                display:    'inline-flex',
                alignItems: 'center',
                gap:        '4px',
                padding:    '3px 9px',
                borderRadius: '100px',
                fontSize:   '10px',
                color:      'rgba(255,255,255,0.45)',
                border:     '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ opacity: 0.6, fontSize: '16px', lineHeight: 1 }}>⊙</span>
                {item.timeline}
              </span>
            )}

            {isNeeded && (
              <span style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           '3px',
                padding:       '2px 8px',
                borderRadius:  '100px',
                fontSize:      '9px',
                fontWeight:    600,
                fontFamily:    'var(--font-mono)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                background:    'rgba(255,197,61,0.14)',
                color:         'rgb(255,197,61)',
                border:        '1px solid rgba(255,197,61,0.28)',
                whiteSpace:    'nowrap',
              }}>
                ★ needed
              </span>
            )}

          </div>
        </div>

        {/* Right: pill action button stacked above +N points */}
        <div style={{
          display:       'flex',
          flexDirection: 'row',
          alignItems:    'flex-end',
          gap:           '8px',
          flexShrink:    0,
        }}>

              {/* ── +N points — visible in both states ── */}
          {item.gain > 0 && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize:   '28px',
                fontWeight: 700,
                color:      'rgb(48,164,108)',
                lineHeight: 1,
              }}>
                +{item.gain}
              </span>
              <span style={{
                fontSize:   '12px',
                color:      'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-mono)',
              }}>
                pts
              </span>
            </div>
          )}


          {/* ── Pill button (+ Add / − Remove) ── */}
          {/* stopPropagation so clicking the button doesn't double-fire the card onClick */}
          <div
            onClick={e => { e.stopPropagation(); onToggle(item.id); }}
            style={{
              display:     'inline-flex',
              alignItems:  'center',
              gap:         '6px',
              padding:     '6px 14px',
              borderRadius: '100px',
              background:  'rgba(255,255,255,0.08)',
              border:      '1px solid rgba(255,255,255,0.13)',
              cursor:      'pointer',
              userSelect:  'none',
              transition:  'background 0.15s, border-color 0.15s',
              whiteSpace:  'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            {/* Icon — green "+" when unselected, muted "−" when selected */}
            <span style={{
              fontSize:   '18px',
              fontWeight: 700,
              lineHeight: 1,
              color:      isSelected ? 'rgba(255,255,255,0.65)' : 'rgb(255,255,255,1)',
            }}>
              {isSelected ? '−' : '+'}
            </span>

            {/* Label */}
            {/* { <span style={{
              fontSize:      '12px',
              fontWeight:    400,
              fontFamily:    'var(--font-main)',
              color:         'rgba(255,255,255,0.85)',
              letterSpacing: '0.01em',
            }}>
              {isSelected ? 'Remove' : 'Add'}
            </span> } */}
          </div>

      
        </div>
      </div>

      {/* ── Row 2: description — unchanged from ItemCard ── */}
      <p style={{
        fontSize:   '12px',
        color:      'rgba(228,228,231,0.42)',
        lineHeight: 1.65,
        margin:     0,
      }}>
        {item.detail}
      </p>

      {/* ── Row 3: biomarker tag chips — unchanged from ItemCard ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
        {item.tags && item.tags.map(tag => (
          <span key={tag} style={{
            padding:      '4px 10px',
            borderRadius: '100px',
            fontSize:     '10px',
            fontWeight:   500,
            color:        'rgb(48,164,108)',
            border:       '1px solid rgba(48,164,108,0.28)',
            background:   'rgba(48,164,108,0.08)',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
    </div>
  );
});

SelectableItemCard.displayName = 'SelectableItemCard';
export default SelectableItemCard;
