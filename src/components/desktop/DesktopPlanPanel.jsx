import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, ALL_ITEMS, BASE_SCORE, MAX_ACHIEVABLE } from './desktopPlanData';
// HealthScoreSlider (V1) is intentionally kept untouched for other screens.
// The Playground panel uses PlaygroundScoreSlider (Current vs Potential design).
import PlaygroundScoreSlider from './PlaygroundScoreSlider';
import SelectableItemCard from './SelectableItemCard';
import DashboardCard from './DashboardCard';
import ActionPlanDownloadButton from './ActionPlanDownloadButton';
import HealthScoreLimitCard from './HealthScoreLimitCard';
import { InferenceBadge } from '../../ui/inference-badge';
import GeneratingState from './GeneratingState';

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



const DesktopPlanPanel = ({ planPanelRef, goalTarget, onGoalChange, onBookConsult }) => {
  const [selectedIds, setSelectedIds] = useState(() => computeNeeded(goalTarget));
  const [activeTab, setActiveTab] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const genTimerRef = useRef(null);
  const actionPlanCardRef = useRef(null);

  // ── localGoalTarget: live drag display value ──────────────────────────────
  // Decouples the slider's visual score (updates every px) from the parent's
  // goalTarget state (updates once on release). Without this separation,
  // every drag tick called setGoalTarget in DesktopDashboard, re-rendering
  // the entire dashboard and all its siblings on every mouse-move pixel.
  const [localGoalTarget, setLocalGoalTarget] = useState(() => goalTarget);

  // Keep localGoalTarget in sync if parent changes goalTarget externally
  // (e.g. programmatic updates). Same-value setState is a React no-op.
  useEffect(() => {
    setLocalGoalTarget(goalTarget);
  }, [goalTarget]);

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

  // Shows Lottie generating animation for 1.2s, then reveals updated plan.
  const handleSliderRelease = useCallback((finalScore) => {
    if (genTimerRef.current) clearTimeout(genTimerRef.current);
    // Sync local display and parent state immediately on release (single update)
    setLocalGoalTarget(finalScore);
    onGoalChange(finalScore);
    setIsGenerating(true);
    // Smooth-scroll the Action Plan card into view immediately on release
    actionPlanCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    genTimerRef.current = setTimeout(() => {
      generateActionPlan(finalScore);
      setIsGenerating(false);
    }, 1200);
  }, [generateActionPlan, onGoalChange]);

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

  // Live slider handler — updates LOCAL display score only (no parent re-render).
  // ❌ BEFORE: called onGoalChange() every pixel → re-rendered all of DesktopDashboard
  // ✅ AFTER:  only setLocalGoalTarget() → re-renders only DesktopPlanPanel's header
  // Plan regeneration happens exclusively in handleSliderRelease (on drag end).
  const handleGoalChange = useCallback((val) => {
    setLocalGoalTarget(parseInt(val));
  }, []); // stable ref — no deps, no recreations during drag

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
          margin: '20px 48px 0',
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
              {localGoalTarget}
            </div>
            {/* Status Tag — solid segment-color pill, matches reference design */}
            {(() => {
              const status = getScoreStatus(localGoalTarget);
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
            {localGoalTarget > MAX_ACHIEVABLE && (
              <motion.div key="limit-card" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: 'easeOut' }} style={{ gridColumn: '1 / -1', width: '100%' }}>
                <HealthScoreLimitCard score={localGoalTarget} onConsultClick={onBookConsult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DashboardCard>

      <DashboardCard ref={actionPlanCardRef} style={{ margin: '20px 48px 0', position: 'relative', padding: 0 }}>
        <div style={{ padding: '28px 44px 20px 40px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(var(--zinc-100))', fontFamily: 'var(--font-main)', marginBottom: '4px' }}>Your Action Plan</div>
              <div style={{ fontSize: '13px', color: 'rgba(228,228,231,0.4)', fontFamily: 'var(--font-main)' }}>Select actions that fit your lifestyle and goals</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
              {!isGenerating && totalSelected > 0 && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgb(48,164,108)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  +{gained} pts · {totalSelected} action{totalSelected !== 1 ? 's' : ''} chosen
                </div>
              )}
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
        


        {/* ── TAB BAR + CARDS: Lottie generating state while loading ── */}
        <AnimatePresence mode="wait" initial={false}>
        {isGenerating ? (
          <GeneratingState key="generating" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
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
            <SelectableItemCard
              key={item.id}
              item={item}
              catType={item._catType}
              isSelected={selectedIds.has(item.id)}
              isNeeded={neededIds.has(item.id)}
              onToggle={handleToggleItem}
            />
          ))}
        </div>
          </motion.div>
        )}
        </AnimatePresence>

      </DashboardCard>
    </>
  );
};
export default DesktopPlanPanel;
