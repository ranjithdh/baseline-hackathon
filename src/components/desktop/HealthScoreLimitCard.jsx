import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// HealthScoreLimitCard
//
// Replaces ExpertGuidanceCard in DesktopPlanPanel when the user's goal
// exceeds the maximum achievable score. The original ExpertGuidanceCard is
// intentionally untouched (DesktopDashboard still uses it).
//
// Design (reference screenshot):
//   ┌─────────────────────────────────────────────────────────────────────────┐
//   │  Reaching {score} requires improving markers beyond what current        │
//   │  interventions can achieve.  Book a consult  or retest in 8 weeks to   │
//   │  unlock further gains.                                                  │
//   └─────────────────────────────────────────────────────────────────────────┘
//
//   • Full-width single-row (wraps on mobile)
//   • Transparent background
//   • 1 px theme border  (rgb(var(--border)))
//   • Theme text color  (rgb(var(--foreground)))
//   • {score} — bold, same text color
//   • "Book a consult" — inline clickable text link, brand color + underline
//   • No heading, no separate button, no extra icons
//
// Props
//   score         {number}    Target score shown in the message  (e.g. 83)
//   onConsultClick {function} Called when "Book a consult" is clicked
//
// Usage
//   <HealthScoreLimitCard score={83} onConsultClick={handleConsult} />
// ─────────────────────────────────────────────────────────────────────────────

const HealthScoreLimitCard = React.memo(({ score, onConsultClick }) => {
  return (
    <div
      style={{
        width:         '100%',
        boxSizing:     'border-box',
        // ── Layout ─────────────────────────────────────────────────────────
        display:        'flex',
        alignItems:     'center',
        padding:        '14px 20px',
        borderRadius:   '10px',
        // ── Colours — design system tokens only ────────────────────────────
        background:     'transparent',
        border:         '1px solid rgb(var(--border))',
        // ── Typography baseline ────────────────────────────────────────────
        fontFamily:     'var(--font-main)',
        fontSize:       '13px',
        lineHeight:     '1.6',
        color:          'rgb(var(--foreground))',
      }}
    >
      {/* ── Message ─────────────────────────────────────────────────────── */}
      <p style={{ margin: 0 }}>
        {'Reaching '}

        {/* Score — bold, inherits theme foreground */}
        <strong style={{ fontWeight: 700 }}>{score}</strong>

        {' requires improving markers beyond what current interventions can achieve. '}

        {/* "Book a consult" — inline clickable link */}
        <button
          onClick={onConsultClick}
          style={{
            // Reset button defaults
            all:            'unset',
            // Inline with surrounding text
            display:        'inline',
            cursor:         'pointer',
            // Brand color + underline to signal interactivity
            color:          'rgb(var(--brand-color-text))',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
            fontWeight:     500,
            fontFamily:     'inherit',
            fontSize:       'inherit',
            lineHeight:     'inherit',
            // Smooth hover feedback without layout shift
            transition:     'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          // Accessibility
          type="button"
          aria-label="Book a health consult"
        >
          Book a consult
        </button>

        {' or retest in 8 weeks to unlock further gains.'}
      </p>
    </div>
  );
});

HealthScoreLimitCard.displayName = 'HealthScoreLimitCard';
export default HealthScoreLimitCard;
