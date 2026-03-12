import React from 'react';
import TimelineDial from './TimelineDial';

const ActionPlanTimeline = ({ onBack }) => {
  return (
    <div className="bg-background text-foreground font-main h-[100dvh] flex justify-center overflow-hidden">
      <main className="w-full max-w-[430px] h-full bg-background flex flex-col relative shadow-2xl">
        
        {/* Navigation */}
        <nav className="px-6 sm:px-8 pt-8 mb-4 relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase hover:text-primary transition-all group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
            BACK
          </button>
        </nav>

        <header className="px-6 sm:px-8 mt-2 mb-8 relative z-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="material-symbols-outlined text-emerald-500 text-[24px]">check_circle</span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight uppercase leading-none font-heading mb-3">
            Action Plans<br />Approved
          </h1>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[260px] font-medium">
            Your personalized action plans have been safely stored. You can review and track them from your dashboard at any time.
          </p>
        </header>

        {/* Clock View */}
        <div className="flex-1 flex items-center justify-center relative px-8 z-10">
          <TimelineDial />
        </div>

        {/* Footer Info */}
        <footer className="px-6 sm:px-8 pb-12 pt-4 relative z-10">
          <button
            onClick={onBack}
            className="w-full bg-[#E4E4E7] text-zinc-950 font-black text-[12px] tracking-[0.4em] uppercase py-5 rounded-[24px] shadow-[0_0_30px_rgba(250,250,250,0.1)] hover:opacity-90 active:scale-[0.98] transition-all font-heading"
          >
            DONE
          </button>
        </footer>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-[-100px] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      </main>
    </div>
  );
};

export default ActionPlanTimeline;
