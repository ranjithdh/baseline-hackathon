import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// BiomarkerStatusTag
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  optimal: { label: 'Optimal', bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80' },
  normal: { label: 'Normal', bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80' },
  borderline_high: { label: 'Borderline High', bg: 'rgba(250, 204, 21, 0.15)', text: '#facc15' },
  borderline_low: { label: 'Borderline Low', bg: 'rgba(250, 204, 21, 0.15)', text: '#facc15' },
  moderately_high: { label: 'Moderately High', bg: 'rgba(250, 204, 21, 0.15)', text: '#facc15' },
  low: { label: 'Low', bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171' },
  high: { label: 'High', bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171' },
  critical_high: { label: 'Critical High', bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171' },
  critical_low: { label: 'Critical Low', bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171' },
};

const BiomarkerStatusTag = React.memo(({ status }) => {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '10px',
      fontWeight: 800,
      fontFamily: 'var(--font-main)',
      background: config.bg,
      color: config.text,
      border: `1px solid ${config.text}25`,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {config.label}
    </div>
  );
});

BiomarkerStatusTag.displayName = 'BiomarkerStatusTag';
export default BiomarkerStatusTag;
