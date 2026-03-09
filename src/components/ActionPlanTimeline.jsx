import React from 'react';
import TimelineDial from './TimelineDial';

const ActionPlanTimeline = ({ onBack }) => {
  return (
    <div className="bg-[#FDFCFB] text-slate-900 font-sans h-screen flex justify-center overflow-hidden">
      <main className="w-full max-w-[430px] h-full bg-[#FDFCFB] flex flex-col relative shadow-2xl">
        
        {/* Navigation */}
        <nav className="px-8 pt-12 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase hover:text-amber-600 transition-all group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
            BACK TO DASHBOARD
          </button>
        </nav>

        <header className="px-8 mb-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Daily<br />Timeline
          </h1>
        </header>

        {/* Clock View */}
        <div className="flex-1 flex items-center justify-center relative px-8">
          <TimelineDial />
        </div>

        {/* Footer Info */}
        <footer className="px-8 pt-4 pb-12">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-2">Next Scheduled</h4>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg font-black truncate">Hydration</p>
                            <p className="text-xs text-slate-400">3:00 PM</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                            <span className="material-symbols-outlined text-white">chevron_right</span>
                        </div>
                    </div>
                </div>
                {/* Decorative pulse */}
                <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-amber-500/10 rounded-full blur-xl"></div>
            </div>
        </footer>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-[-100px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default ActionPlanTimeline;
