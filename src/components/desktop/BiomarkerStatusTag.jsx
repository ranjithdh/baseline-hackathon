import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// BiomarkerStatusTag
//
// Reusable status pill used inside DesktopBiomarkerRow marker rows.
// Colour mapping mirrors the Playground "Status Tag" pill exactly —
// both components use the same --chart-N / --chart-N-foreground CSS vars
// so they stay in sync if the design tokens ever change.
//
// Status → chart tier mapping
//   optimal          → chart-5  (Working For You  — best)
//   normal           → chart-4  (Working For You  — good)
//   borderline_high  → chart-3  (Needs Attention  — caution)
//   moderately_high  → chart-3  (Needs Attention  — caution)
//   low              → chart-2  (Watch Closely    — alert)
//   high             → chart-2  (Watch Closely    — alert)
//
// Props
//   status  {string}  One of the keys above (case-sensitive)
//
// Usage
//   <BiomarkerStatusTag status="optimal" />
//   <BiomarkerStatusTag status="borderline_high" />
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  optimal:         { label: 'Optimal',          bg: 'rgb(var(--chart-5))', text: 'rgb(var(--chart-5-foreground))' },
  normal:          { label: 'Normal',            bg: 'rgb(var(--chart-4))', text: 'rgb(var(--chart-4-foreground))' },
  borderline_high: { label: 'Borderline High',  bg: 'rgb(var(--chart-3))', text: 'rgb(var(--chart-3-foreground))' },
  borderline_low:  { label: 'Borderline Low',   bg: 'rgb(var(--chart-3))', text: 'rgb(var(--chart-3-foreground))' },
  moderately_high: { label: 'Moderately High',  bg: 'rgb(var(--chart-3))', text: 'rgb(var(--chart-3-foreground))' },
  low:             { label: 'Low',               bg: 'rgb(var(--chart-2))', text: 'rgb(var(--chart-2-foreground))' },
  high:            { label: 'High',              bg: 'rgb(var(--chart-2))', text: 'rgb(var(--chart-2-foreground))' },
  critical_high:   { label: 'Critical High',    bg: 'rgb(var(--chart-1))', text: 'rgb(var(--chart-1-foreground))' },
  critical_low:    { label: 'Critical Low',     bg: 'rgb(var(--chart-1))', text: 'rgb(var(--chart-1-foreground))' },
};

const BiomarkerStatusTag = React.memo(({ status }) => {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <div style={{
      display:       'inline-flex',
      alignItems:    'center',
      padding:       '4px 12px',
      borderRadius:  '999px',
      fontSize:      '11px',
      fontWeight:    700,
      fontFamily:    'var(--font-main)',
      background:    config.bg,
      color:         config.text,
      letterSpacing: '0.01em',
      whiteSpace:    'nowrap',
      flexShrink:    0,
    }}>
      {config.label}
    </div>
  );
});

BiomarkerStatusTag.displayName = 'BiomarkerStatusTag';
export default BiomarkerStatusTag;
