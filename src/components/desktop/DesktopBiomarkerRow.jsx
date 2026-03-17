import React, { useState, useMemo } from 'react';

// ─── Full biomarker dataset (100+ markers across 3 categories) ─────────────────
const ALL_MARKERS = {
  positive: [
    { name: 'HbA1c',            value: '5.4%',          unit: '%',         bar: 85, trend: +0.3 },
    { name: 'Fasting Insulin',  value: '7.6',            unit: 'µU/mL',    bar: 78, trend: -0.5 },
    { name: 'VO2 Max',          value: '41',             unit: 'mL/kg/min', bar: 68, trend: +2.1 },
    { name: 'HDL Cholesterol',  value: '62',             unit: 'mg/dL',    bar: 80, trend: +3.0 },
    { name: 'Blood Pressure',   value: '118/76',         unit: 'mmHg',     bar: 90, trend: 0 },
    { name: 'Resting HR',       value: '58',             unit: 'bpm',      bar: 74, trend: -2.0 },
    { name: 'Magnesium',        value: '2.1',            unit: 'mg/dL',    bar: 76, trend: +0.1 },
    { name: 'Vitamin B12',      value: '520',            unit: 'pg/mL',    bar: 82, trend: +10 },
    { name: 'Zinc',             value: '95',             unit: 'µg/dL',    bar: 79, trend: +4 },
    { name: 'Folate',           value: '12.4',           unit: 'ng/mL',    bar: 84, trend: +0.8 },
    { name: 'Testosterone (T)', value: '620',            unit: 'ng/dL',    bar: 75, trend: +15 },
    { name: 'Free T3',          value: '3.2',            unit: 'pg/mL',    bar: 72, trend: 0 },
    { name: 'Platelets',        value: '220',            unit: 'K/µL',     bar: 80, trend: +5 },
    { name: 'eGFR',             value: '92',             unit: 'mL/min',   bar: 88, trend: +1 },
    { name: 'ALT',              value: '22',             unit: 'U/L',      bar: 85, trend: -3 },
    { name: 'GGT',              value: '18',             unit: 'U/L',      bar: 82, trend: -2 },
    { name: 'Albumin',          value: '4.5',            unit: 'g/dL',     bar: 90, trend: 0 },
    { name: 'Total Protein',    value: '7.2',            unit: 'g/dL',     bar: 86, trend: +0.2 },
    { name: 'Calcium',          value: '9.4',            unit: 'mg/dL',    bar: 84, trend: 0 },
    { name: 'Sodium',           value: '140',            unit: 'mEq/L',    bar: 88, trend: 0 },
  ],
  negative: [
    { name: 'Vitamin D',        value: '19.69',          unit: 'ng/mL',    bar: 28, trend: -2.1 },
    { name: 'Body Fat %',       value: '33.7',           unit: '%',        bar: 32, trend: +1.2 },
    { name: 'LDL',              value: '142',            unit: 'mg/dL',    bar: 35, trend: +8 },
    { name: 'Triglycerides',    value: '189',            unit: 'mg/dL',    bar: 30, trend: +12 },
    { name: 'CRP',              value: '3.2',            unit: 'mg/L',     bar: 22, trend: +0.5 },
    { name: 'Uric Acid',        value: '7.8',            unit: 'mg/dL',    bar: 30, trend: +0.4 },
    { name: 'HOMA-IR',          value: '2.9',            unit: '',         bar: 28, trend: +0.3 },
    { name: 'ApoB',             value: '120',            unit: 'mg/dL',    bar: 25, trend: +5 },
    { name: 'hsCRP',            value: '3.4',            unit: 'mg/L',     bar: 22, trend: +0.6 },
    { name: 'Visceral Fat',     value: '14',             unit: 'rating',   bar: 30, trend: +1 },
    { name: 'Lp(a)',            value: '45',             unit: 'mg/dL',    bar: 26, trend: +3 },
    { name: 'IL-6',             value: '3.8',            unit: 'pg/mL',    bar: 24, trend: +0.4 },
    { name: 'Insulin',          value: '18',             unit: 'µU/mL',    bar: 32, trend: +2 },
    { name: 'FBG',              value: '108',            unit: 'mg/dL',    bar: 35, trend: +4 },
    { name: 'Total Cholesterol',value: '218',            unit: 'mg/dL',    bar: 33, trend: +10 },
  ],
  watch: [
    { name: 'TSH',              value: '5.0',            unit: 'µIU/mL',   bar: 58, trend: +0.5 },
    { name: 'Cortisol',        value: '20',             unit: 'µg/dL',    bar: 62, trend: +2 },
    { name: 'Ferritin',        value: '14',             unit: 'ng/mL',    bar: 45, trend: -1 },
    { name: 'Homocysteine',    value: '11',             unit: 'µmol/L',   bar: 50, trend: +0.5 },
    { name: 'Free T4',         value: '1.0',            unit: 'ng/dL',    bar: 55, trend: 0 },
    { name: 'DHEA-S',          value: '180',            unit: 'µg/dL',    bar: 48, trend: -10 },
    { name: 'Prolactin',       value: '18',             unit: 'ng/mL',    bar: 52, trend: +2 },
    { name: 'Potassium',       value: '3.5',            unit: 'mEq/L',    bar: 55, trend: -0.1 },
    { name: 'WBC',             value: '10.2',           unit: 'K/µL',     bar: 50, trend: +0.8 },
    { name: 'RBC',             value: '4.2',            unit: 'M/µL',     bar: 53, trend: -0.1 },
    { name: 'Hematocrit',      value: '40',             unit: '%',        bar: 55, trend: -1 },
    { name: 'MCV',             value: '76',             unit: 'fL',       bar: 48, trend: -2 },
    { name: 'MCHC',            value: '31',             unit: 'g/dL',     bar: 50, trend: -0.5 },
    { name: 'AST',             value: '38',             unit: 'U/L',      bar: 60, trend: +3 },
    { name: 'BUN',             value: '22',             unit: 'mg/dL',    bar: 58, trend: +1 },
    { name: 'Creatinine',      value: '1.1',            unit: 'mg/dL',    bar: 62, trend: +0.05 },
    { name: 'Bilirubin',       value: '1.4',            unit: 'mg/dL',    bar: 55, trend: +0.2 },
    { name: 'ALP',             value: '90',             unit: 'U/L',      bar: 60, trend: +5 },
    { name: 'LDH',             value: '220',            unit: 'U/L',      bar: 58, trend: +10 },
    { name: 'Phosphorus',      value: '2.6',            unit: 'mg/dL',    bar: 52, trend: -0.2 },
  ],
};

const CARDS = [
  {
    id: 'positive',
    label: 'Working For You',
    emoji: '✅',
    count: ALL_MARKERS.positive.length,
    theme: {
      pill: { bg: 'rgba(34,197,94,0.14)', color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
      bar: '#22c55e',
      barGlow: 'rgba(34,197,94,0.4)',
      barBg: 'rgba(34,197,94,0.08)',
      accent: '#4ade80',
      cardBorder: 'rgba(34,197,94,0.12)',
      headerLine: 'rgba(34,197,94,0.18)',
      trendUp: '#4ade80',
      trendDown: '#f87171',
    },
  },
  {
    id: 'negative',
    label: 'Needs Attention',
    emoji: '⚠️',
    count: ALL_MARKERS.negative.length,
    theme: {
      pill: { bg: 'rgba(239,68,68,0.14)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
      bar: '#ef4444',
      barGlow: 'rgba(239,68,68,0.4)',
      barBg: 'rgba(239,68,68,0.08)',
      accent: '#f87171',
      cardBorder: 'rgba(239,68,68,0.12)',
      headerLine: 'rgba(239,68,68,0.18)',
      trendUp: '#f87171',   // going up = worse for "attention" markers
      trendDown: '#4ade80', // going down = improvement
    },
  },
  {
    id: 'watch',
    label: 'Watch Closely',
    emoji: '👁',
    count: ALL_MARKERS.watch.length,
    theme: {
      pill: { bg: 'rgba(245,158,11,0.14)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
      bar: '#f59e0b',
      barGlow: 'rgba(245,158,11,0.4)',
      barBg: 'rgba(245,158,11,0.08)',
      accent: '#fbbf24',
      cardBorder: 'rgba(245,158,11,0.12)',
      headerLine: 'rgba(245,158,11,0.18)',
      trendUp: '#f87171',
      trendDown: '#4ade80',
    },
  },
];

const PAGE_SIZE = 5;

// ─── Mini trend arrow ───────────────────────────────────────────────────────────
const TrendBadge = ({ trend, isAttention }) => {
  if (trend === 0) return null;
  const isPositive = isAttention ? trend < 0 : trend > 0;
  const color = isPositive ? '#4ade80' : '#f87171';
  return (
    <span style={{
      fontSize: '9px', fontWeight: 700, color,
      display: 'inline-flex', alignItems: 'center', gap: '1px',
      marginLeft: '4px', letterSpacing: '-0.02em',
    }}>
      {trend > 0 ? '▲' : '▼'}{Math.abs(trend)}
    </span>
  );
};

// ─── Single biomarker row ───────────────────────────────────────────────────────
const MarkerRow = ({ marker, theme, isAttention, index, revealed }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '9px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateX(0)' : 'translateX(-8px)',
    transition: `opacity 0.3s ease ${index * 0.04}s, transform 0.3s ease ${index * 0.04}s`,
  }}>
    {/* Name */}
    <div style={{
      flex: 1, fontSize: '13px', fontWeight: 500,
      color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {marker.name}
    </div>

    {/* Value + unit + trend */}
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: '3px',
      flexShrink: 0, minWidth: '90px', justifyContent: 'flex-end',
    }}>
      <span style={{
        fontSize: '13px', fontWeight: 700, color: theme.accent,
        fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace',
      }}>{marker.value}</span>
      {marker.unit && (
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          {marker.unit}
        </span>
      )}
      <TrendBadge trend={marker.trend} isAttention={isAttention} />
    </div>

    {/* Bar */}
    <div style={{
      width: '72px', height: '5px', flexShrink: 0,
      background: theme.barBg, borderRadius: '99px', overflow: 'visible',
    }}>
      <div style={{
        height: '5px', borderRadius: '99px',
        background: `linear-gradient(90deg, ${theme.bar}88, ${theme.bar})`,
        width: revealed ? `${marker.bar}%` : '0%',
        boxShadow: marker.bar > 60 ? `0 0 8px ${theme.barGlow}` : 'none',
        transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${0.3 + index * 0.04}s`,
      }} />
    </div>
  </div>
);

// ─── Single card ────────────────────────────────────────────────────────────────
const BiomarkerCard = ({ card, markers, revealed }) => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return markers;
    return markers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  }, [markers, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageMarkers = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(0); };

  return (
    <div style={{
      background: 'rgba(18,18,24,0.92)',
      borderRadius: '20px',
      border: `1px solid ${card.theme.cardBorder}`,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
      transition: 'box-shadow 0.3s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${card.theme.cardBorder}, inset 0 1px 0 rgba(255,255,255,0.06)`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = `0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`}
    >
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '14px', paddingBottom: '12px',
        borderBottom: `1px solid ${card.theme.headerLine}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>{card.emoji}</span>
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
          }}>{card.label}</span>
        </div>
        <div style={{
          fontSize: '10px', fontWeight: 700,
          padding: '3px 11px', borderRadius: '100px',
          background: card.theme.pill.bg,
          color: card.theme.pill.color,
          border: `1px solid ${card.theme.pill.border}`,
          letterSpacing: '0.04em',
        }}>
          {markers.length} markers
        </div>
      </div>

      {/* Search */}
      {markers.length > PAGE_SIZE && (
        <div style={{ marginBottom: '10px', position: 'relative' }}>
          <input
            value={search}
            onChange={handleSearch}
            placeholder={`Search ${card.label.toLowerCase()}...`}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '10px',
              padding: '7px 12px 7px 30px', color: 'rgba(255,255,255,0.8)',
              fontSize: '12px', outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = card.theme.accent}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <svg style={{ position: 'absolute', left: '10px', top: '8px', opacity: 0.4 }}
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      )}

      {/* Marker rows */}
      <div style={{ flex: 1, minHeight: '220px' }}>
        {pageMarkers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
            No markers match "{search}"
          </div>
        ) : (
          pageMarkers.map((m, i) => (
            <MarkerRow key={m.name} marker={m} theme={card.theme}
              isAttention={card.id === 'negative'} index={i} revealed={revealed} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '14px', paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '4px 12px', color: page === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
              fontSize: '11px', fontWeight: 600, cursor: page === 0 ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            ← Prev
          </button>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <div key={i} onClick={() => setPage(i)} style={{
                width: i === page ? '16px' : '6px',
                height: '6px', borderRadius: '99px',
                background: i === page ? card.theme.accent : 'rgba(255,255,255,0.18)',
                cursor: 'pointer', transition: 'all 0.2s',
              }} />
            ))}
          </div>
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '4px 12px',
              color: page === totalPages - 1 ? 'rgba(255,255,255,0.2)' : '#fff',
              fontSize: '11px', fontWeight: 600,
              cursor: page === totalPages - 1 ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* View more / less simple toggle if no pagination */}
      {totalPages <= 1 && markers.length > PAGE_SIZE && filtered.length <= PAGE_SIZE && search && (
        <button onClick={() => setSearch('')} style={{
          marginTop: '10px', background: 'none', border: 'none', padding: 0,
          color: card.theme.accent, fontSize: '11px', fontWeight: 600,
          cursor: 'pointer', textAlign: 'left', letterSpacing: '0.04em',
        }}>
          Clear search ✕
        </button>
      )}
    </div>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────────
const DesktopBiomarkerRow = () => {
  const [revealed] = React.useState(true);
  const totalMarkers = Object.values(ALL_MARKERS).reduce((s, arr) => s + arr.length, 0);

  return (
    <>
      <style>{`
        .biomarker-section {
          padding: 28px 48px 0;
        }
        .biomarker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .biomarker-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 1100px) {
          .biomarker-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .biomarker-grid { grid-template-columns: 1fr; }
          .biomarker-section { padding: 20px 20px 0; }
        }
      `}</style>

      <div className="biomarker-section">
        {/* Section header */}
        <div className="biomarker-header">
          <div>
            <h2 style={{
              fontSize: '13px', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
              marginBottom: '2px',
            }}>
              Your Biomarkers
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>
              Tracking <strong style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{totalMarkers}+</strong> markers across all body systems
            </p>
          </div>
          <div style={{
            fontSize: '11px', fontWeight: 600,
            padding: '5px 14px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.04em',
          }}>
            Last Synced: Today
          </div>
        </div>

        {/* Cards grid */}
        <div className="biomarker-grid">
          {CARDS.map(card => (
            <BiomarkerCard
              key={card.id}
              card={card}
              markers={ALL_MARKERS[card.id]}
              revealed={revealed}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DesktopBiomarkerRow;
