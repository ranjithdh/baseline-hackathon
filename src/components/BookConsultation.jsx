import React from 'react';

const BookConsultation = ({ onBack, onShowTimeline }) => {
  return (
    <div className="bg-background text-foreground font-main flex justify-center overflow-hidden" style={{ height: '100dvh' }}>
      <main className="w-full max-w-[430px] h-full bg-background flex flex-col relative shadow-2xl">

        {/* Navigation */}
        <nav className="px-8 pt-12 mb-8 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase hover:text-primary transition-all group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
            BACK TO PLAN
          </button>
        </nav>

        {/* Content */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto custom-scrollbar">
          <header className="mb-10">
            <h1 className="text-[22px] font-medium text-[#E4E4E7] mb-4 tracking-tight uppercase leading-tight font-heading">
              Expert Consultation
            </h1>
            <p className="text-[#A1A1AA] text-[12px] leading-relaxed max-w-[95%] font-normal">
              Take the next step in your health journey with professional guidance tailored to your results.
            </p>
          </header>

          <section className="space-y-6">
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-[32px] p-8 shadow-2xl">
              <div className="w-12 h-12 rounded-[18px] bg-zinc-950 flex items-center justify-center border border-zinc-800 shadow-xl mb-6">
                <span className="material-symbols-outlined text-primary text-xl">medical_services</span>
              </div>
              <h3 className="text-[12px] font-black text-[#E4E4E7] mb-3 uppercase tracking-tight font-heading">Clinical Review</h3>
              <p className="text-[#A1A1AA] text-[12px] leading-[1.6] mb-8 font-normal">
                A 30-minute deep dive with a longevity specialist to review your biometric markers and refine your protocol.
              </p>
              <button
                className="w-full bg-[#2B7FFF] text-white py-5 rounded-full font-black text-[12px] tracking-[0.25em] uppercase shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all hover:opacity-90 font-heading"
                onClick={onShowTimeline}
              >
                Book Consultation
              </button>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-[32px] p-8 shadow-2xl">
              <div className="w-12 h-12 rounded-[18px] bg-zinc-950 flex items-center justify-center border border-zinc-800 shadow-xl mb-6">
                <span className="material-symbols-outlined text-[#E4E4E7] text-xl">restaurant</span>
              </div>
              <h3 className="text-[12px] font-black text-[#E4E4E7] mb-3 uppercase tracking-tight font-heading">Nutritionist Sync</h3>
              <p className="text-[#A1A1AA] text-[12px] leading-[1.6] mb-8 font-normal">
                Get your personalized nutrition plan reviewed and optimized by our registered dietitians.
              </p>
              <button
                className="w-full bg-[#E4E4E7] text-zinc-950 py-5 rounded-full font-black text-[12px] tracking-[0.25em] uppercase shadow-2xl shadow-primary/20 active:scale-[0.98] transition-all hover:opacity-90 font-heading"
                onClick={() => alert('Sending to Nutritionist...')}
              >
                Nutritionist Review
              </button>
            </div>
          </section>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-[-100px] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default BookConsultation;
