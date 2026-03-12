import React from 'react';

const SUMMARY_CARDS = [
  {
    id: 'positive',
    label: 'Working for you',
    pillLabel: '3 markers',
    pillType: 'good',
    markers: [
      { name: 'HbA1c',          value: '5.4%',         bar: 85, color: 'green' },
      { name: 'Fasting Insulin', value: '7.6 µU/mL',   bar: 78, color: 'green' },
      { name: 'VO2 Max',        value: '41 mL/kg/min',  bar: 68, color: 'green' },
    ],
  },
  {
    id: 'negative',
    label: 'Needs attention',
    pillLabel: '2 markers',
    pillType: 'act',
    markers: [
      { name: 'Vitamin D',  value: '19.69 ng/mL', bar: 28, color: 'red' },
      { name: 'Body Fat %', value: '33.7%',        bar: 32, color: 'red' },
    ],
  },
  {
    id: 'watch',
    label: 'Watch closely',
    pillLabel: '1 marker',
    pillType: 'watch',
    markers: [
      { name: 'TSH', value: '5 µIU/mL', bar: 58, color: 'amber' },
    ],
  },
];

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
      `}</style>

      <div className="biomarker-grid">
        {SUMMARY_CARDS.map(card => (
          <div
            key={card.id}
            style={{
              background: 'var(--card-bg)',
              borderRadius: '18px',
              border: '1px solid var(--border-color)',
              padding: '20px 24px',
            }}
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
              {card.markers.map(m => (
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
                  <div style={{ width: '64px', height: '4px', background: 'var(--border-color)', borderRadius: '2px', flexShrink: 0 }}>
                    <div style={{
                      height: '4px',
                      borderRadius: '2px',
                      background: barColors[m.color],
                      width: `${m.bar}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DesktopBiomarkerRow;
