import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// SliderMarker
//
// Standalone visual component for the draggable thumb on HealthScoreSliderV2.
// Replicates the reference design image exactly:
//
//   ┌──────────────────────────────────────────────────────────┐
//   │  • Bright solid segment-color fill (radial depth)        │
//   │  • Bright cyan-white border ring  → the "neon ring"      │
//   │  • Luminous inset glow on fill edge                      │
//   │  • Concentric outward glow halos in segment color        │
//   │  • Large diffuse ambient bloom (visible in ref image)    │
//   │  • Inner decorative ring for layered-depth look          │
//   └──────────────────────────────────────────────────────────┘
//
// Props
//   segment  {object}  Active SEGMENTS entry  { color, glowRgb, ... }
//             color   : CSS variable string  e.g. 'rgb(var(--chart-4))'
//             glowRgb : raw triplet string   e.g. '141,226,141'
//             Falls back to brand blue when no segment is supplied.
//
// Size
//   MARKER_SIZE = 60 px — matches the D constant in HealthScoreSliderV2.
//   Change only here; the parent wrapper must also match (thumbSize * 3 = 60).
//
// Usage
//   <SliderMarker segment={activeSeg} />
//   (All positioning, ARIA, and event handling stay on the parent wrapper div.)
// ─────────────────────────────────────────────────────────────────────────────

const MARKER_SIZE = 60; // px — keep in sync with HealthScoreSliderV2 D constant
const D = MARKER_SIZE;

const SliderMarker = React.memo(({ segment }) => {
  // ── Color resolution ───────────────────────────────────────────────────────
  // Falls back to brand blue so the component renders correctly even when used
  // outside HealthScoreSliderV2 (e.g. Storybook, design previews).
  const color   = segment?.color   ?? 'rgb(43,127,255)';
  const glowRgb = segment?.glowRgb ?? '43,127,255';

  /** rgba() builder — required because CSS var strings cannot be suffixed with
   *  hex alpha values like `${color}44`. */
  const g = (a) => `rgba(${glowRgb},${a})`;

  return (
    <div
      style={{
        width:          `${D}px`,
        height:         `${D}px`,
        borderRadius:   '50%',

        // ── Fill ─────────────────────────────────────────────────────────────
        // Bright segment-color radial gradient replicates the self-lit look
        // from the reference image (center brighter → soft edge).
        background: [
          `radial-gradient(`,
          `  circle at 40% 35%,`,
          `  rgba(255,255,255,0.15) 0%,`,   // subtle white highlight at top-left
          `  ${color} 35%,`,                // solid segment color mid-zone
          `  ${g(0.80)} 100%`,              // slightly transparent rim
          `)`,
        ].join(''),

        // ── Ring ─────────────────────────────────────────────────────────────
        // The bright cyan-white border is the primary visual feature from the
        // reference image — a crisp neon ring separating fill from outer glow.
        border:   '2.5px solid rgba(255,255,255,0.90)',

        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        pointerEvents:  'none', // parent wrapper owns all events

        // ── Glow layers ──────────────────────────────────────────────────────
        // Ordered from innermost to outermost to match the reference image.
        boxShadow: [
          // 1. Inset: bright edge illumination — makes the border ring glow
          `inset 0 0 ${Math.round(D * 0.25)}px rgba(255,255,255,0.28)`,
          // 2. Inset: colored fill bloom toward center
          `inset 0 0 ${Math.round(D * 0.50)}px ${g(0.18)}`,
          // 3. Tight outer ring — bright halo just outside the border
          `0 0 0 ${Math.round(D * 0.08)}px ${g(0.70)}`,
          // 4. Mid glow ring
          `0 0 0 ${Math.round(D * 0.20)}px ${g(0.30)}`,
          // 5. Outer soft ring
          `0 0 0 ${Math.round(D * 0.38)}px ${g(0.12)}`,
          // 6. Large diffuse ambient bloom (the wide halo visible in the image)
          `0 0 ${Math.round(D * 0.65)}px ${Math.round(D * 0.25)}px ${g(0.30)}`,
          // 7. Physical drop shadow for elevation / depth
          '0 4px 18px rgba(0,0,0,0.65)',
        ].join(', '),
      }}
    >
      {/* ── Inner decorative ring ────────────────────────────────────────────
          Replicates the concentric-circle layered depth visible in the
          reference image. Rendered at 62% of the outer diameter.          */}
      <div
        style={{
          width:        `${Math.round(D * 0.62)}px`,
          height:       `${Math.round(D * 0.62)}px`,
          borderRadius: '50%',
          border:       '1.5px solid rgba(255,255,255,0.35)',
          background:   'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.10) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});

SliderMarker.displayName = 'SliderMarker';
export default SliderMarker;
