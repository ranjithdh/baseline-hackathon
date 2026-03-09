import React from 'react';

const BookConsultation = ({ onBack, onShowTimeline }) => {
  return (
    <div className="bg-[#FDFCFB] text-slate-900 font-sans h-screen flex justify-center overflow-hidden">
      <main className="w-full max-w-[430px] h-full bg-[#FDFCFB] flex flex-col relative shadow-2xl">
        
        {/* Navigation */}
        <nav className="px-8 pt-12 mb-8 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase hover:text-amber-600 transition-all group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
            BACK TO PLAN
          </button>
        </nav>

        {/* Content */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto custom-scrollbar">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
              Expert<br />Consultation
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[95%] font-medium">
              Take the next step in your health journey with professional guidance tailored to your results.
            </p>
          </header>

          <section className="space-y-6">
            <div className="bg-amber-50/50 border border-amber-100/50 rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-4">
                <span className="material-symbols-outlined text-amber-600">medical_services</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Clinical Review</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                A 30-minute deep dive with a longevity specialist to review your biometric markers and refine your protocol.
              </p>
              <button
                className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(230,126,34,0.15)] active:scale-[0.98] transition-all hover:bg-amber-600"
                onClick={onShowTimeline}
              >
                Book Consultation
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-900/5 flex items-center justify-center border border-slate-900/10 mb-4">
                <span className="material-symbols-outlined text-slate-900">restaurant</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Nutritionist Sync</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                Get your personalized nutrition plan reviewed and optimized by our registered dietitians.
              </p>
              <button
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase shadow-xl active:scale-[0.98] transition-all hover:bg-black"
                onClick={() => alert('Sending to Nutritionist...')}
              >
                Nutritionist Review
              </button>
            </div>
          </section>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-[-100px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default BookConsultation;
