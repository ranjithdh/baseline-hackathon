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
      padding:    '16px 32px',
      borderRadius: '20px',
      background: 'linear-gradient(to right, #253282 0%, 21.09704613685608%, #374DAE 42.19409227371216%, 71.09704613685608%, #537DD3 100%)',
    }}>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',   // spacing between the two lines
    flex: 1
  }}> 

      {/* ── Left: explanatory message ───────────────────────────────────── */}
      <p style={{
        flex:       1,
        margin:     0,
        fontFamily: 'var(--font-main)',
        fontSize:   '18px',
        lineHeight: '1.6',
        fontWeight: 700,
        color:      '#ffffff',
      }}>
       Free Consultations 
      </p>
      <p style={{
        flex:       1,
        margin:     0,
        fontFamily: 'var(--font-main)',
        fontSize:   '14px',
        lineHeight: '1.6',
        color:      'rgba(228,228,231,0.5)',
      }}>
       Achieve your target score of{' '}
<strong style={{ fontWeight: 700, color: 'white', fontSize: '16px' }}>
  {score}
</strong>{' '}
faster with personalized guidance from our expert consultations.
      </p>
      </div>

      {/* ── Right: Conversion Optimized CTA ─────────────────────────────── */}
      <ConversionCTA
        onClick={onConsultClick}
        aria-label={`Learn how to reach score ${score}`}
        style={{ flexShrink: 0 }}
      >
        Book your Free Consult
      </ConversionCTA>

    </div>
  );
});

HealthScoreLimitCard.displayName = 'HealthScoreLimitCard';
export default HealthScoreLimitCard;
