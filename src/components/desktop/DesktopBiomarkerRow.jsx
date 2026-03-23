import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { BIOMARKERS, SECTION_META, getBySection } from './biomarkerData';
import BiomarkerStatusTag from './BiomarkerStatusTag';
import { X, ChevronRight, Maximize2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  return <BiomarkerStatusTag status={status} />;
};

const BiomarkerRow = React.memo(({ marker }) => {
  return (
    <motion.div
      layout
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 12px', borderRadius: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Marker Name */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#e4e4e7',
          fontFamily: 'var(--font-main)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {marker.name}
        </span>
      </div>

      {/* Value */}
      <div style={{ width: '80px', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', flexShrink: 0 }}>
        <span style={{ fontSize: '13px', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
          {marker.value}
        </span>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
          {marker.unit}
        </span>
      </div>

      {/* Status Badge */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        <StatusBadge status={marker.status} />
      </div>
    </motion.div>
  );
});
BiomarkerRow.displayName = 'BiomarkerRow';

// ─────────────────────────────────────────────────────────────────────────────
// Renders a list of markers
// ─────────────────────────────────────────────────────────────────────────────
const MarkerList = ({ markers }) => {
  return (
    <motion.div layout>
      {markers.map(m => <BiomarkerRow key={m.id} marker={m} />)}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Popup Overlay for large sections
// ─────────────────────────────────────────────────────────────────────────────
const BiomarkerPopup = ({ sectionKey, markers, onClose }) => {
  const meta = SECTION_META[sectionKey];
  const left = markers.slice(0, 7);
  const right = markers.slice(7, 14);
  const hasRight = markers.length > 7;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px', background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)'
    }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '1100px', maxHeight: '90vh',
          background: 'rgba(12,12,18,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          boxShadow: `0 32px 64px rgba(0,0,0,0.5), 0 0 40px ${meta.color.accent}15`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          background: `linear-gradient(135deg, ${meta.color.bg} 0%, transparent 100%)`,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: meta.color.accent, boxShadow: `0 0 12px ${meta.color.accent}` }} />
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-heading)' }}>{meta.label}</span>
            <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: meta.color.text, padding: '3px 10px', borderRadius: '100px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{markers.length} MARKERS</span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* 2-column list */}
        <div style={{ display: 'grid', gridTemplateColumns: hasRight ? '1fr 1fr' : '1fr', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', overflowY: 'auto', borderRight: hasRight ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <MarkerList markers={left} />
          </div>
          {hasRight && (
            <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
              <MarkerList markers={right} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Unified Biomarker Section Wrapper
// ─────────────────────────────────────────────────────────────────────────────
const BiomarkerSection = ({ sectionKey, markers, isExpanded, onExpand }) => {
  const meta = SECTION_META[sectionKey];
  
  // Logic for display items
  const displayMarkers = isExpanded ? markers : markers.slice(0, 2);
  const left = markers.slice(0, 7);
  const right = markers.slice(7, 14);
  const hasRight = markers.length > 7;

  return (
    <motion.div
      layout
      layoutId={sectionKey}
      transition={{ 
        layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.4 }
      }}
      style={{
        background: 'rgba(14,14,22,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        zIndex: isExpanded ? 2 : 1
      }}
    >
      {/* Header */}
      <motion.div 
        layout="position"
        style={{
          padding: isExpanded ? '24px 32px' : '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(to bottom, ${meta.color.bg} 0%, transparent 100%)`
        }}
      >
        <div style={{
          fontSize: isExpanded ? '11px' : '10px',
          color: 'rgba(255,255,255,0.3)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: isExpanded ? '0.3em' : '0.25em',
          textTransform: 'uppercase',
          fontWeight: 700
        }}>
          {meta.label}
        </div>
        <div style={{
          fontSize: isExpanded ? '11px' : '10px',
          color: meta.color.text,
          background: meta.color.bg,
          padding: isExpanded ? '4px 12px' : '3px 10px',
          borderRadius: '100px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          border: `1px solid ${meta.color.border}`
        }}>
          {markers.length} {sectionKey === 'negative' ? 'ALERTS' : sectionKey === 'watch' ? 'WATCH' : 'OPTIMAL'}
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div 
        layout
        style={{ 
          padding: isExpanded ? '12px' : '8px',
          flex: 1
        }}
      >
        {isExpanded ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: hasRight ? '1fr 1fr' : '1fr',
              gap: '0px'
            }}
          >
            <div style={{ borderRight: hasRight ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <MarkerList markers={left} />
            </div>
            {hasRight && (
              <div>
                <MarkerList markers={right} />
              </div>
            )}
          </motion.div>
        ) : (
          <MarkerList markers={displayMarkers} />
        )}
      </motion.div>

      {/* Footer / Interaction */}
      {!isExpanded && (
        <motion.div
          layout="position"
          onClick={() => onExpand(sectionKey)}
          style={{
            padding: '12px 24px 18px',
            fontSize: '10px',
            color: 'rgb(var(--primary))',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            fontFamily: 'var(--font-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
        >
          View More ({markers.length - 2})
          <ChevronRight size={12} strokeWidth={3} />
        </motion.div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
const DesktopBiomarkerRow = () => {
  const [activeSection, setActiveSection] = useState('negative'); // 'negative' expanded by default
  const [popupSection, setPopupSection] = useState(null);

  // Sliced data based on requirements
  const negativeAll = useMemo(() => getBySection('negative').slice(0, 14), []);
  const watchAll = useMemo(() => getBySection('watch').slice(0, 15), []);
  const positiveAll = useMemo(() => getBySection('positive').slice(0, 11), []);

  const dataMap = {
    negative: negativeAll,
    watch: watchAll,
    positive: positiveAll
  };

  const handleExpand = useCallback((key) => {
    const markers = dataMap[key];
    if (markers.length > 14) {
      setPopupSection(key);
    } else {
      setActiveSection(key);
    }
  }, [dataMap]);

  const allKeys = ['negative', 'watch', 'positive'];
  const secondaryKeys = allKeys.filter(k => k !== activeSection);

  return (
    <div style={{ padding: '24px 48px 0' }}>
      <LayoutGroup>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          alignItems: 'stretch', // Ensure equal height for columns
          minHeight: '400px'
        }}>
          {/* ── LEFT COLUMN (Active) ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <BiomarkerSection
              key={activeSection}
              sectionKey={activeSection}
              markers={dataMap[activeSection]}
              isExpanded={true}
              onExpand={handleExpand}
            />
          </div>

          {/* ── RIGHT COLUMN (Stacked) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {secondaryKeys.map(key => (
              <BiomarkerSection
                key={key}
                sectionKey={key}
                markers={dataMap[key]}
                isExpanded={false}
                onExpand={handleExpand}
              />
            ))}
          </div>
        </div>
      </LayoutGroup>

      {/* ── Popup Modal ── */}
      <AnimatePresence>
        {popupSection && (
          <BiomarkerPopup
            sectionKey={popupSection}
            markers={dataMap[popupSection]}
            onClose={() => setPopupSection(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopBiomarkerRow;
