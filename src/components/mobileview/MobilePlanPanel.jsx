import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, ALL_ITEMS, BASE_SCORE, MAX_ACHIEVABLE } from '../desktop/desktopPlanData';
import MobileHealthScoreSlider from './MobileHealthScoreSlider';
import DashboardCard from '../desktop/DashboardCard';
import ActionPlanDownloadButton from '../desktop/ActionPlanDownloadButton';
import BuildActionPlanBanner from '../desktop/BuildActionPlanBanner';

const TICK_VALS = [65, 75, 85, 100];
const GOAL_MIN = BASE_SCORE;
const GOAL_MAX = 100;

const getScoreStatus = (score) => {
  if (score >= 85) return { text: 'Elite', color: 'rgb(var(--chart-6))', colorRgb: '--chart-6' };
  if (score >= 75) return { text: 'Robust', color: 'rgb(var(--chart-5))', colorRgb: '--chart-5' };
  if (score >= 65) return { text: 'Stable', color: 'rgb(var(--chart-4))', colorRgb: '--chart-4' };
  if (score >= 50) return { text: 'Constrained', color: 'rgb(var(--chart-3))', colorRgb: '--chart-3' };
  return { text: 'Compromised', color: 'rgb(var(--chart-2))', colorRgb: '--chart-2' };
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

  const borderColor = isSelected
    ? 'rgba(43,127,255,0.55)'
    : hovered ? 'rgba(255,255,255,0.13)' : 'rgba(255, 255, 255, 0.06)';

  return (
    <div
      onClick={() => onToggle(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgb(var(--card))',
        border: isSelected ? `1.5px solid ${borderColor}` : `1px solid ${borderColor}`,
        borderRadius: '20px',
        padding: '16px',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        transition: 'border-color 0.18s',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {item.gain > 0 && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-heading)' }}>
                  +{item.gain}
                </span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>pts</span>
              </div>
            )}
            <span style={{
              display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '100px',
              fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0,
            }}>
              ✓ Remove
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {item.gain > 0 && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(48,164,108)', fontFamily: 'var(--font-heading)' }}>
                  +{item.gain}
                </span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>pts</span>
              </div>
            )}
            <span style={{
              display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '100px',
              fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)', background: 'rgba(43,127,255,0.18)',
              color: 'rgb(43,127,255)', border: '1px solid rgba(43,127,255,0.3)', flexShrink: 0,
            }}>
              + Add
            </span>
          </div>
        )}
      </div>
      <div style={{
        marginTop: '12px',
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.15)',
        margin: '0 -16px -16px',
        borderRadius: '0 0 16px 16px'
      }}>
        {item.tags && item.tags.length > 0 && (
          <div style={{
            fontSize: '9px',
            color: 'rgba(228,228,231,0.4)',
            marginBottom: '6px',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            Related Biomarkers
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {item.tags && item.tags.map(tag => (
            <span key={tag} style={{
              padding: '4px 10px', borderRadius: '100px',
              fontSize: '10px', fontWeight: 500,
              color: 'rgb(48,164,108)',
              background: 'rgba(48,164,108,0.08)',
              border: '1px solid rgba(48,164,108,0.28)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const MobilePlanPanel = ({ goalTarget, onGoalChange, onBookConsult, onBack }) => {
  const [selectedIds, setSelectedIds] = useState(() => computeNeeded(goalTarget));
  const [activeTab, setActiveTab] = useState('all');
  const [isExtended, setIsExtended] = useState(true);

  const containerRef = useRef(null);
  const scrollTimeout = useRef(null);
  const lastY = useRef(0);

  const [baselineScore, setBaselineScore] = useState(() => goalTarget);
  const showActionPlanButton = goalTarget !== baselineScore;

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const currentY = containerRef.current.scrollTop;

    // Collapse on scroll down (downward momentum)
    // Expand on scroll up or if at the very top
    if (currentY > lastY.current && currentY > 50) {
      if (isExtended) setIsExtended(false);
    } else if (currentY < lastY.current || currentY <= 10) {
      if (!isExtended) setIsExtended(true);
    }

    lastY.current = currentY;
  }, [isExtended]);

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

  // Live score that reflects slider movement OR chosen items
  const displayScore = showActionPlanButton
    ? goalTarget
    : projScore;

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

  const activeCategory = CATEGORIES.find(c => c.id === activeTab);
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full flex flex-col h-[100dvh] bg-[#000000] relative overflow-y-auto overflow-x-hidden"
    >
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '4px 8px' }}>
          <span style={{ fontSize: '42px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{displayScore}</span>

          {(() => {
            const status = getScoreStatus(displayScore);
            return (
              <motion.div
                animate={{
                  borderColor: `rgb(var(${status.colorRgb}) / 0.6)`,
                  boxShadow: `0 0 20px rgb(var(${status.colorRgb}) / 0.15)`
                }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 16px',
                  borderRadius: '40px',
                  background: `rgb(var(${status.colorRgb}) / 0.2)`,
                  backdropFilter: 'blur(32px)',
                  border: `1px solid rgb(var(${status.colorRgb}) / 0.9)`,
                  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={status.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '1.2px',
                      color: '#ffffff',
                      fontFamily: "'FuturLuxe', sans-serif"
                    }}
                  >
                    {status.text}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            );
          })()}
        </div>

        <MobileHealthScoreSlider
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

          {/* ── TAB BAR ── */}
          <div style={{
            display: 'flex', gap: '8px', marginBottom: '20px',
            overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            {[{ id: 'all', name: 'All', icon: '✨' }, ...CATEGORIES].map(cat => {
              const isActive = cat.id === activeTab;
              const catSelected = cat.id === 'all'
                ? selectedIds.size
                : cat.items.filter(i => selectedIds.has(i.id)).length;
              const catNeeded = cat.id === 'all'
                ? neededIds.size > 0
                : cat.items.some(i => neededIds.has(i.id));

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: isActive
                      ? '1px solid rgba(255,255,255,0.2)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgb(var(--card))',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    fontSize: '12px', fontWeight: isActive ? 600 : 400,
                    fontFamily: 'var(--font-main)',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                    outline: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {/* Name + count inline */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {cat.icon && <span style={{ fontSize: '13px' }}>{cat.icon}</span>}
                    <span>
                      {cat.name}
                      {catSelected > 0 && (
                        <span style={{
                          marginLeft: '5px',
                          fontSize: '11px',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          ({catSelected})
                        </span>
                      )}
                    </span>
                  </span>
                  {/* Green dot — items selected */}
                  {catSelected > 0 && (
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'rgb(48,164,108)',
                      flexShrink: 0,
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── ACTIVE CATEGORY ITEMS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence mode="popLayout">
              {(activeTab === 'all' ? ALL_ITEMS : activeCategory?.items || []).map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ItemCard
                    item={item}
                    isSelected={selectedIds.has(item.id)}
                    isNeeded={neededIds.has(item.id)}
                    onToggle={handleToggleItem}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Consultation Button (Material Design 3 EFAB) - Only show if not building a new plan */}
        <AnimatePresence>
          {!showActionPlanButton && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: '-50%', scale: 0.8 }}
              animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
              exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.8, transition: { duration: 0.2 } }}
              style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                zIndex: 1000,
                pointerEvents: 'none',
              }}
            >
              <motion.button
                layout
                initial={false}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 12px -2px rgba(0,0,0,0.3), 0 0 15px rgba(43,127,255,0.25)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onBookConsult}
                animate={{
                  padding: isExtended ? '0 20px' : '0',
                  gap: isExtended ? '12px' : '0'
                }}
                transition={{
                  layout: { type: 'spring', stiffness: 400, damping: 35 },
                  padding: { type: 'spring', stiffness: 400, damping: 35 },
                  gap: { type: 'spring', stiffness: 400, damping: 35 }
                }}
                style={{
                  height: '56px',
                  minWidth: '56px',
                  borderRadius: '28px',
                  background: 'linear-gradient(135deg, #253282 0%, #374DAE 50%, #537DD3 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 8px -2px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  overflow: 'hidden',
                }}
              >
                <motion.span
                  layout="position"
                  className="material-symbols-outlined"
                  style={{ fontSize: '24px', flexShrink: 0 }}
                >
                  videocam
                </motion.span>

                <motion.span
                  layout="position"
                  initial={false}
                  animate={{
                    opacity: isExtended ? 1 : 0,
                    width: isExtended ? 'auto' : 0,
                    visibility: isExtended ? 'visible' : 'hidden'
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  style={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'inline-block'
                  }}
                >
                  Free Consultation
                </motion.span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default MobilePlanPanel;
