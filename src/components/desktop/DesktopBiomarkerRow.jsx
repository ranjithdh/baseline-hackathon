import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BIOMARKERS, SECTION_META, getBySection, groupByCategory } from './biomarkerData';
import BiomarkerStatusTag from './BiomarkerStatusTag';

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  return <BiomarkerStatusTag status={status} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// Expandable biomarker row
// ─────────────────────────────────────────────────────────────────────────────
const BiomarkerRow = React.memo(({ marker }) => {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '10px 14px', borderRadius: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Marker Name */}
      <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: '#e4e4e7', fontFamily: 'var(--font-main)' }}>
        {marker.name}
      </span>

      {/* Value (Fixed width for alignment) */}
      <div style={{ width: '100px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          {marker.value}
        </span>
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
          {marker.unit}
        </span>
      </div>

      {/* Status Pill (Fixed width area but dynamic tag) */}
      <div style={{ width: '130px', display: 'flex', justifyContent: 'flex-end' }}>
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
// Collapsed preview card (right column)
// ─────────────────────────────────────────────────────────────────────────────
const CollapsedCard = ({ sectionKey, onExpand, previewCount = 2 }) => {
  const meta = SECTION_META[sectionKey];
  const markers = useMemo(() => getBySection(sectionKey), [sectionKey]);
  const alertCount = markers.filter(m => ['high', 'low'].includes(m.status)).length;
  const preview = markers.slice(0, previewCount);

  return (
    <div
      onClick={() => onExpand(sectionKey)}
      style={{
        background: 'rgba(14,14,22,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.boxShadow = `0 0 16px ${meta.color.accent}18`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          {meta.label}
        </div>
        <div style={{
          fontSize: '10px', color: meta.color.text, background: meta.color.bg,
          padding: '3px 10px', borderRadius: '100px', fontWeight: 700, fontFamily: 'var(--font-mono)'
        }}>
          {sectionKey === 'negative' ? `${markers.length} ALERTS` :
           sectionKey === 'watch' ? `${markers.length} WATCH` :
           `${markers.length} OPTIMAL`}
        </div>
      </div>

      <div style={{ padding: '8px 12px 14px' }}>
        {preview.map((m, idx) => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderBottom: idx < preview.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'
          }}>
            <div style={{ flex: 1, fontSize: '13px', color: '#e4e4e7', fontWeight: 600, fontFamily: 'var(--font-main)' }}>{m.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', marginRight: '8px' }}>
              {m.value} <span style={{ fontSize: '10px', opacity: 0.6 }}>{m.unit}</span>
            </div>
            <StatusBadge status={m.status} />
          </div>
        ))}
        {markers.length > previewCount && (
          <div style={{
            padding: '12px 10px 0', fontSize: '10px', color: 'rgb(var(--primary))',
            fontFamily: 'var(--font-main)', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', opacity: 0.6
          }}>
            View More ({markers.length - previewCount})
          </div>
        )}
      </div>

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
              padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer'
            }}
          >
            Close
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
// Main export
// ─────────────────────────────────────────────────────────────────────────────
const DesktopBiomarkerRow = () => {
  const [activeSection, setActiveSection] = useState('negative');
  const [popupSection, setPopupSection] = useState(null);

  const handleExpand = useCallback((key) => {
    const markers = getBySection(key);
    if (markers.length > 15) {
      setPopupSection(key);
    } else {
      setActiveSection(key);
    }
  }, []);

  const activeMarkers = useMemo(() => getBySection(activeSection), [activeSection]);
  const activeMeta = SECTION_META[activeSection];

  // Split evenly: first half left, second half right
  const mid = Math.ceil(activeMarkers.length / 2);
  const leftMarkers = activeMarkers.slice(0, mid);
  const rightMarkers = activeMarkers.slice(mid);

  const collapsedSections = ['negative', 'watch', 'positive'].filter(s => s !== activeSection);
  const previewCount = activeMarkers.length > 24 ? 6 : 3;

  // Summary counts
  const totalCount = BIOMARKERS.length;
  const alertCount = BIOMARKERS.filter(m => ['high', 'low'].includes(m.status)).length;
  const watchCount = BIOMARKERS.filter(m => ['borderline_high', 'borderline_low'].includes(m.status)).length;
  const goodCount = BIOMARKERS.filter(m => ['optimal', 'normal'].includes(m.status)).length;

  // Section alert/watch summary for header chips
  const secAlerts = activeMarkers.filter(m => ['high', 'low'].includes(m.status)).length;
  const secWatches = activeMarkers.filter(m => ['borderline_high', 'borderline_low'].includes(m.status)).length;

  return (
    <div style={{ padding: '24px 48px 0' }}>


      {/* ── Layout: 3-column grid (2:1 split) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'start' }}>

        {/* ── Single wide expanded card (Spans 2 columns) ── */}
        <motion.div
          key={activeSection}
          layout
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            gridColumn: 'span 2',
            background: 'rgba(14,14,22,0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: `0 0 32px ${activeMeta.color.accent}18`,
          }}
        >
          {/* ── Card header (Screenshot Style) ── */}
          <div style={{
            padding: '16px 20px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              {activeMeta.label}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                fontSize: '10px', color: activeMeta.color.text, background: activeMeta.color.bg,
                padding: '3px 10px', borderRadius: '100px', fontWeight: 700, fontFamily: 'var(--font-mono)'
              }}>
                {activeSection === 'negative' ? `${activeMeta.count} ALERTS` :
                 activeSection === 'watch' ? `${activeMeta.count} WATCH` :
                 `${activeMeta.count} OPTIMAL`}
              </div>
              {secAlerts > 0 && activeSection !== 'negative' && (
                <span style={{ fontSize: '10px', background: 'rgba(239,68,68,0.15)', color: 'rgb(252,165,165)', padding: '3px 10px', borderRadius: '100px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{secAlerts} ALERTS</span>
              )}
            </div>
          </div>

          {/* ── Internal 2-column marker grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

            {/* Left half */}
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto', maxHeight: '500px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent', padding: '6px 4px' }}>
              <MarkerList markers={leftMarkers} />
            </div>

            {/* Right half */}
            <div style={{ overflowY: 'auto', maxHeight: '500px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent', padding: '6px 4px' }}>
              {rightMarkers.length > 0 ? (
                <MarkerList markers={rightMarkers} />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '11px', fontFamily: 'var(--font-main)' }}>—</div>
              )}
            </div>

          </div>
        </motion.div>

        {/* ── Right: Stacked collapsed preview cards (Spans 1 column) ── */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.08 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {collapsedSections.map(sec => (
            <CollapsedCard key={sec} sectionKey={sec} onExpand={handleExpand} previewCount={previewCount} />
          ))}
        </motion.div>

      </div>

      {/* ── Popup Modal ── */}
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

export default DesktopBiomarkerRow;
