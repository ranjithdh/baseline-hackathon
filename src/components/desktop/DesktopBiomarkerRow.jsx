import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BIOMARKERS, SECTION_META, getBySection, groupByCategory } from './biomarkerData';

// ─────────────────────────────────────────────────────────────────────────────
// Status map
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  optimal:        { label: 'Optimal',       color: 'rgb(34,197,94)',   bg: 'rgba(34,197,94,0.12)',   dot: '#16a34a' },
  normal:         { label: 'Normal',        color: 'rgb(74,222,128)',  bg: 'rgba(74,222,128,0.12)',  dot: '#22c55e' },
  borderline_high:{ label: 'Borderline ↑',  color: 'rgb(251,191,36)',  bg: 'rgba(251,191,36,0.12)',  dot: '#f59e0b' },
  borderline_low: { label: 'Borderline ↓',  color: 'rgb(253,186,116)', bg: 'rgba(253,186,116,0.12)', dot: '#f97316' },
  high:           { label: 'High',          color: 'rgb(252,165,165)', bg: 'rgba(252,165,165,0.12)', dot: '#ef4444' },
  low:            { label: 'Low',           color: 'rgb(252,165,165)', bg: 'rgba(252,165,165,0.12)', dot: '#ef4444' },
  critical_high:  { label: 'Critical ↑',    color: 'rgb(254,202,202)', bg: 'rgba(254,202,202,0.15)', dot: '#dc2626' },
  critical_low:   { label: 'Critical ↓',    color: 'rgb(254,202,202)', bg: 'rgba(254,202,202,0.15)', dot: '#dc2626' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────
const StatusDot = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.normal;
  return <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, flexShrink: 0, display: 'inline-block' }} />;
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.normal;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      padding: '2px 7px', borderRadius: '999px',
      fontSize: '9px', fontWeight: 600,
      background: cfg.bg, color: cfg.color,
      whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: '0.02em',
      fontFamily: 'var(--font-main)',
    }}>
      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

const RangeBar = ({ value, range, status }) => {
  if (!range || range.length < 2) return null;
  const [lo, hi] = range;
  const span = hi - lo;
  const pct = span === 0 ? 50 : Math.min(100, Math.max(0, ((value - lo) / span) * 100));
  const isAlert = ['high', 'low', 'critical_high', 'critical_low'].includes(status);
  const isWatch = ['borderline_high', 'borderline_low'].includes(status);
  const c = isAlert ? '#ef4444' : isWatch ? '#f59e0b' : '#22c55e';
  return (
    <div style={{ width: '72px', flexShrink: 0 }}>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '15%', width: '70%', height: '100%', background: 'rgba(34,197,94,0.15)', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: '100%', background: c, borderRadius: '2px' }} />
        <div style={{ position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '6px', height: '6px', borderRadius: '50%', background: c, border: '1.5px solid rgba(0,0,0,0.5)', zIndex: 2 }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Expandable biomarker row
// ─────────────────────────────────────────────────────────────────────────────
const BiomarkerRow = React.memo(({ marker, accentColor }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div
        onClick={() => setExpanded(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '5px 8px', borderRadius: '7px', cursor: 'pointer',
          background: expanded ? `${accentColor}0d` : 'transparent',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = 'transparent'; }}
      >
        <StatusDot status={marker.status} />
        <span style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: 'rgba(228,228,231,0.85)', fontFamily: 'var(--font-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
          {marker.name}
        </span>
        <RangeBar value={marker.value} range={marker.range} status={marker.status} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0, minWidth: '54px', textAlign: 'right' }}>
          {marker.value}<span style={{ fontSize: '9px', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: '2px' }}>{marker.unit}</span>
        </span>
        <StatusBadge status={marker.status} />
        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '6px 16px 10px 21px', background: `${accentColor}08`, borderRadius: '0 0 7px 7px', marginBottom: '2px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>Target: {marker.range?.[0]}–{marker.range?.[1]} {marker.unit}</span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>|</span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{marker.category}</span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(228,228,231,0.4)', lineHeight: 1.5, fontFamily: 'var(--font-main)' }}>{marker.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
BiomarkerRow.displayName = 'BiomarkerRow';

// ─────────────────────────────────────────────────────────────────────────────
// Category sticky header
// ─────────────────────────────────────────────────────────────────────────────
const CategoryHeader = ({ category, count, alertCount }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '5px 8px 4px',
    position: 'sticky', top: 0, zIndex: 5,
    backgroundColor: 'rgba(9,9,16,0.95)',
    backdropFilter: 'blur(6px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '1px',
  }}>
    <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase', flex: 1 }}>{category}</span>
    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-mono)' }}>{count}</span>
    {alertCount > 0 && <span style={{ fontSize: '8px', background: 'rgba(239,68,68,0.2)', color: 'rgb(252,165,165)', padding: '1px 5px', borderRadius: '100px', fontWeight: 600 }}>{alertCount}!</span>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Renders a slice of markers grouped by category
// ─────────────────────────────────────────────────────────────────────────────
const MarkerList = ({ markers, accentColor }) => {
  const grouped = useMemo(() => {
    const map = {};
    const order = [];
    markers.forEach(m => {
      if (!map[m.category]) { map[m.category] = []; order.push(m.category); }
      map[m.category].push(m);
    });
    return order.map(cat => ({ cat, items: map[cat] }));
  }, [markers]);

  return (
    <div>
      {grouped.map(({ cat, items }) => {
        const alerts = items.filter(m => ['high', 'low'].includes(m.status)).length;
        return (
          <div key={cat}>
            <CategoryHeader category={cat} count={items.length} alertCount={alerts} />
            {items.map(m => <BiomarkerRow key={m.id} marker={m} accentColor={accentColor} />)}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Column sub-headers row (Marker / Range / Value / Status)
// ─────────────────────────────────────────────────────────────────────────────
const ColHeaders = () => (
  <div style={{ display: 'flex', gap: '6px', padding: '4px 8px 4px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '2px' }}>
    {['Marker', 'Range', 'Value', 'Status'].map((h, i) => (
      <span key={h} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', ...(i === 0 ? { flex: 1 } : i === 1 ? { width: '72px', flexShrink: 0 } : i === 2 ? { minWidth: '54px', textAlign: 'right', flexShrink: 0 } : { flexShrink: 0, width: '80px' }) }}>
        {h}
      </span>
    ))}
    <span style={{ width: '12px' }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Collapsed preview card (right column)
// ─────────────────────────────────────────────────────────────────────────────
const CollapsedCard = ({ sectionKey, onExpand }) => {
  const meta = SECTION_META[sectionKey];
  const markers = useMemo(() => getBySection(sectionKey), [sectionKey]);
  const alertCount = markers.filter(m => ['high', 'low'].includes(m.status)).length;
  const watchCount = markers.filter(m => ['borderline_high', 'borderline_low'].includes(m.status)).length;
  const preview = markers.slice(0, 5); // 5 items for visual height balance

  return (
    <div
      onClick={() => onExpand(sectionKey)}
      style={{
        background: 'rgba(14,14,22,0.97)',
        border: `1px solid ${meta.color.border}`,
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = meta.color.accent + '66'; e.currentTarget.style.boxShadow = `0 0 16px ${meta.color.accent}18`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = meta.color.border; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Header */}
      <div style={{ padding: '11px 14px 9px', background: `linear-gradient(135deg, ${meta.color.bg} 0%, transparent 100%)`, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: meta.color.accent, boxShadow: `0 0 6px ${meta.color.accent}88` }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(228,228,231,0.9)', fontFamily: 'var(--font-main)' }}>{meta.label}</span>
          <span style={{ fontSize: '10px', color: meta.color.text, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{meta.count}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {alertCount > 0 && (
            <span style={{ fontSize: '9px', background: 'rgba(239,68,68,0.18)', color: 'rgb(252,165,165)', padding: '2px 6px', borderRadius: '100px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{alertCount} alerts</span>
          )}
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>⤢</span>
        </div>
      </div>

      {/* 5-item preview */}
      <div style={{ padding: '6px 10px 4px' }}>
        {preview.map((m, idx) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', borderBottom: idx < preview.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <StatusDot status={m.status} />
            <span style={{ flex: 1, fontSize: '11px', color: 'rgba(228,228,231,0.65)', fontFamily: 'var(--font-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {m.value}<span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.25)', marginLeft: '2px' }}>{m.unit}</span>
            </span>
            <StatusBadge status={m.status} />
          </div>
        ))}
        {markers.length > 5 && (
          <div style={{ padding: '5px 0 2px', fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-main)', textAlign: 'center' }}>
            +{markers.length - 5} more — tap to expand
          </div>
        )}
      </div>

      {/* Summary footer */}
      <div style={{ padding: '5px 12px 8px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '10px' }}>
        {alertCount > 0 && <span style={{ fontSize: '10px', color: 'rgb(252,165,165)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>⚠ {alertCount} need action</span>}
        {watchCount > 0 && <span style={{ fontSize: '10px', color: 'rgb(251,191,36)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>◑ {watchCount} borderline</span>}
        {alertCount === 0 && watchCount === 0 && <span style={{ fontSize: '10px', color: 'rgb(74,222,128)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>✓ All good</span>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
const DesktopBiomarkerRow = () => {
  const [activeSection, setActiveSection] = useState('negative');
  const handleExpand = useCallback((key) => setActiveSection(key), []);

  const activeMarkers = useMemo(() => getBySection(activeSection), [activeSection]);
  const activeMeta = SECTION_META[activeSection];

  // Split evenly: first half left, second half right
  const mid = Math.ceil(activeMarkers.length / 2);
  const leftMarkers  = activeMarkers.slice(0, mid);
  const rightMarkers = activeMarkers.slice(mid);

  const collapsedSections = ['negative', 'watch', 'positive'].filter(s => s !== activeSection);

  // Summary counts
  const totalCount = BIOMARKERS.length;
  const alertCount = BIOMARKERS.filter(m => ['high', 'low'].includes(m.status)).length;
  const watchCount = BIOMARKERS.filter(m => ['borderline_high', 'borderline_low'].includes(m.status)).length;
  const goodCount  = BIOMARKERS.filter(m => ['optimal', 'normal'].includes(m.status)).length;

  // Section alert/watch summary for header chips
  const secAlerts  = activeMarkers.filter(m => ['high', 'low'].includes(m.status)).length;
  const secWatches = activeMarkers.filter(m => ['borderline_high', 'borderline_low'].includes(m.status)).length;

  return (
    <div style={{ padding: '24px 48px 0' }}>

      {/* ── Summary strip ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Biomarker Panel</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { label: `${totalCount} Total`,  bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' },
            { label: `${goodCount} Optimal`, bg: 'rgba(34,197,94,0.1)',    color: 'rgb(74,222,128)' },
            { label: `${watchCount} Watch`,  bg: 'rgba(245,158,11,0.1)',   color: 'rgb(251,191,36)' },
            { label: `${alertCount} Alert`,  bg: 'rgba(239,68,68,0.1)',    color: 'rgb(252,165,165)' },
          ].map(b => (
            <span key={b.label} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: b.bg, color: b.color, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
              {b.label}
            </span>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-main)' }}>Tap a card to switch view</span>
      </div>

      {/* ── Layout: wide card (2fr) + collapsed stack (1fr) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', alignItems: 'start' }}>

        {/* ── Single wide expanded card ── */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            background: 'rgba(14,14,22,0.97)',
            border: `1px solid ${activeMeta.color.border}`,
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: `0 0 32px ${activeMeta.color.accent}18`,
          }}
        >
          {/* ── Card header (single, no duplication) ── */}
          <div style={{
            padding: '14px 18px 12px',
            background: `linear-gradient(135deg, ${activeMeta.color.bg} 0%, transparent 100%)`,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: activeMeta.color.accent, boxShadow: `0 0 10px ${activeMeta.color.accent}99` }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(228,228,231,0.95)', fontFamily: 'var(--font-main)' }}>
              {activeMeta.label}
            </span>
            <span style={{ fontSize: '11px', color: activeMeta.color.text, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {activeMeta.count} markers
            </span>
            {/* Alert chips */}
            <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
              {secAlerts > 0 && (
                <span style={{ fontSize: '10px', background: 'rgba(239,68,68,0.15)', color: 'rgb(252,165,165)', padding: '2px 9px', borderRadius: '100px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>⚠ {secAlerts} alerts</span>
              )}
              {secWatches > 0 && (
                <span style={{ fontSize: '10px', background: 'rgba(245,158,11,0.15)', color: 'rgb(251,191,36)', padding: '2px 9px', borderRadius: '100px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>◑ {secWatches} borderline</span>
              )}
              {secAlerts === 0 && secWatches === 0 && (
                <span style={{ fontSize: '10px', color: 'rgb(74,222,128)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>✓ All in range</span>
              )}
            </div>
          </div>

          {/* ── Internal 2-column marker grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

            {/* Left half */}
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto', maxHeight: '500px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent', padding: '6px 4px' }}>
              <ColHeaders />
              <MarkerList markers={leftMarkers} accentColor={activeMeta.color.accent} />
            </div>

            {/* Right half */}
            <div style={{ overflowY: 'auto', maxHeight: '500px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent', padding: '6px 4px' }}>
              {rightMarkers.length > 0 ? (
                <>
                  <ColHeaders />
                  <MarkerList markers={rightMarkers} accentColor={activeMeta.color.accent} />
                </>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '11px', fontFamily: 'var(--font-main)' }}>—</div>
              )}
            </div>

          </div>
        </motion.div>

        {/* ── Right: 2 collapsed preview cards ── */}
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.08 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {collapsedSections.map(sec => (
            <CollapsedCard key={sec} sectionKey={sec} onExpand={handleExpand} />
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default DesktopBiomarkerRow;
