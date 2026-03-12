import React, { useState, useMemo } from 'react';
import { CATEGORIES, ALL_ITEMS, BASE_SCORE, MAX_ACHIEVABLE } from './desktopPlanData';

const TICK_VALS   = [65, 70, 75, 80, 85, 90, 95, 100];
const GOAL_MIN    = BASE_SCORE + 1;
const GOAL_MAX    = 100;

// ── Helper: greedy pick of top-gain items to reach pts needed ────
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

// ── Sub-components ───────────────────────────────────────────────

const ItemRow = ({ item, isSelected, isNeeded, onToggle }) => (
  <div
    onClick={() => onToggle(item.id)}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      padding: '16px 18px',
      background: isSelected
        ? (isNeeded ? 'rgba(var(--amber-9), 0.06)' : 'rgba(var(--green-9), 0.06)')
        : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isSelected
        ? (isNeeded ? 'rgba(var(--amber-9), 0.3)' : 'rgba(var(--green-9), 0.35)')
        : 'rgba(255,255,255,0.06)'}`,
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    }}
  >
    {/* Checkbox */}
    <div style={{
      width: '22px', height: '22px',
      borderRadius: '7px',
      flexShrink: 0,
      marginTop: '1px',
      border: isSelected ? '1.5px solid rgb(var(--green-9))' : '1.5px solid rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700,
      color: isSelected ? 'white' : 'transparent',
      background: isSelected ? 'rgb(var(--green-9))' : 'rgba(255,255,255,0.04)',
      transition: 'all 0.18s',
    }}>
      {isSelected ? '✓' : ''}
    </div>

    {/* Icon */}
    <div style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{item.icon}</div>

    {/* Body */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: '13px', fontWeight: 600,
        color: 'rgb(var(--zinc-100))',
        marginBottom: '3px',
      }}>
        {item.name}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'rgba(var(--zinc-200), 0.4)',
        lineHeight: 1.65,
      }}>
        {item.detail}
      </div>
    </div>

    {/* Gain */}
    <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '48px' }}>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: item.gain > 0 ? '22px' : '16px',
        color: item.gain > 0 ? 'rgb(var(--green-9))' : 'rgba(var(--zinc-200), 0.2)',
        lineHeight: 1,
      }}>
        {item.gain > 0 ? `+${item.gain}` : '—'}
      </div>
      <div style={{
        fontSize: '9px',
        color: 'rgba(var(--zinc-200), 0.25)',
        marginTop: '2px',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-mono)',
      }}>
        {item.timeline}
      </div>
    </div>

    {/* Needed tag */}
    {isNeeded && (
      <div style={{
        position: 'absolute', top: '10px', right: '12px',
        fontFamily: 'var(--font-mono)',
        fontSize: '8px',
        letterSpacing: '0.1em',
        color: 'rgb(var(--amber-9))',
      }}>
        ★ needed
      </div>
    )}
  </div>
);

const CategoryRow = ({ cat, isOpen, isNeeded, neededIds, selectedIds, onToggleCat, onToggleItem }) => {
  const totalGain = cat.items.reduce((s, i) => s + i.gain, 0);

  return (
    <div style={{
      background: isOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${isNeeded ? 'rgba(var(--amber-9), 0.3)' : (isOpen ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.08)')}`,
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      {/* Header */}
      <div
        onClick={() => onToggleCat(cat.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '16px 20px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0,
          background: 'rgba(255,255,255,0.06)',
        }}>
          {cat.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '15px', fontWeight: 600,
            color: 'rgb(var(--zinc-100))',
            marginBottom: '2px',
            fontFamily: 'var(--font-main)',
          }}>
            {cat.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {totalGain > 0 ? (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgb(var(--green-9))' }}>
                +{totalGain} pts available
              </span>
            ) : (
              <span style={{ fontSize: '11px', color: 'rgba(var(--zinc-200), 0.2)' }}>preventive</span>
            )}
            <span style={{ fontSize: '11px', color: 'rgba(var(--zinc-200), 0.3)' }}>
              {cat.items.length} action{cat.items.length > 1 ? 's' : ''}
            </span>
            {isNeeded && totalGain > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '2px 8px', borderRadius: '100px',
                fontSize: '9px', fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                background: 'rgba(var(--amber-9), 0.15)',
                color: 'rgb(var(--amber-9))',
              }}>
                ★ needed for goal
              </span>
            )}
          </div>
        </div>

        <div style={{
          fontSize: '11px',
          color: 'rgba(var(--zinc-200), 0.25)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          flexShrink: 0,
        }}>
          ▼
        </div>
      </div>

      {/* Expandable body using CSS grid trick */}
      <div style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cat.items.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                isSelected={selectedIds.has(item.id)}
                isNeeded={neededIds.has(item.id)}
                onToggle={onToggleItem}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────

const DesktopPlanPanel = ({ planPanelRef }) => {
  const [goalTarget,   setGoalTarget]   = useState(70);
  const [selectedIds,  setSelectedIds]  = useState(() => computeNeeded(70));
  const [openCats,     setOpenCats]     = useState(new Set(['supplements']));

  const neededIds = useMemo(() => computeNeeded(goalTarget), [goalTarget]);
  const ptsNeeded = Math.min(goalTarget, MAX_ACHIEVABLE) - BASE_SCORE;

  const gained   = ALL_ITEMS.filter(i => selectedIds.has(i.id)).reduce((s, i) => s + i.gain, 0);
  const projScore = Math.min(100, BASE_SCORE + gained);
  const toGoal    = goalTarget - projScore;
  const progressPct = ptsNeeded > 0 ? Math.min(100, (gained / ptsNeeded) * 100) : 100;
  const sliderPct   = ((goalTarget - GOAL_MIN) / (GOAL_MAX - GOAL_MIN)) * 100;

  const badge = ptsNeeded <= 7
    ? { cls: 'on-track',  text: 'Achievable in 8 wks',  bg: 'rgba(45,122,78,0.2)',   color: '#4daa74',  border: 'rgba(45,122,78,0.3)' }
    : ptsNeeded <= 12
    ? { cls: 'stretch',   text: 'Stretch — 12 wks',     bg: 'rgba(var(--amber-9),0.15)', color: 'rgb(var(--amber-9))', border: 'rgba(var(--amber-9),0.25)' }
    : { cls: 'ambitious', text: 'Ambitious — 16+ wks',  bg: 'rgba(var(--red-9),0.15)',   color: 'rgb(var(--red-9))',   border: 'rgba(var(--red-9),0.25)' };

  const handleGoalChange = (newGoal) => {
    const g = parseInt(newGoal);
    setGoalTarget(g);
    // Auto-update selection to match new goal
    setSelectedIds(new Set(computeNeeded(g)));
  };

  const handleToggleItem = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleCat = (id) => {
    setOpenCats(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div
      ref={planPanelRef}
      style={{
        margin: '32px 48px 0',
        background: 'rgb(var(--zinc-950))',
        borderRadius: '28px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse at 5% 0%, rgba(var(--red-9), 0.14) 0%, transparent 45%),
                     radial-gradient(ellipse at 95% 100%, rgba(var(--amber-9), 0.08) 0%, transparent 45%)`,
      }} />

      {/* ── TOP: Goal setter + projected score ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '32px',
        padding: '40px 44px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative', zIndex: 1,
        alignItems: 'end',
      }}>
        {/* Goal side */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(var(--zinc-200), 0.3)', marginBottom: '8px' }}>
            Your Goal
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'rgba(var(--zinc-200), 0.7)' }}>
              I want to reach
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: '56px',
              color: 'rgb(var(--amber-9))', lineHeight: 1,
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {goalTarget}
            </div>
          </div>

          {/* Tick marks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
            {TICK_VALS.map(v => (
              <span
                key={v}
                onClick={() => handleGoalChange(v)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: v === goalTarget
                    ? 'rgb(var(--amber-9))'
                    : v <= MAX_ACHIEVABLE
                    ? 'rgba(var(--zinc-200), 0.38)'
                    : 'rgba(var(--zinc-200), 0.18)',
                  fontWeight: v === goalTarget ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                  padding: '0 1px',
                  userSelect: 'none',
                }}
              >
                {v}
              </span>
            ))}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={GOAL_MIN}
            max={GOAL_MAX}
            value={goalTarget}
            onChange={e => handleGoalChange(e.target.value)}
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
              width: '100%',
              height: '5px',
              borderRadius: '3px',
              background: `linear-gradient(90deg, rgb(var(--amber-9)) ${sliderPct}%, rgba(255,255,255,0.08) ${sliderPct}%)`,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: '7px',
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            color: 'rgba(var(--zinc-200), 0.2)',
          }}>
            <span>Current: {BASE_SCORE}</span>
            <span>100</span>
          </div>

          {/* Beyond note */}
          {goalTarget > MAX_ACHIEVABLE && (
            <div style={{
              marginTop: '14px',
              background: 'rgba(var(--red-9), 0.1)',
              border: '1px solid rgba(var(--red-9), 0.18)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '12px',
              color: 'rgba(var(--zinc-200), 0.5)',
              lineHeight: 1.6,
            }}>
              Reaching <strong style={{ color: 'rgb(var(--zinc-100))' }}>{goalTarget}</strong> requires improving markers beyond current interventions.{' '}
              <span style={{ color: 'rgb(var(--amber-9))', cursor: 'pointer', textDecoration: 'underline' }}>
                Book a consult
              </span>{' '}
              or retest in 8 weeks to unlock further gains.
            </div>
          )}
        </div>

        {/* Projected score side */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '28px 36px',
          minWidth: '180px',
          textAlign: 'center',
          gap: '4px',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--zinc-200), 0.28)' }}>
            Projected Score
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '64px',
            color: 'rgb(var(--zinc-100))', lineHeight: 1,
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {projScore}
          </div>
          <div style={{
            fontSize: '13px', fontWeight: 600, minHeight: '20px',
            color: gained === 0
              ? 'rgba(var(--zinc-200), 0.25)'
              : projScore >= goalTarget
              ? 'rgb(var(--green-9))'
              : 'rgb(var(--amber-9))',
            transition: 'all 0.3s',
          }}>
            {gained === 0
              ? 'Select actions below'
              : projScore >= goalTarget
              ? `+${gained} pts · Goal reached ✓`
              : `+${gained} pts · ${toGoal} more to goal`}
          </div>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{
        padding: '18px 44px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '5px',
              background: 'linear-gradient(90deg, rgb(var(--primary)), rgb(var(--amber-9)))',
              borderRadius: '3px',
              width: `${progressPct}%`,
              transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(var(--zinc-200), 0.3)', whiteSpace: 'nowrap' }}>
            <strong style={{ color: 'rgba(var(--zinc-200), 0.7)' }}>{gained} / {ptsNeeded} pts</strong> to goal
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '100px',
            fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap',
            background: badge.bg, color: badge.color,
            border: `1px solid ${badge.border}`,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
            {badge.text}
          </div>
        </div>
      </div>

      {/* ── ACCORDION ── */}
      <div style={{
        padding: '20px 44px 40px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        position: 'relative', zIndex: 1,
      }}>
        {CATEGORIES.map(cat => {
          const catNeeded = cat.items.some(i => neededIds.has(i.id));
          return (
            <CategoryRow
              key={cat.id}
              cat={cat}
              isOpen={openCats.has(cat.id)}
              isNeeded={catNeeded}
              neededIds={neededIds}
              selectedIds={selectedIds}
              onToggleCat={handleToggleCat}
              onToggleItem={handleToggleItem}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DesktopPlanPanel;
