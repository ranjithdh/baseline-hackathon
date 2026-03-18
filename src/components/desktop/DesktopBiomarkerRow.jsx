import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import BiomarkerStatusTag from './BiomarkerStatusTag';

const SUMMARY_CARDS = [
  // 1. Working For You
  {
    id: 'positive',
    label: 'Working For You',
    pillLabel: '6 markers',
    pillType: 'good',
    markers: [
      { name: 'HbA1c',           value: '5.4%',          bar: 85, color: 'green', status: 'optimal' },
      { name: 'Fasting Insulin', value: '7.6 µU/mL',     bar: 78, color: 'green', status: 'optimal' },
      { name: 'VO2 Max',         value: '41 mL/kg/min',  bar: 68, color: 'green', status: 'normal'  },
      { name: 'HDL Cholesterol', value: '62 mg/dL',      bar: 80, color: 'green', status: 'optimal' },
      { name: 'Blood Pressure',  value: '118/76 mmHg',   bar: 90, color: 'green', status: 'optimal' },
      { name: 'Resting HR',      value: '58 bpm',        bar: 74, color: 'green', status: 'normal'  },
    ],
  },
  // 2. Watch Closely
  {
    id: 'watch',
    label: 'Watch Closely',
    pillLabel: '4 markers',
    pillType: 'watch',
    markers: [
      { name: 'TSH',          value: '5 µIU/mL',   bar: 58, color: 'amber', status: 'borderline_high' },
      { name: 'Cortisol',     value: '20 µg/dL',   bar: 62, color: 'amber', status: 'borderline_high' },
      { name: 'Ferritin',     value: '14 ng/mL',   bar: 45, color: 'amber', status: 'borderline_high' },
      { name: 'Homocysteine', value: '11 µmol/L',  bar: 50, color: 'amber', status: 'moderately_high' },
    ],
  },
  // 3. Needs Attention
  {
    id: 'negative',
    label: 'Needs Attention',
    pillLabel: '5 markers',
    pillType: 'act',
    markers: [
      { name: 'Vitamin D',     value: '19.69 ng/mL', bar: 28, color: 'red', status: 'low'  },
      { name: 'Body Fat %',    value: '33.7%',       bar: 32, color: 'red', status: 'high' },
      { name: 'LDL',           value: '142 mg/dL',   bar: 35, color: 'red', status: 'high' },
      { name: 'Triglycerides', value: '189 mg/dL',   bar: 30, color: 'red', status: 'high' },
      { name: 'CRP',           value: '3.2 mg/L',    bar: 22, color: 'red', status: 'high' },
    ],
  },
];

const VISIBLE_LIMIT = 3;

const pillColors = {
  good:  { bg: 'rgba(34,197,94,0.12)',   color: 'rgb(74,222,128)' },
  act:   { bg: 'rgba(239,68,68,0.12)',   color: 'rgb(252,165,165)' },
  watch: { bg: 'rgba(245,158,11,0.12)',  color: 'rgb(251,191,36)' },
};

const barColors = {
  green: 'rgb(var(--green-9))',
  red:   'rgb(var(--red-9))',
  amber: 'rgb(var(--amber-9))',
};

const DesktopBiomarkerRow = () => {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (cardId) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <>
      <style>{`
        .biomarker-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 28px 48px 0;
        }
        @media (max-width: 1024px) {
          .biomarker-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .biomarker-grid { grid-template-columns: 1fr; }
        }
        .view-more-btn {
          background: none;
          border: none;
          padding: 6px 0 0;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.6;
          transition: opacity 0.15s;
        }
        .view-more-btn:hover { opacity: 1; }
      `}</style>

      <div className="biomarker-grid">
        {SUMMARY_CARDS.map(card => {
          const isExpanded = !!expandedCards[card.id];
          const hasMore = card.markers.length > VISIBLE_LIMIT;
          const visibleMarkers = isExpanded ? card.markers : card.markers.slice(0, VISIBLE_LIMIT);
          const hiddenCount = card.markers.length - VISIBLE_LIMIT;

          return (
            <DashboardCard
              key={card.id}
              style={{ padding: '20px 24px' }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                }}>
                  {card.label}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  letterSpacing: '0.05em',
                  background: pillColors[card.pillType].bg,
                  color: pillColors[card.pillType].color,
                }}>
                  {card.pillLabel}
                </div>
              </div>

              {/* Markers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {visibleMarkers.map(m => (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <div style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 500 }}>{m.name}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}>
                      {m.value}
                    </div>
                    {/* Tags */}
                    <BiomarkerStatusTag status={m.status} />
                  </div>
                ))}
              </div>

              {/* View More / View Less */}
              {hasMore && (
                <button
                  className="view-more-btn"
                  onClick={() => toggleExpand(card.id)}
                  style={{ color: 'rgb(var(--primary)' }}
                >
                  {isExpanded ? 'View Less' : `View More (${hiddenCount})`}
                </button>
              )}
            </DashboardCard>
          );
        })}
      </div>
    </>
  );
};

export default DesktopBiomarkerRow;
