import React from 'react';
import ConversionCTA from './ConversionCTA';

// Shown in DesktopPlanPanel when the user's goal exceeds MAX_ACHIEVABLE.
const HealthScoreLimitCard = React.memo(({ score, onConsultClick }) => {
  return (
    <div style={{
      width:      '100%',
      boxSizing:  'border-box',
      display:    'flex',
      alignItems: 'center',
      gap:        '24px',
      padding:    '20px 32px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.03)',
      border:     '1px solid rgba(255,255,255,0.08)',
    }}>

      {/* ── Left: explanatory message ───────────────────────────────────── */}
      <p style={{
        flex:       1,
        margin:     0,
        fontFamily: 'var(--font-main)',
        fontSize:   '15px',
        lineHeight: '1.6',
        color:      'rgba(228,228,231,0.5)',
      }}>
        Reaching{' '}
        <strong style={{ fontWeight: 700, color: 'white' }}>
          {score}
        </strong>
        {' '}requires improving markers beyond what current interventions can
        achieve.
      </p>

      {/* ── Right: Conversion Optimized CTA ─────────────────────────────── */}
      <ConversionCTA
        onClick={onConsultClick}
        aria-label={`Learn how to reach score ${score}`}
        style={{ flexShrink: 0 }}
      >
        Reach {score} faster →
      </ConversionCTA>

    </div>
  );
});

HealthScoreLimitCard.displayName = 'HealthScoreLimitCard';
export default HealthScoreLimitCard;
