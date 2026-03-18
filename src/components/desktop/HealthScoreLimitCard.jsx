import React from 'react';
import PrimaryButton from './PrimaryButton';

// ─────────────────────────────────────────────────────────────────────────────
// HealthScoreLimitCard
//
// Shown in DesktopPlanPanel when the user's goal exceeds MAX_ACHIEVABLE.
// Layout: message (left, flex-1) | "Book a consult" PrimaryButton (right).
//
// Props
//   score          {number}    Target score shown in the message  (e.g. 83)
//   onConsultClick {function}  Called when "Book a consult" is clicked
//
// Usage
//   <HealthScoreLimitCard score={83} onConsultClick={handleConsult} />
// ─────────────────────────────────────────────────────────────────────────────

const HealthScoreLimitCard = React.memo(({ score, onConsultClick }) => {
  return (
    <div style={{
      width:      '100%',
      boxSizing:  'border-box',
      display:    'flex',
      alignItems: 'center',
      gap:        '24px',
      padding:    '16px 24px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border:     '1px solid rgb(var(--border))',
    }}>

      {/* ── Left: explanatory message ───────────────────────────────────── */}
      <p style={{
        flex:       1,
        margin:     0,
        fontFamily: 'var(--font-main)',
        fontSize:   '13px',
        lineHeight: '1.6',
        color:      'rgb(var(--muted-foreground))',
      }}>
        Reaching{' '}
        <strong style={{ fontWeight: 700, color: 'rgb(var(--foreground))' }}>
          {score}
        </strong>
        {' '}requires improving markers beyond what current interventions can
        achieve.
      </p>

      {/* ── Right: CTA button ───────────────────────────────────────────── */}
      <PrimaryButton
        onClick={onConsultClick}
        type="button"
        aria-label="Book a health consult"
        style={{ flexShrink: 0 }}
      >
        Book a consult
      </PrimaryButton>

    </div>
  );
});

HealthScoreLimitCard.displayName = 'HealthScoreLimitCard';
export default HealthScoreLimitCard;
