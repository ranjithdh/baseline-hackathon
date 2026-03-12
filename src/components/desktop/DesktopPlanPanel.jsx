import React, { useState, useMemo } from 'react';
import { CATEGORIES, ALL_ITEMS, BASE_SCORE, MAX_ACHIEVABLE } from './desktopPlanData';

const TICK_VALS = [65, 70, 75, 80, 85, 90, 95, 100];
const GOAL_MIN  = BASE_SCORE + 1;
const GOAL_MAX  = 100;

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

// ── Item Card ────────────────────────────────────────────────────
const ItemCard = ({ item, catType, isSelected, isNeeded, onToggle }) => {
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
        padding: '20px',
        cursor: 'pointer',
        transition: 'background 0.18s, border-color 0.18s',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: isSelected ? '0 0 0 4px rgba(43,127,255,0.08)' : 'none',
      }}
    >
      {/* Row 0: ✓ Added — own row, top-right, only when selected */}
      {isSelected && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '4px 12px', borderRadius: '100px',
            fontSize: '10px', fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            background: 'rgba(43,127,255,0.18)',
            color: 'rgb(43,127,255)',
            border: '1px solid rgba(43,127,255,0.3)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}>
            ✓ Added
          </span>
        </div>
      )}

      {/* Row 1: Title + ★ needed (left)  |  +X points (right) — same horizontal line */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        {/* Left: name + needed chip */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '15px', fontWeight: 700,
              color: 'rgb(var(--zinc-100))',
              fontFamily: 'var(--font-main)',
              lineHeight: 1.3,
            }}>
              {item.name}
            </span>
            {isNeeded && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                padding: '2px 8px', borderRadius: '100px',
                fontSize: '9px', fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.07em', textTransform: 'uppercase',
                background: 'rgba(255,197,61,0.14)',
                color: 'rgb(255,197,61)',
                border: '1px solid rgba(255,197,61,0.28)',
                whiteSpace: 'nowrap',
              }}>
                ★ needed
              </span>
            )}
          </div>
        </div>

        {/* Right: +X points */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: item.gain > 0 ? '22px' : '15px',
            fontWeight: 700,
            color: item.gain > 0 ? 'rgb(48,164,108)' : 'rgba(255,255,255,0.2)',
            lineHeight: 1,
          }}>
            {item.gain > 0 ? `+${item.gain}` : '—'}
          </span>
          {item.gain > 0 && (
            <span style={{
              fontSize: '10px', color: 'rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-mono)',
            }}>
              points
            </span>
          )}
        </div>
      </div>

      {/* Row 2: Description */}
      <p style={{
        fontSize: '12px', color: 'rgba(228,228,231,0.42)',
        lineHeight: 1.65, margin: 0,
      }}>
        {item.detail}
      </p>

      {/* Row 3: Chips only */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
        {item.timeline && item.gain > 0 && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '100px',
            fontSize: '10px', color: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            fontFamily: 'var(--font-mono)',
          }}>
            <span style={{ opacity: 0.6, fontSize: '16px', lineHeight: 1 }}>⊙</span> {item.timeline}
          </span>
        )}
        {item.tags && item.tags.map(tag => (
          <span key={tag} style={{
            padding: '4px 10px', borderRadius: '100px',
            fontSize: '10px', fontWeight: 500,
            color: 'rgb(48,164,108)',
            border: '1px solid rgba(48,164,108,0.28)',
            background: 'rgba(48,164,108,0.08)',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────
const DesktopPlanPanel = ({ planPanelRef }) => {
  const [goalTarget,  setGoalTarget]  = useState(70);
  const [selectedIds, setSelectedIds] = useState(() => computeNeeded(70));
  const [activeTab,   setActiveTab]   = useState(CATEGORIES[0].id);

  const neededIds   = useMemo(() => computeNeeded(goalTarget), [goalTarget]);
  const ptsNeeded   = Math.min(goalTarget, MAX_ACHIEVABLE) - BASE_SCORE;
  const gained      = ALL_ITEMS.filter(i => selectedIds.has(i.id)).reduce((s, i) => s + i.gain, 0);
  const projScore   = Math.min(100, BASE_SCORE + gained);
  const toGoal      = goalTarget - projScore;
  const progressPct = ptsNeeded > 0 ? Math.min(100, (gained / ptsNeeded) * 100) : 100;
  const sliderPct   = ((goalTarget - GOAL_MIN) / (GOAL_MAX - GOAL_MIN)) * 100;

  const badge = ptsNeeded <= 7
    ? { text: 'Achievable · 8 wks',  bg: 'rgba(48,164,108,0.15)',  color: 'rgb(48,164,108)',  border: 'rgba(48,164,108,0.28)' }
    : ptsNeeded <= 12
    ? { text: 'Stretch · 12 wks',    bg: 'rgba(255,197,61,0.15)',  color: 'rgb(255,197,61)', border: 'rgba(255,197,61,0.28)' }
    : { text: 'Ambitious · 16+ wks', bg: 'rgba(241,121,104,0.15)', color: 'rgb(241,121,104)', border: 'rgba(241,121,104,0.28)' };

  const activeCategory = CATEGORIES.find(c => c.id === activeTab);

  // Total selected across ALL categories (for header summary)
  const totalSelected = ALL_ITEMS.filter(i => selectedIds.has(i.id)).length;

  const handleGoalChange = (val) => {
    const g = parseInt(val);
    setGoalTarget(g);
    setSelectedIds(new Set(computeNeeded(g)));
  };

  const handleToggleItem = (id) => {
    setSelectedIds(prev => {
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
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse at 5% 0%, rgba(241,121,104,0.10) 0%, transparent 45%),
                     radial-gradient(ellipse at 95% 100%, rgba(255,197,61,0.06) 0%, transparent 45%)`,
      }} />

      {/* ── GOAL SETTER ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '32px',
        padding: '40px 44px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative', zIndex: 1,
        alignItems: 'end',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(228,228,231,0.3)', marginBottom: '8px',
          }}>
            Your Goal
          </div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: '12px',
            marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'rgba(228,228,231,0.6)' }}>
              I want to reach
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: '56px',
              color: 'rgb(255,197,61)', lineHeight: 1,
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {goalTarget}
            </div>
          </div>

          {/* Tick labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
            {TICK_VALS.map(v => (
              <span
                key={v}
                onClick={() => handleGoalChange(v)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '0 1px',
                  color: v === goalTarget ? 'rgb(255,197,61)' : v <= MAX_ACHIEVABLE ? 'rgba(228,228,231,0.38)' : 'rgba(228,228,231,0.18)',
                  fontWeight: v === goalTarget ? 700 : 400,
                  cursor: 'pointer', transition: 'color 0.15s', userSelect: 'none',
                }}
              >
                {v}
              </span>
            ))}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={GOAL_MIN} max={GOAL_MAX} value={goalTarget}
            onChange={e => handleGoalChange(e.target.value)}
            style={{
              WebkitAppearance: 'none', appearance: 'none',
              width: '100%', height: '5px', borderRadius: '3px',
              outline: 'none', cursor: 'pointer',
              background: `linear-gradient(90deg, rgb(255,197,61) ${sliderPct}%, rgba(255,255,255,0.08) ${sliderPct}%)`,
            }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: '7px',
            fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(228,228,231,0.22)',
          }}>
            <span>Current: {BASE_SCORE}</span>
            <span>Max: 100</span>
          </div>

          {goalTarget > MAX_ACHIEVABLE && (
            <div style={{
              marginTop: '14px',
              background: 'rgba(241,121,104,0.10)',
              border: '1px solid rgba(241,121,104,0.18)',
              borderRadius: '10px', padding: '10px 14px',
              fontSize: '12px', color: 'rgba(228,228,231,0.5)', lineHeight: 1.6,
            }}>
              Reaching <strong style={{ color: 'rgb(var(--zinc-100))' }}>{goalTarget}</strong> requires improving markers beyond current interventions.{' '}
              <span style={{ color: 'rgb(255,197,61)', cursor: 'pointer', textDecoration: 'underline' }}>Book a consult</span>{' '}
              or retest in 8 weeks to unlock further gains.
            </div>
          )}
        </div>

        {/* Projected score card */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '20px', padding: '28px 36px',
          minWidth: '180px', textAlign: 'center', gap: '6px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(228,228,231,0.28)',
          }}>
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
            fontSize: '12px', fontWeight: 600, minHeight: '20px',
            fontFamily: 'var(--font-mono)',
            color: gained === 0 ? 'rgba(228,228,231,0.25)'
              : projScore >= goalTarget ? 'rgb(48,164,108)'
              : 'rgb(255,197,61)',
            transition: 'color 0.3s',
          }}>
            {gained === 0 ? 'Select actions below'
              : projScore >= goalTarget ? `+${gained} pts · Goal ✓`
              : `+${gained} pts · ${toGoal} more`}
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
              background: 'linear-gradient(90deg, rgb(43,127,255), rgb(255,197,61))',
              borderRadius: '3px',
              width: `${progressPct}%`,
              transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: 'rgba(228,228,231,0.3)', whiteSpace: 'nowrap',
          }}>
            {progressPct >= 100
              ? <strong style={{ color: 'rgb(48,164,108)' }}>{gained} pts · Goal covered ✓</strong>
              : <><strong style={{ color: 'rgba(228,228,231,0.7)' }}>{gained} / {ptsNeeded} pts</strong> to goal</>
            }
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '100px',
            fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono)',
            background: badge.bg, color: badge.color,
            border: `1px solid ${badge.border}`,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
            {badge.text}
          </div>
        </div>
      </div>

      {/* ── ACTION PLAN: header + tabs + cards ── */}
      <div style={{ padding: '28px 44px 40px', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: '20px',
        }}>
          <div>
            <div style={{
              fontSize: '18px', fontWeight: 700,
              color: 'rgb(var(--zinc-100))',
              fontFamily: 'var(--font-main)',
              marginBottom: '4px',
            }}>
              Build Your Action Plan
            </div>
            <div style={{
              fontSize: '13px', color: 'rgba(228,228,231,0.4)',
              fontFamily: 'var(--font-main)',
            }}>
              Select actions that fit your lifestyle and goals
            </div>
          </div>

          {/* Global count */}
          {totalSelected > 0 && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '12px',
              color: 'rgb(48,164,108)', fontWeight: 600,
            }}>
              +{gained} pts · {totalSelected} action{totalSelected !== 1 ? 's' : ''} chosen
            </div>
          )}
        </div>

        {/* ── TAB BAR ── */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap',
        }}>
          {CATEGORIES.map(cat => {
            const isActive   = cat.id === activeTab;
            const catSelected = cat.items.filter(i => selectedIds.has(i.id)).length;
            const catNeeded   = cat.items.some(i => neededIds.has(i.id));

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
                  color: isActive ? 'rgb(43,127,255)' : 'rgba(228,228,231,0.65)',
                  fontSize: '13px', fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font-main)',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '15px', lineHeight: 1 }}>{cat.icon}</span>

                {/* Name + count inline */}
                <span>
                  {cat.name}
                  {catSelected > 0 && (
                    <span style={{
                      marginLeft: '5px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isActive ? 'rgb(43,127,255)' : 'rgb(48,164,108)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      ({catSelected})
                    </span>
                  )}
                </span>

                {/* Green dot — items selected */}
                {catSelected > 0 && (
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: 'rgb(48,164,108)',
                    flexShrink: 0,
                  }} />
                )}

                {/* Amber dot — needed but nothing selected yet */}
                {catSelected === 0 && catNeeded && (
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: 'rgb(255,197,61)',
                    flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── CARD GRID for active tab ── */}
        {activeCategory && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            {activeCategory.items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                catType={activeCategory.type}
                isSelected={selectedIds.has(item.id)}
                isNeeded={neededIds.has(item.id)}
                onToggle={handleToggleItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopPlanPanel;
