import React, { useState } from 'react';
import DashboardCard from '../desktop/DashboardCard';
import BiomarkerStatusTag from '../desktop/BiomarkerStatusTag';
import { motion, AnimatePresence } from 'framer-motion';

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

const MobileBiomarkerSummary = () => {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (cardId) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="flex flex-col gap-4 px-4 w-full mb-6 relative z-10">
      {SUMMARY_CARDS.map(card => {
        const isExpanded = !!expandedCards[card.id];
        const hasMore = card.markers.length > VISIBLE_LIMIT;
        const visibleMarkers = isExpanded ? card.markers : card.markers.slice(0, VISIBLE_LIMIT);
        const hiddenCount = card.markers.length - VISIBLE_LIMIT;

        return (
          <DashboardCard
            key={card.id}
            style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column' }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AnimatePresence>
                {visibleMarkers.map(m => (
                  <motion.div 
                    key={m.name} 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>{m.name}</div>
                      <div style={{
                        fontFamily: 'var(--font-main)',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.4)',
                      }}>
                        {m.value}
                      </div>
                    </div>
                    {/* Status Tag */}
                    <div style={{
                      padding: '6px 14px',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: m.color === 'green' ? 'rgba(48,164,108,0.1)' : m.color === 'amber' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                      color: m.color === 'green' ? '#30A46C' : m.color === 'amber' ? '#F59E0B' : '#EF4444',
                      border: `1px solid ${m.color === 'green' ? 'rgba(48,164,108,0.2)' : m.color === 'amber' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      textTransform: 'capitalize'
                    }}>
                      {m.status.replace('_', ' ')}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* View More / View Less */}
            {hasMore && (
              <button
                onClick={() => toggleExpand(card.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 0 0',
                  marginTop: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgb(var(--primary))',
                  opacity: 0.7,
                  transition: 'opacity 0.15s',
                  alignSelf: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
              >
                {isExpanded ? 'View Less' : `View More (${hiddenCount})`}
              </button>
            )}
          </DashboardCard>
        );
      })}
    </div>
  );
};

export default MobileBiomarkerSummary;
