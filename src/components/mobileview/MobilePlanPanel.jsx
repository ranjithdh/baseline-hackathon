import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, ALL_ITEMS, BASE_SCORE, MAX_ACHIEVABLE } from '../desktop/desktopPlanData';
import HealthScoreSliderV2 from '../desktop/HealthScoreSliderV2';
import DashboardCard from '../desktop/DashboardCard';
import ActionPlanDownloadButton from '../desktop/ActionPlanDownloadButton';
import BuildActionPlanBanner from '../desktop/BuildActionPlanBanner';

const TICK_VALS = [65, 75, 85, 100];
const GOAL_MIN = BASE_SCORE;
const GOAL_MAX = 100;

const getScoreStatus = (score) => {
  if (score >= 85) return { text: 'Elite',       tagBg: 'rgb(var(--chart-6))', tagText: 'rgba(255,255,255,0.92)' };
  if (score >= 75) return { text: 'Strong',      tagBg: 'rgb(var(--chart-5))', tagText: 'rgba(255,255,255,0.92)' };
  if (score >= 65) return { text: 'Stable',      tagBg: 'rgb(var(--chart-4))', tagText: 'rgba(0,0,0,0.72)'       };
  if (score >= 50) return { text: 'Constrained', tagBg: 'rgb(var(--chart-3))', tagText: 'rgba(0,0,0,0.72)'       };
  return             { text: 'Compromised',  tagBg: 'rgb(var(--chart-2))', tagText: 'rgba(0,0,0,0.72)'       };
};

function computeNeeded(goalTarget) {
  const ptsNeeded = Math.min(goalTarget, MAX_ACHIEVABLE) - BASE_SCORE;
  let running = 0;
  const needed = new Set();
  for (const item of ALL_ITEMS) {
    if (item.gain === 0) continue;
    if (running < ptsNeeded) {
      needed.add(item.id);
      running += item.gain;
    }
  }
  return needed;
}

const ItemCard = ({ item, isSelected, isNeeded, onToggle }) => {
  const [hovered, setHovered] = useState(false);

  const bg = isSelected
    ? 'rgba(43,127,255,0.07)'
    : hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)';

  const borderColor = isSelected
    ? 'rgba(43,127,255,0.45)'
    : hovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)';

  return (
    <div
      onClick={() => onToggle(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'background 0.18s, border-color 0.18s',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: isSelected ? '0 0 0 2px rgba(43,127,255,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(var(--zinc-100))', fontFamily: 'var(--font-main)', lineHeight: 1.2 }}>
              {item.name}
            </span>
            {isNeeded && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                padding: '2px 6px', borderRadius: '100px', fontSize: '9px', fontWeight: 600,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase',
                background: 'rgba(255,197,61,0.14)', color: 'rgb(255,197,61)', border: '1px solid rgba(255,197,61,0.28)', whiteSpace: 'nowrap',
              }}>
                ★ needed
              </span>
            )}
          </div>
        </div>
        {isSelected ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '4px 8px', borderRadius: '100px',
            fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-mono)', background: 'rgba(43,127,255,0.18)',
            color: 'rgb(43,127,255)', border: '1px solid rgba(43,127,255,0.3)', flexShrink: 0,
          }}>
            ✓ Added
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: item.gain > 0 ? '18px' : '14px', fontWeight: 700, color: item.gain > 0 ? 'rgb(48,164,108)' : 'rgba(255,255,255,0.2)' }}>
              {item.gain > 0 ? `+${item.gain}` : '—'}
            </span>
            {item.gain > 0 && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>pts</span>}
          </div>
        )}
      </div>
      <p style={{ fontSize: '11px', color: 'rgba(228,228,231,0.5)', lineHeight: 1.5, margin: 0 }}>
        {item.detail}
      </p>
    </div>
  );
};

const MobilePlanPanel = ({ goalTarget, onGoalChange, onBookConsult, onBack }) => {
  const [selectedIds, setSelectedIds] = useState(() => computeNeeded(goalTarget));
  const [expandedCats, setExpandedCats] = useState({ supplements: true });

  const [baselineScore, setBaselineScore] = useState(() => goalTarget);
  const showActionPlanButton = goalTarget !== baselineScore;

  const savedSelectedIdsRef = useRef(null);
  if (savedSelectedIdsRef.current === null) {
    savedSelectedIdsRef.current = new Set(computeNeeded(goalTarget));
  }

  const handleBuildActionPlan = useCallback(() => {
    const newIds = new Set(computeNeeded(goalTarget));
    savedSelectedIdsRef.current = newIds;
    setBaselineScore(goalTarget);
    setSelectedIds(newIds);
  }, [goalTarget]);

  const neededIds = useMemo(() => computeNeeded(baselineScore), [baselineScore]);
  
  const gained = ALL_ITEMS.filter(i => selectedIds.has(i.id)).reduce((s, i) => s + i.gain, 0);
  const projScore = Math.min(100, BASE_SCORE + gained);
  const totalSelected = ALL_ITEMS.filter(i => selectedIds.has(i.id)).length;

  const handleToggleItem = useCallback((id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);

    const newGained = ALL_ITEMS.filter(i => next.has(i.id)).reduce((s, i) => s + i.gain, 0);
    const newProjScore = Math.min(GOAL_MAX, Math.max(GOAL_MIN, BASE_SCORE + newGained));

    savedSelectedIdsRef.current = next;
    setSelectedIds(next);
    setBaselineScore(newProjScore);
    onGoalChange(newProjScore);
  }, [selectedIds, onGoalChange]);

  const toggleCat = (id) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#000000] relative overflow-y-auto overflow-x-hidden">
      {/* Navigation Header */}
      <div style={{ 
        padding: '20px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        position: 'sticky',
        top: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <button 
          onClick={onBack}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span style={{ 
          fontSize: '18px', 
          fontWeight: 800, 
          color: '#ffffff', 
          fontFamily: 'var(--font-heading)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Goals & Action Plan
        </span>
      </div>

      <div className="w-full flex flex-col gap-6 px-4 mt-6 mb-24 relative z-10 box-border">
        {/* 1. Header Score Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>{projScore}</span>
            <span style={{ fontSize: '24px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-heading)' }}>/ {goalTarget}</span>
            <div style={{
              marginLeft: '8px',
              background: 'rgba(48,164,108,0.1)',
              color: '#30A46C',
              padding: '4px 10px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: 700,
              border: '1px solid rgba(48,164,108,0.2)'
            }}>
              +{gained} projected
            </div>
          </div>
      </div>

      {/* 2. Interactive Slider Section */}
      <div style={{ padding: '0 4px', marginBottom: '8px' }}>
        <HealthScoreSliderV2
          score={goalTarget}
          onChange={(val) => {
            const g = parseInt(val);
            onGoalChange(g);
            if (g === baselineScore) {
              setSelectedIds(new Set(savedSelectedIdsRef.current));
            } else {
              setSelectedIds(new Set());
            }
          }}
          min={BASE_SCORE}
          max={100}
          ticks={TICK_VALS}
          minAllowedScore={BASE_SCORE}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', opacity: 0.5 }}>
          <span style={{ color: '#ffffff' }}>{BASE_SCORE} CURRENT</span>
          <span style={{ color: '#ffffff' }}>100 OPTIMAL</span>
        </div>
      </div>

      {/* 2.5 Build Plan CTA */}
      <AnimatePresence>
        {showActionPlanButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ padding: '0 4px', marginBottom: '8px' }}
          >
            <BuildActionPlanBanner 
              targetScore={goalTarget}
              onClick={handleBuildActionPlan} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Action Plan Section */}
      <div style={{ 
        marginTop: '12px',
        opacity: showActionPlanButton ? 0.4 : 1,
        pointerEvents: showActionPlanButton ? 'none' : 'auto',
        transition: 'opacity 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 4px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.05em', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>Action Plan</h2>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
            {totalSelected} CHOSEN · +{gained} PTS
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {CATEGORIES.map(cat => {
            const isExpanded = expandedCats[cat.id];
            const catSelected = cat.items.filter(i => selectedIds.has(i.id)).length;
            
            return (
              <div key={cat.id} style={{
                background: '#121212',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden'
              }}>
                <div 
                  onClick={() => toggleCat(cat.id)}
                  style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                >
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '12px', 
                    background: 'rgba(43,127,255,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#2B63FF' }}>
                      {cat.id === 'supplements' ? 'pill' : cat.id === 'food' ? 'restaurant' : 'fitness_center'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {catSelected > 0 ? `${catSelected} chosen` : `${cat.items.length} recommended`}
                    </div>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.3)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    expand_more
                  </span>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {cat.items.map(item => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            isSelected={selectedIds.has(item.id)}
                            isNeeded={neededIds.has(item.id)}
                            onToggle={handleToggleItem}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </div>
);
};

export default MobilePlanPanel;
