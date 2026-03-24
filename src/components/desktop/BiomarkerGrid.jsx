/**
 * BiomarkerGrid.jsx  (v4)
 *
 * – Full-width flex, 3 equal sections (negative=14, watch=15, positive=11).
 * – 7 rows visible by default; no "+X more".
 * – ENTIRE card is the click target.
 * – Expanded card always occupies the LEFT-MOST position (via CSS order).
 * – Horizontal-only expansion (flex-grow); height permanently fixed.
 * – Bottom gradient fade + arrow hint as expand affordance.
 * – >15 items → modal instead of expansion.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { getBySection, SECTION_META } from './biomarkerData';
import BiomarkerStatusTag from './BiomarkerStatusTag';

// ─── Data (sliced to exact counts) ───────────────────────────────────────────
const DATA = {
  negative: getBySection('negative').slice(0, 14),
  watch: getBySection('watch').slice(0, 15),
  positive: getBySection('positive').slice(0, 11),
};

const SECTION_ORDER = ['negative', 'watch', 'positive'];
const LABEL_MAP = { negative: 'ALERTS', watch: 'WATCH', positive: 'OPTIMAL' };

// ─── Config ───────────────────────────────────────────────────────────────────
const POPUP_THRESHOLD = 14;  // > 14 items → modal (so 15 triggers popup)
const VISIBLE_ROWS = 7;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ─── BioRow — fixed height so compact & expanded rows are always identical ────
// Single source of truth: no slim variant, value always shown & centred.
const ROW_HEIGHT = 52;

const BioRow = React.memo(({ marker, showValue = true }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      height: `${ROW_HEIGHT}px`,
      flexShrink: 0,
      gap: '4px',
      padding: '0 12px',
      borderRadius: '9px',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      transition: 'background 0.15s',
      boxSizing: 'border-box',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
  >
    {/* Left: Name */}
    <div style={{ flex: 1.2, minWidth: 0, display: 'flex' }}>
      <span style={{
        fontSize: '12.5px',
        fontWeight: 600,
        color: '#e4e4e7',
        fontFamily: 'var(--font-main)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {marker.name}
      </span>
    </div>

    {/* Center: Value (only if showValue) */}
    {showValue && (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: '4px',
        minWidth: 0,
      }}>
        <span style={{ fontSize: '13px', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
          {marker.value}
        </span>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.26)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
          {marker.unit}
        </span>
      </div>
    )}

    {/* Right: Badge */}
    <div style={{
      flex: showValue ? 1.2 : 0,
      display: 'flex',
      justifyContent: 'flex-end',
      flexShrink: 0,
      marginLeft: showValue ? 0 : 'auto',
    }}>
      <BiomarkerStatusTag status={marker.status} />
    </div>
  </div>
));
BioRow.displayName = 'BioRow';

// ─── CompactBody ────────────────────────────────────────────────────────────
const CompactBody = ({ markers }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', width: '100%' }}>
    {markers.slice(0, VISIBLE_ROWS).map(m => (
      <BioRow key={m.id} marker={m} showValue={false} />
    ))}
  </div>
);

// ─── ExpandedBody ─────────────────────────────────────────────────────────────
const ExpandedBody = ({ markers }) => {
  const split = markers.length > 14 ? Math.ceil(markers.length / 2) : 7;
  const colA = markers.slice(0, split);
  const colB = markers.slice(split);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 2px',
      height: 'auto',
      minHeight: '364px',
      overflowY: 'auto',
      overflowX: 'hidden',
      alignContent: 'start',
    }}>
      <div style={{ borderRight: '1px solid rgba(255,255,255,0.04)', paddingRight: '4px', alignSelf: 'start' }}>
        {colA.map(m => <BioRow key={m.id} marker={m} showValue={true} />)}
      </div>
      <div style={{ paddingLeft: '4px', alignSelf: 'start' }}>
        {colB.map(m => <BioRow key={m.id} marker={m} showValue={true} />)}
      </div>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const BiomarkerModal = ({ sectionKey, markers, onClose }) => {
  const meta = SECTION_META[sectionKey];
  const split = markers.length > 14 ? Math.ceil(markers.length / 2) : 7;

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px',
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(16px)',
        animation: 'bgFadeIn 0.22s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '860px', maxHeight: '82vh',
          background: 'rgba(11,11,18,0.99)',
          border: `1px solid ${meta.color.border}`,
          borderRadius: '22px',
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${meta.color.accent}18`,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalIn 0.28s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{
          padding: '20px 26px',
          background: `linear-gradient(135deg, ${meta.color.bg} 0%, transparent 100%)`,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: meta.color.accent, boxShadow: `0 0 10px ${meta.color.accent}` }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-heading)' }}>{meta.label}</span>
            <span style={{ fontSize: '11px', background: meta.color.bg, color: meta.color.text, padding: '3px 10px', borderRadius: '100px', fontFamily: 'var(--font-mono)', fontWeight: 700, border: `1px solid ${meta.color.border}` }}>
              {markers.length} MARKERS
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', outline: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: '0 1 auto', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.04)', alignSelf: 'start' }}>
            {markers.slice(0, split).map(m => <BioRow key={m.id} marker={m} />)}
          </div>
          <div style={{ padding: '14px 18px', overflowY: 'auto', alignSelf: 'start' }}>
            {markers.slice(split).map(m => <BioRow key={m.id} marker={m} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ExpandButton ─────────────────────────────────────────────────────────────
const ExpandButton = ({ isExpanded, isLarge, accent, border, bg, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={isExpanded ? 'Collapse' : isLarge ? 'View all' : 'Expand'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        border: `1px solid ${hovered ? accent : border}`,
        background: hovered ? `${bg}` : 'rgba(255,255,255,0.04)',
        color: hovered ? accent : 'rgba(255,255,255,0.45)',
        cursor: 'pointer',
        outline: 'none',
        flexShrink: 0,
        transition: 'border-color 0.2s, background 0.2s, color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? `0 0 10px ${accent}40` : 'none',
      }}
    >
      {isExpanded
        ? <Minimize2 size={13} strokeWidth={2.5} />
        : <Maximize2 size={13} strokeWidth={2.5} />}
    </button>
  );
};

// ─── SectionCard ─────────────────────────────────────────────────────────────
const SectionCard = React.memo(({ sectionKey, markers, cardState, cssOrder, onToggle }) => {
  const meta = SECTION_META[sectionKey];
  const isExpanded = cardState === 'expanded';
  const isShrunk = cardState === 'shrunk';
  const isLarge = markers.length > POPUP_THRESHOLD;
  const [cardHover, setCardHover] = React.useState(false);

  const flexGrow = isExpanded ? 2 : isShrunk ? 0.5 : 1;

  return (
    <div
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
      style={{
        order: cssOrder,
        flexGrow,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
        height: 'fit-content',
        transition: `flex-grow 0.42s ${EASE}, box-shadow 0.3s ease, border-color 0.3s ease`,
        background: 'rgba(14,14,22,0.97)',
        border: `1px solid ${isExpanded
          ? meta.color.border
          : cardHover
            ? meta.color.border
            : 'rgba(255,255,255,0.09)'
          }`,
        borderRadius: '20px',
        boxShadow: isExpanded
          ? `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${meta.color.border}`
          : cardHover
            ? `0 6px 28px rgba(0,0,0,0.4), 0 0 0 1px ${meta.color.border}40`
            : '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        zIndex: isExpanded ? 2 : cardHover ? 2 : 1,
        cursor: 'default',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: `linear-gradient(to bottom, ${meta.color.bg}, transparent)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        flexShrink: 0,
        userSelect: 'none',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left: dot + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: meta.color.accent,
            boxShadow: `0 0 8px ${meta.color.accent}`,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '9.5px',
            color: 'rgba(255,255,255,0.38)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {meta.label}
          </span>
        </div>

        {/* Centre: count badge */}
        <span style={{
          fontSize: '10px',
          color: meta.color.text,
          background: meta.color.bg,
          padding: '3px 10px',
          borderRadius: '100px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          border: `1px solid ${meta.color.border}`,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {markers.length} {LABEL_MAP[sectionKey]}
        </span>

        {/* Right: expand / collapse button */}
        <ExpandButton
          isExpanded={isExpanded}
          isLarge={isLarge}
          accent={meta.color.accent}
          border={meta.color.border}
          bg={meta.color.bg}
          onClick={() => onToggle(sectionKey)}
        />
      </div>

      {/* ── Body ── */}
      <div style={{
        flex: 1,
        overflow: isExpanded ? 'hidden' : 'visible',
        padding: '0 8px',
        minWidth: 0,
        minHeight: '364px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {isExpanded ? (
          <div style={{ flex: 1, overflow: 'hidden', animation: 'contentFadeIn 0.22s ease' }}>
            <ExpandedBody markers={markers} />
          </div>
        ) : (
          <>
            <CompactBody markers={markers} />

            {/* Subtle bottom gradient fade — indicates more content below */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '56px',
              background: 'linear-gradient(to top, rgba(14,14,22,0.95) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
          </>
        )}
      </div>
    </div>
  );
});
SectionCard.displayName = 'SectionCard';


// ─── BiomarkerGrid ────────────────────────────────────────────────────────────
const BiomarkerGrid = () => {
  const [expandedKey, setExpandedKey] = useState(null);
  const [modalKey, setModalKey] = useState(null);

  const handleToggle = useCallback((key) => {
    const markers = DATA[key];

    if (markers.length > POPUP_THRESHOLD) {
      setModalKey(key);
      return;
    }

    setExpandedKey(prev => (prev === key ? null : key));
  }, []);

  // Compute CSS `order` so the expanded card is always leftmost (order=0),
  // non-expanded cards follow in their natural sequence (order=1,2).
  const getOrder = useCallback((key) => {
    if (!expandedKey) {
      // default left-to-right order
      return SECTION_ORDER.indexOf(key);
    }
    if (key === expandedKey) return 0; // expanded → leftmost
    // others keep relative order to each other
    const others = SECTION_ORDER.filter(k => k !== expandedKey);
    return others.indexOf(key) + 1;
  }, [expandedKey]);

  const getState = (key) => {
    if (!expandedKey) return 'normal';
    if (key === expandedKey) return 'expanded';
    return 'shrunk';
  };

  return (
    <>
      <style>{`
        @keyframes bgFadeIn      { from { opacity: 0 }    to { opacity: 1 } }
        @keyframes modalIn       { from { opacity: 0; transform: scale(0.96) translateY(10px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        @keyframes contentFadeIn { from { opacity: 0 }    to { opacity: 1 } }

        /* Hover ring on compact cards */
        .bio-card-compact:hover .card-ring { opacity: 1 !important; }
        .bio-card-compact:hover .expand-hint { opacity: 1 !important; }
      `}</style>

      <div style={{
        padding: '20px 48px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {SECTION_ORDER.map(key => (
          <SectionCard
            key={key}
            sectionKey={key}
            markers={DATA[key]}
            cardState={getState(key)}
            cssOrder={getOrder(key)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {modalKey && (
        <BiomarkerModal
          sectionKey={modalKey}
          markers={DATA[modalKey]}
          onClose={() => setModalKey(null)}
        />
      )}
    </>
  );
};

export default BiomarkerGrid;
