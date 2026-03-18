import React from 'react';
import { motion } from 'framer-motion';
import MobileScoreHero from './MobileScoreHero';
import MobileConsultBanner from './MobileConsultBanner';
import MobileBiomarkerSummary from './MobileBiomarkerSummary';

const MobileDashboard = ({ onDetail, onSetGoal, onScoreClick, goalTarget }) => {
  return (
    <div className="dashboard-container relative h-[100dvh] overflow-y-auto overflow-x-hidden" style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <header className="w-full pt-8 mb-4 px-4 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-[24px] font-medium text-white tracking-tight font-heading">Welcome Guest</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-white/60 text-[24px]">account_circle</span>
        </div>
      </header>

      {/* Hero & Consult */}
      <MobileScoreHero onSimulate={onSetGoal} />
      <MobileConsultBanner onBookNow={() => console.log('Book consultation mobile')} />

      {/* Biomarkers Stacked */}
      <MobileBiomarkerSummary />

    </div>
  );
};

export default MobileDashboard;
