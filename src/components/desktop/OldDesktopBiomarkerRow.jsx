import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BIOMARKERS, SECTION_META, getBySection, groupByCategory } from './biomarkerData';
import OldBiomarkerStatusTag from './OldBiomarkerStatusTag';
import { X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  return <OldBiomarkerStatusTag status={status} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// Expandable biomarker row
// ─────────────────────────────────────────────────────────────────────────────
const BiomarkerRow = React.memo(({ marker }) => {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 12px', borderRadius: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Marker Name (Leading) */}
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

      {/* Value (Center-aligned) */}
      <div style={{ width: '80px', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', flexShrink: 0 }}>
        <span style={{ fontSize: '13px', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
          {marker.value}
        </span>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
          {marker.unit}
        </span>
      </div>

      {/* Inference (Status Pill) (Trailing) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        <StatusBadge status={marker.status} />
      </div>
    </div>
  );
});
BiomarkerRow.displayName = 'BiomarkerRow';

// ─────────────────────────────────────────────────────────────────────────────
// Renders a flat list of markers
// ─────────────────────────────────────────────────────────────────────────────
const MarkerList = ({ markers }) => {
  return (
    <div>
      {markers.map(m => <BiomarkerRow key={m.id} marker={m} />)}
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// Popup Overlay for large sections (>15 markers)
// ─────────────────────────────────────────────────────────────────────────────
const BiomarkerPopup = ({ sectionKey, onClose }) => {
  const meta = SECTION_META[sectionKey];
  const markers = useMemo(() => getBySection(sectionKey), [sectionKey]);
  const mid = Math.ceil(markers.length / 2);
  const left = markers.slice(0, mid);
  const right = markers.slice(mid);

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
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* 2-column list */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            <MarkerList markers={left} />
          </div>
          <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
            <MarkerList markers={right} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section Column Component
// ─────────────────────────────────────────────────────────────────────────────
const SectionColumn = ({ sectionKey, onExpand }) => {
  const meta = SECTION_META[sectionKey];
  const markers = useMemo(() => getBySection(sectionKey), [sectionKey]);
  const preview = markers.slice(0, 4);

  return (
    <div
      style={{
        background: 'rgba(14,14,22,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${meta.color.accent}08`,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '18px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        background: `linear-gradient(to bottom, ${meta.color.bg} 0%, transparent 100%)`,
      }}>
        <div style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontWeight: 700
        }}>
          {meta.label}
        </div>
        <div style={{
          fontSize: '10px', color: meta.color.text, background: meta.color.bg,
          padding: '3px 10px', borderRadius: '100px', fontWeight: 700, fontFamily: 'var(--font-mono)',
          border: `1px solid ${meta.color.border}`
        }}>
          {sectionKey === 'negative' ? `${markers.length} ALERTS` :
            sectionKey === 'watch' ? `${markers.length} WATCH` :
              `${markers.length} OPTIMAL`}
        </div>
      </div>

      {/* List content (Limited to 4 items) */}
      <div style={{
        padding: '8px 4px',
      }}>
        <MarkerList markers={preview} />
      </div>

      {/* Footer / View More popup */}
      {markers.length > 4 && (
        <div
          onClick={() => onExpand(sectionKey)}
          style={{
            padding: '12px 20px 18px',
            fontSize: '10px',
            color: 'rgb(var(--primary))',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            textAlign: 'left',
            opacity: 0.6,
            transition: 'opacity 0.2s',
            fontFamily: 'var(--font-main)'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
        >
          View More ({markers.length - 4})
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
const OldDesktopBiomarkerRow = () => {
  const [popupSection, setPopupSection] = useState(null);

  const handleOpenPopup = useCallback((key) => {
    setPopupSection(key);
  }, []);

  return (
    <div style={{ padding: '24px 48px 0' }}>

      {/* ── Layout: 3-column grid (Equal split) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        <SectionColumn sectionKey="negative" onExpand={handleOpenPopup} />
        <SectionColumn sectionKey="watch" onExpand={handleOpenPopup} />
        <SectionColumn sectionKey="positive" onExpand={handleOpenPopup} />
      </div>

      {/* ── Popup Modal for deep dives ── */}
      <AnimatePresence>
        {popupSection && (
          <BiomarkerPopup
            sectionKey={popupSection}
            onClose={() => setPopupSection(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OldDesktopBiomarkerRow;
