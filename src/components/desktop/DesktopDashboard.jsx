import React, { useRef, useState } from 'react';
import DesktopSidebar        from './DesktopSidebar';
import DesktopTopBar         from './DesktopTopBar';
import DesktopScoreHero      from './DesktopScoreHero';
import DesktopBiomarkerRow   from './DesktopBiomarkerRow';
import DesktopPlanPanel      from './DesktopPlanPanel';
import DesktopConsultBanner  from './DesktopConsultBanner';
import ExpertGuidanceCard    from './ExpertGuidanceCard';
import { MAX_ACHIEVABLE }    from './desktopPlanData';


const DesktopDashboard = () => {
  const [activeNav, setActiveNav]  = useState('dashboard');
  const [goalTarget, setGoalTarget] = useState(70);
  const planPanelRef               = useRef(null);

  const scrollToPlanPanel = () => {
    planPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    // App shell: sticky 260px sidebar + scrollable main
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      height: '100vh',
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
        height: '100vh',
        overflowY: 'auto',
      }}>
         {/* ── Expert Guidance sticky banner (only when goal exceeds achievable) ── */}
        {/* {goalTarget > MAX_ACHIEVABLE && (
          <div style={{ width:'calc(100% - 260px)',position: 'fixed', top: 10, zIndex: 100, padding:'0px 48px' }}>
            <ExpertGuidanceCard targetScore={goalTarget} />
          </div>
        )} */}

        {/* Top bar */}
        <DesktopTopBar />

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
        <DesktopPlanPanel
          planPanelRef={planPanelRef}
          goalTarget={goalTarget}
          onGoalChange={setGoalTarget}
          onBookConsult={() => setActiveNav('consult')}
        />

      </main>
    </div>
  );
};

export default DesktopDashboard;
