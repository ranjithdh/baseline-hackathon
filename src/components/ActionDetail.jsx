import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const protocolExplanations = {
  "Vitamin D": {
    rationale: "Vitamin D acts as a master hormone regulator. Your current level of 19.69 ng/mL is below the clinical threshold for immune and metabolic stability.",
    impact: "Stabilizing Vitamin D will improve insulin sensitivity and reduce systemic inflammation markers like hs-CRP.",
    protocol: "Take 5,000 IU daily with a fat-containing meal. Re-test in 90 days.",
    biomarkers: ["Vitamin D", "Fasting Insulation", "hs-CRP"]
  },
  "Berberine": {
    rationale: "Berberine activates the AMPK pathway, often called the 'metabolic master switch', which mimics the effects of exercise on glucose uptake.",
    impact: "Expect a reduction in HbA1c and improved lipid profiles within 8-12 weeks.",
    protocol: "500mg twice daily, 15 minutes before your largest meals.",
    biomarkers: ["HbA1c", "LDL", "Triglycerides"]
  },
  "Strength Training": {
    rationale: "Increasing lean muscle mass improves skeletal muscle glucose disposal, which is the primary site for insulin action.",
    impact: "Higher metabolic rate and improved hormonal balance (Testosterone/Cortisol ratio).",
    protocol: "3 sessions per week focusing on compound movements (Squats, Deadlifts, Presses).",
    biomarkers: ["Body Fat %", "Fasting Glucose", "Testosterone"]
  },
  "HIIT": {
    rationale: "High-Intensity Interval Training maximizes mitochondrial biogenesis and improves VO2 Max more efficiently than steady-state cardio.",
    impact: "Significant cardiovascular resilience and improved metabolic flexibility.",
    protocol: "1-2 sessions per week. 4 minutes of high intensity (85-95% Max HR) followed by 3 mins recovery.",
    biomarkers: ["VO2 Max", "Resting Heart Rate"]
  },
  "Fix stress": {
    rationale: "Chronic cortisol elevation triggers hepatic glucose release and suppresses immune function, creating systemic friction.",
    impact: "Stabilizing the HPA axis will lower resting glucose and improve sleep architecture.",
    protocol: "Daily 10-minute NSDR (Non-Sleep Deep Rest) or box breathing during high-stress windows.",
    biomarkers: ["Cortisol", "HRV", "Fasting Glucose"]
  },
  "Sleep protocol": {
    rationale: "Growth hormone release and glymphatic drainage occur primarily during deep sleep. Your biometrics suggest recovery is currently sub-optimal.",
    impact: "Improved cognitive function and faster recovery from physical stressors.",
    protocol: "Maintain a 65°F room temperature and zero blue-light exposure 60 mins before bed.",
    biomarkers: ["Biological Age", "Cortisol", "HRV"]
  }
};

const ActionDetail = ({ item, category, onClose }) => {
  const data = protocolExplanations[item] || {
    rationale: `${item} is a prioritized intervention selected by our systems-analysis to stabilize your ${category} indicators.`,
    impact: "This action is designed to reduce systemic friction and improve overall biometric resilience.",
    protocol: "Integrate this into your daily routine as specified in your personalized timeline.",
    biomarkers: ["System Stability"]
  };

  return (    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-background overflow-hidden flex flex-col items-center"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(var(--brand-color), 0.1) 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Crosshair / Grid Markers */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border/30 z-0 pointer-events-none" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-border/30 z-0 pointer-events-none" />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[430px] h-full flex flex-col p-8 pt-16 relative z-10 overflow-y-auto no-scrollbar"
      >
        {/* Navigation */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 group flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-all mb-1 text-muted-foreground bg-card/80 backdrop-blur-sm shadow-sm">
            <span className="material-symbols-outlined text-xl group-hover:text-primary transition-colors">close</span>
          </div>
          <span className="text-muted-foreground opacity-50 text-[6px] font-black uppercase tracking-[0.4em]">Close</span>
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em] font-mono">Analysis / Protocol_{category.toUpperCase()}</span>
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-[0.9] font-heading">
            {item}
          </h1>
        </header>

        <div className="space-y-10">
          {/* Scientific Rationale - The "Dossier" look */}
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-primary/20" />
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-4 font-mono">
              Scientific_Rationale
            </h3>
            <p className="text-foreground opacity-90 text-[15px] leading-relaxed font-bold font-main">
              {data.rationale}
            </p>
          </section>

          {/* Biological Impact - Technical Plate */}
          <section className="p-8 rounded-[40px] bg-foreground text-background shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-all duration-1000" />
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-primary text-base">analytics</span>
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] font-mono">
                        Projected_Shift
                    </h3>
                </div>
                
                <p className="text-background opacity-80 text-[14px] leading-relaxed font-semibold mb-8 font-main">
                  {data.impact}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {data.biomarkers.map((marker, i) => (
                    <div key={i} className="px-4 py-3 rounded-2xl bg-background/5 border border-background/10 flex flex-col gap-1 transition-all hover:bg-background/10">
                      <span className="text-[7px] font-black uppercase tracking-widest text-background opacity-40">Marker</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-background font-mono">{marker}</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </section>

          {/* Execution Protocol - The Blueprint Card */}
          <section className="p-8 rounded-[40px] bg-card border border-border shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(var(--brand-color), 0.1) 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
            
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-6 font-mono">
              Implementation_Specs
            </h3>
            
            <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-3xl bg-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/10 relative group">
                    <div className="absolute inset-0 bg-primary/10 rounded-3xl scale-0 group-hover:scale-100 transition-transform duration-500" />
                    <span className="material-symbols-outlined text-primary text-2xl relative z-10">assignment_turned_in</span>
                </div>
                <div>
                   <p className="text-foreground opacity-80 text-[14px] leading-relaxed font-bold font-main">
                     {data.protocol}
                   </p>
                   <div className="mt-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[9px] font-black text-muted-foreground opacity-30 uppercase tracking-widest">Protocol Verified</span>
                   </div>
                </div>
            </div>
          </section>
        </div>

        {/* Decorative Branding Footnote */}
        <div className="mt-16 mb-8 flex flex-col items-center gap-4">
            <div className="h-[1px] w-12 bg-border" />
            <span className="text-muted-foreground opacity-50 text-[8px] font-black uppercase tracking-[0.8em] font-mono">Baseline Labs / BioDossier.v1</span>
            
            <button 
                onClick={onClose}
                className="w-full mt-4 py-6 rounded-[28px] bg-primary text-primary-foreground font-black text-[10px] tracking-[0.5em] uppercase hover:opacity-90 transition-all shadow-xl active:scale-[0.98] font-heading"
            >
                Return to Protocol List
            </button>
        </div>
      </motion.div>

      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

export default ActionDetail;
