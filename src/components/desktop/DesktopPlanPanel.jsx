import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, ALL_ITEMS, BASE_SCORE, MAX_ACHIEVABLE } from './desktopPlanData';
// HealthScoreSlider (V1) is intentionally kept untouched for other screens.
// The Playground panel uses PlaygroundScoreSlider (Current vs Potential design).
import PlaygroundScoreSlider from './PlaygroundScoreSlider';
import DashboardCard from './DashboardCard';
import ActionPlanDownloadButton from './ActionPlanDownloadButton';
import HealthScoreLimitCard from './HealthScoreLimitCard';
import { InferenceBadge } from '../../ui/inference-badge';

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

const ItemCard = ({ item, catType, isSelected, isNeeded, onToggle }) => {
  const [hovered, setHovered] = useState(false);
  const bg = isSelected ? 'rgba(43,127,255,0.07)' : hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)';
  const borderColor = isSelected ? 'rgba(43,127,255,0.45)' : hovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)';

  return (
    <div
      onClick={() => onToggle(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'background 0.18s, border-color 0.18s',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: isSelected ? '0 0 0 4px rgba(43,127,255,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'rgb(var(--zinc-100))', fontFamily: 'var(--font-main)', lineHeight: 1.3 }}>
              {item.name}
            </span>
            {item.timeline && item.gain > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '100px', fontSize: '10px', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                <span style={{ opacity: 0.6, fontSize: '16px', lineHeight: 1 }}>⊙</span>
                {item.timeline}
              </span>
            )}
            {isNeeded && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '100px', fontSize: '9px', fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase', background: 'rgba(255,197,61,0.14)', color: 'rgb(255,197,61)', border: '1px solid rgba(255,197,61,0.28)', whiteSpace: 'nowrap' }}>
                ★ needed
              </span>
            )}
          </div>
        </div>
        {isSelected ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-mono)', background: 'rgba(43,127,255,0.18)', color: 'rgb(43,127,255)', border: '1px solid rgba(43,127,255,0.3)', letterSpacing: '0.04em', whiteSpace: 'nowrap', flexShrink: 0 }}>
            ✓ Added
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: item.gain > 0 ? '22px' : '15px', fontWeight: 700, color: item.gain > 0 ? 'rgb(48,164,108)' : 'rgba(255,255,255,0.2)', lineHeight: 1 }}>
              {item.gain > 0 ? `+${item.gain}` : '—'}
            </span>
            {item.gain > 0 && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>points</span>}
          </div>
        )}
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(228,228,231,0.42)', lineHeight: 1.65, margin: 0 }}>{item.detail}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
        {item.tags && item.tags.map(tag => (
          <span key={tag} style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 500, color: 'rgb(48,164,108)', border: '1px solid rgba(48,164,108,0.28)', background: 'rgba(48,164,108,0.08)' }}>{tag}</span>
        ))}
      </div>
    </div>
  );
};

const DesktopPlanPanel = ({ planPanelRef, goalTarget, onGoalChange, onBookConsult }) => {
  const [selectedIds, setSelectedIds] = useState(() => computeNeeded(goalTarget));
  // 'all' is the default — shows every category's items in one view
  const [activeTab, setActiveTab] = useState('all');

  // ── Playground: baseline tracking ────────────────────────────────────────
  // baselineScore is the "confirmed" goal — updated automatically on slider release.
  const [baselineScore, setBaselineScore] = useState(() => goalTarget);

  // Preserves the committed item selection across drift/restore cycles so that
  // dragging the slider back to baseline restores the exact previous selection
  // (including any manual tweaks) without recomputing from scratch.
  const savedSelectedIdsRef = useRef(null);
  if (savedSelectedIdsRef.current === null) {
    savedSelectedIdsRef.current = new Set(computeNeeded(goalTarget));
  }

  // ── generateActionPlan — single source of truth for plan generation ───────
  // Accepts an explicit score (from slider release) so it never reads stale
  // goalTarget from a closed-over prop.
  const generateActionPlan = useCallback((score) => {
    const newIds = new Set(computeNeeded(score));
    savedSelectedIdsRef.current = newIds;
    setBaselineScore(score);
    setSelectedIds(newIds);
    onGoalChange(score);
  }, [onGoalChange]);

  // Called by HealthScoreSliderV2's onDragEnd — fires once per drag gesture.
  const handleSliderRelease = useCallback((finalScore) => {
    generateActionPlan(finalScore);
  }, [generateActionPlan]);

  // Action plan computed values are driven by baselineScore (committed goal),
  // NOT goalTarget (live slider) — so the card never re-renders during drag.
  const neededIds = useMemo(() => computeNeeded(baselineScore), [baselineScore]);
  const ptsNeeded = Math.min(baselineScore, MAX_ACHIEVABLE) - BASE_SCORE;
  const gained = ALL_ITEMS.filter(i => selectedIds.has(i.id)).reduce((s, i) => s + i.gain, 0);
  const projScore = Math.min(100, BASE_SCORE + gained);
  const toGoal = baselineScore - projScore;
  const progressPct = ptsNeeded > 0 ? Math.min(100, (gained / ptsNeeded) * 100) : 100;

  const displayScore = projScore;
  const displayGain = displayScore - BASE_SCORE;
  const activeCategory = CATEGORIES.find(c => c.id === activeTab);
  const totalSelected = ALL_ITEMS.filter(i => selectedIds.has(i.id)).length;

  // ── Sorted item list for the active tab ──────────────────────────────────
  // Selected items float to the top (stable relative order preserved within
  // each group). Recomputes only when the tab or selection changes.
  const sortedTabItems = useMemo(() => {
    const raw = activeTab === 'all'
      ? CATEGORIES.flatMap(cat => cat.items.map(item => ({ ...item, _catType: cat.type })))
      : (CATEGORIES.find(c => c.id === activeTab)?.items || [])
          .map(item => ({ ...item, _catType: CATEGORIES.find(c => c.id === activeTab)?.type }));

    return [
      ...raw.filter(item => selectedIds.has(item.id)),
      ...raw.filter(item => !selectedIds.has(item.id)),
    ];
  }, [activeTab, selectedIds]);

  // Live slider handler — updates display score only while dragging.
  // Plan regeneration happens in handleSliderRelease (on drag end).
  const handleGoalChange = (val) => {
    onGoalChange(parseInt(val));
  };

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

  return (
    <>
      {/* ── PLAYGROUND / GOAL SETTER CONTAINER ── */}
      <DashboardCard
        ref={planPanelRef}
        style={{
          margin: '32px 48px 0',
          position: 'relative',
          padding: 0,
        }}
      >
      {/* ── GOAL SETTER ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '32px',
        padding: '40px 44px 32px',
        position: 'relative', zIndex: 1,
        alignItems: 'center',
      }}>
        <div style={{ minWidth: 0 }}>
           <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '14px',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgb(var(--foreground))', marginBottom: '8px',
          }}>
            Playground
          </div> 
           <div style={{
            display: 'flex', alignItems: 'baseline', gap: '12px',
            marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'rgb(var(--muted-foreground))' }}>
              I want to reach
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: '56px',
              color: 'rgb(var(--foreground))', lineHeight: 1,
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {goalTarget}
            </div>
            {/* Status Tag — solid segment-color pill, matches reference design */}
            {(() => {
              const status = getScoreStatus(goalTarget);
              return (
                <div style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  padding:        '6px 16px',
                  borderRadius:   '8px',
                  fontSize:       '13px',
                  fontWeight:     600,
                  fontFamily:     'var(--font-main)',
                  background:     status.tagBg,
                  color:          status.tagText,
                  border:         'none',
                  height:         'fit-content',
                  alignSelf:      'center',
                  marginLeft:     '4px',
                  letterSpacing:  '0.01em',
                  transition:     'background 0.3s ease',
                  userSelect:     'none',
                }}>
                  {status.text}
                </div>
              );
            })()}



          </div> 

          {/* ── Playground Slider: Current thumb + fixed Potential dashed marker ── */}
          {/* initialScore = MAX_ACHIEVABLE (80) — the fixed "what you can reach"    */}
          {/* value        = goalTarget      — the score the user is exploring       */}
          <PlaygroundScoreSlider
            initialScore={MAX_ACHIEVABLE}
            value={goalTarget}
            min={GOAL_MIN}
            max={GOAL_MAX}
            step={1}
            onChange={handleGoalChange}
            onChangeEnd={handleSliderRelease}
          />
        </div>

          

          {/* ── HealthScoreLimitCard — animated show/hide ── */}
          <AnimatePresence>
            {goalTarget > MAX_ACHIEVABLE && (
              <motion.div key="limit-card" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: 'easeOut' }} style={{ gridColumn: '1 / -1', width: '100%' }}>
                <HealthScoreLimitCard score={goalTarget} onConsultClick={onBookConsult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DashboardCard>

      <DashboardCard style={{ margin: '20px 48px 0', position: 'relative', padding: 0 }}>
        <div style={{ padding: '28px 44px 20px 40px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(var(--zinc-100))', fontFamily: 'var(--font-main)', marginBottom: '4px' }}>Your Action Plan</div>
              <div style={{ fontSize: '13px', color: 'rgba(228,228,231,0.4)', fontFamily: 'var(--font-main)' }}>Select actions that fit your lifestyle and goals</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
              {totalSelected > 0 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgb(48,164,108)', fontWeight: 600, whiteSpace: 'nowrap' }}> +{gained} pts · {totalSelected} action{totalSelected !== 1 ? 's' : ''} chosen</div>}
              <ActionPlanDownloadButton onClick={onBookConsult} />
            </div>
          </div>
        </div>


<div
  style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '20px 24px',
    marginBottom: '24px',
    marginLeft: '40px',
    width: '25%',
    display: 'flex',
    alignItems: 'center',        // 🔥 vertical center
    justifyContent: 'space-between', // 🔥 push ends
    minHeight: '60px',
  }}
>
  <div
    style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'rgb(var(--muted-foreground))',
    }}
  >
    Projected Score
  </div>

  <div
    style={{
      fontFamily: 'var(--font-heading)',
      fontSize: '36px',
      color: 'rgb(var(--foreground))',
      lineHeight: 1,
    }}
  >
    {displayScore}
  </div>
</div>
        


        {/* ── TAB BAR ── */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '20px',margin:'0 40px 20px', flexWrap: 'wrap',
        }}>
          {/* "All" tab — always first */}
          {(() => {
            const isActive = activeTab === 'all';
            const allSelected = ALL_ITEMS.filter(i => selectedIds.has(i.id)).length;
            const anyNeeded = ALL_ITEMS.some(i => neededIds.has(i.id));
            return (
              <button
                key="all"
                onClick={() => setActiveTab('all')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: isActive
                    ? '1px solid rgba(43,127,255,0.5)'
                    : anyNeeded
                      ? '1px solid rgba(255,197,61,0.25)'
                      : '1px solid rgba(255,255,255,0.10)',
                  background: isActive ? 'rgba(43,127,255,0.18)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? 'rgb(43,127,255)' : 'rgb(var(--muted-foreground)',
                  fontSize: '12px', fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font-main)',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>
                  All
                  {allSelected > 0 && (
                    <span style={{
                      marginLeft: '5px', fontSize: '11px',
                      fontWeight: isActive ? 600 : 400,
                      color: 'rgb(var(--muted-foreground)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      ({allSelected})
                    </span>
                  )}
                </span>
                {allSelected > 0 && (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgb(48,164,108)', flexShrink: 0 }} />
                )}
                {allSelected === 0 && anyNeeded && (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgb(255,197,61)', flexShrink: 0 }} />
                )}
              </button>
            );
          })()}

          {/* Per-category tabs */}
          {CATEGORIES.map(cat => {
            const isActive = cat.id === activeTab;
            const catSelected = cat.items.filter(i => selectedIds.has(i.id)).length;
            const catNeeded = cat.items.some(i => neededIds.has(i.id));

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: isActive
                    ? '1px solid rgba(43,127,255,0.5)'
                    : catNeeded
                      ? '1px solid rgba(255,197,61,0.25)'
                      : '1px solid rgba(255,255,255,0.10)',
                  background: isActive
                    ? 'rgba(43,127,255,0.18)'
                    : 'rgba(255,255,255,0.04)',
                  color: isActive ? 'rgb(43,127,255)' : 'rgb(var(--muted-foreground)',
                  fontSize: '12px', fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font-main)',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>
                  {cat.name}
                  {catSelected > 0 && (
                    <span style={{
                      marginLeft: '5px',
                      fontSize: '11px',
                      fontWeight: isActive ? 600 : 400,
                      color: 'rgb(var(--muted-foreground)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      ({catSelected})
                    </span>
                  )}
                </span>
                {catSelected > 0 && (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgb(48,164,108)', flexShrink: 0 }} />
                )}
                {catSelected === 0 && catNeeded && (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgb(255,197,61)', flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── CARD GRID for active tab ── */}
        {/* Selected items are always sorted to the top (stable within each group). */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          margin: '0 40px',
          gap: '12px',
        }}>
          {sortedTabItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              catType={item._catType}
              isSelected={selectedIds.has(item.id)}
              isNeeded={neededIds.has(item.id)}
              onToggle={handleToggleItem}
            />
          ))}
        </div>

      </DashboardCard>
    </>
  );
};
export default DesktopPlanPanel;
