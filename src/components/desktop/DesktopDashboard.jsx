import React, { useRef, useState } from 'react';
import DesktopSidebar        from './DesktopSidebar';
import DesktopTopBar         from './DesktopTopBar';
import DesktopScoreHero      from './DesktopScoreHero';
import DesktopBiomarkerRow   from './DesktopBiomarkerRow';
import DesktopPlanPanel      from './DesktopPlanPanel';
import DesktopConsultBanner  from './DesktopConsultBanner';


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

        {/* ── Row 1: Score Card + Consult Banner (side-by-side) ── */}
        <>
          <style>{`
            .hero-consult-row {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 28px;
              padding: 48px 48px 0;
              align-items: stretch;
            }
            @media (max-width: 900px) {
              .hero-consult-row { grid-template-columns: 1fr; }
            }
          `}</style>
          <div className="hero-consult-row">
            <DesktopScoreHero onSimulate={scrollToPlanPanel} />
            <DesktopConsultBanner onBookNow={() => setActiveNav('consult')} />
          </div>
        </>

        {/* ── Row 2: Biomarker cards (Working For You / Needs Attention / Watch Closely) ── */}
        <DesktopBiomarkerRow />

        {/* ── Plan panel (goal slider + accordion) ── */}
        <DesktopPlanPanel planPanelRef={planPanelRef} />

      </main>
    </div>
  );
};

export default DesktopDashboard;
