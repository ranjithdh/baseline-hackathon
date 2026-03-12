import React, { useRef, useState } from 'react';
import DesktopSidebar       from './DesktopSidebar';
import DesktopTopBar        from './DesktopTopBar';
import DesktopScoreHero     from './DesktopScoreHero';
import DesktopPlanPanel     from './DesktopPlanPanel';
import DesktopDownloadStrip from './DesktopDownloadStrip';

const DesktopDashboard = () => {
  const [activeNav, setActiveNav]  = useState('dashboard');
  const planPanelRef               = useRef(null);

  const scrollToPlanPanel = () => {
    planPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    // App shell: sticky 260px sidebar + scrollable main
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      minHeight: '100vh',
      width: '100%',
    }}>
      {/* ── Sidebar ── */}
      <DesktopSidebar
        activeNav={activeNav}
        onNavigate={setActiveNav}
      />

      {/* ── Main content ── */}
      <main style={{
        background: 'var(--bg-color)',
        minHeight: '100vh',
        overflowY: 'auto',
      }}>
        {/* Top bar */}
        <DesktopTopBar onBookConsult={() => setActiveNav('consult')} />

        {/* Score hero (2-col grid: arc card + summary cards) */}
        <DesktopScoreHero onSimulate={scrollToPlanPanel} />

        {/* Plan panel (goal slider + accordion) */}
        <DesktopPlanPanel planPanelRef={planPanelRef} />

        {/* Download strip */}
        <div style={{ marginTop: '48px' }}>
          <DesktopDownloadStrip />
        </div>
      </main>
    </div>
  );
};

export default DesktopDashboard;
