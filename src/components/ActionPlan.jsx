import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActionDetail from './ActionDetail';

const ActionPlan = ({ onBack, onAnalyze }) => {
  const scrollContainerRef = useRef(null);
  const lastScrollY = useRef(0);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState("Nutrition");
  const baseScore = 72;

  const protocolPool = {
    exercises: ["Strength Training", "Endurance", "HIIT"],
    nutrition: ["Anti inflammatory", "Antioxidant", "Cruciferous", "Detox Support", "Good fat", "High Fat", "High fiber", "High Glycemic", "High Oxalate", "High protein", "High Purine", "Low fat", "Low Glycemic", "Pro Inflammatory", "Alcohol", "Probiotics", "Food fat", "High Sodium", "Low Fiber", "Polyphenol", "Low fibre"],
    sleep: ["Sleep protocol", "Improve REM sleep", "Improve Deep sleep", "Imrove efficiency"],
    stress: ["Fix stress", "Improve HRV"],
    supplements: ["Vitamin D", "Vitamin B12", "Folate", "Vitamin B6", "Vitamin B9", "Vitamin B1", "Vitamin B2", "Vitamin B3", "Magnesium", "Zinc", "Selenium", "Vitamin E", "Retinol", "Iron", "Vitamin B Complex", "Berberine", "Omega 3", "Fiber", "Citrus Bergamot", "CoQ 10", "Alpha Lipoic Acid", "Chromium", "NAC", "Milk Thistle (Silymarin)", "TUDCA", "Betaine", "Curcumin", "Creatine", "Ashwagandha", "Reservetrol", "Beetroot", "Quercetin", "L Carnitine"]
  };

  const [selectedProtocols] = useState(() => {
    const getRandom = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    // Nutrition first, then Supplements, then others
    return [
      {
        category: "Nutrition",
        icon: "restaurant",
        items: getRandom(protocolPool.nutrition, 4),
        bgImage: "file:///Users/apple/.gemini/antigravity/brain/a9f9dd11-ca93-4dde-a11f-e8700f653cb0/nutrition_bg_bw_1772713086135.png"
      },
      {
        category: "Supplements",
        icon: "pill",
        items: getRandom(protocolPool.supplements, 20),
        bgImage: "file:///Users/apple/.gemini/antigravity/brain/a9f9dd11-ca93-4dde-a11f-e8700f653cb0/supplements_bg_bw_1772713067859.png"
      },
      {
        category: "Exercise",
        icon: "fitness_center",
        items: getRandom(protocolPool.exercises, 3),
        bgImage: "file:///Users/apple/.gemini/antigravity/brain/a9f9dd11-ca93-4dde-a11f-e8700f653cb0/exercise_bg_bw_1772713104489.png"
      },
      {
        category: "Lifestyle",
        icon: "nights_stay",
        items: [...getRandom(protocolPool.sleep, 2), ...getRandom(protocolPool.stress, 1)],
        bgImage: "file:///Users/apple/.gemini/antigravity/brain/a9f9dd11-ca93-4dde-a11f-e8700f653cb0/lifestyle_bg_bw_1772713120099.png"
      }
    ];
  });

  const [completedProtocols, setCompletedProtocols] = useState(new Set());

  useEffect(() => {
    // No-op for scroll visibility - footer is now absolute and conditional
  }, []);

  const toggleProtocol = (item) => {
    setCompletedProtocols(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const getProgressInfo = (group) => {
    const completedCount = group.items.filter(item => completedProtocols.has(item)).length;
    return {
      completed: completedCount,
      total: group.items.length,
      percentage: (completedCount / group.items.length) * 100
    };
  };

  const getTargetScore = () => {
    const allItems = selectedProtocols.flatMap(g => g.items);
    const completedCount = allItems.filter(item => completedProtocols.has(item)).length;
    return baseScore + completedCount;
  };

  return (
    <div className="bg-background text-foreground font-main h-screen flex justify-center overflow-hidden">
      <main className="w-full max-w-[430px] h-full bg-background flex flex-col relative shadow-2xl overflow-hidden">

        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar relative z-10"
        >
          {/* Sticky Header Section */}
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-zinc-800/20 px-6 sm:px-8 pt-8 pb-6">
            <nav className="flex justify-between items-center mb-8">
              <button
                onClick={onBack}
                className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-muted-foreground hover:text-primary transition-all group px-4 py-2 bg-zinc-900/50 rounded-full border border-zinc-800/50"
              >
                <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
                ADJUST GOAL
              </button>
            </nav>

            <header className="relative">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-[0.85] font-heading">
                    Action<br />
                    <span className="text-primary">Plan</span>
                  </h1>
                </div>
                <div className="text-right pb-1">
                  <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2 opacity-50">Target Score</p>
                  <div className="flex items-baseline gap-1">
                    <motion.span
                      key={getTargetScore()}
                      initial={{ scale: 1.1, color: 'rgb(var(--primary))' }}
                      animate={{ scale: 1, color: 'var(--foreground)' }}
                      className="text-5xl font-black leading-none font-heading"
                    >
                      {getTargetScore()}
                    </motion.span>
                    <span className="text-base font-bold opacity-20">/100</span>
                  </div>
                </div>
              </div>
            </header>
          </div>

          <div className="px-6 sm:px-8 pt-8 pb-48">
            <section className="space-y-5">
            {selectedProtocols.map((group, idx) => {
              const isOpen = expandedCategory === group.category;
              const progress = getProgressInfo(group);

              return (
                <div
                  key={idx}
                  className={`rounded-[40px] border transition-all duration-700 overflow-hidden relative ${isOpen ? 'bg-zinc-950 border-zinc-700/40 shadow-2xl' : 'bg-zinc-900/40 border-zinc-800/40 hover:border-zinc-700/50'
                    }`}
                >
                  {/* Category Image Overlay */}
                  <div className={`absolute top-0 right-0 pointer-events-none overflow-hidden transition-all duration-700 ${isOpen ? 'w-full h-[100px] opacity-10' : 'w-full h-full opacity-5'
                    }`}>
                    <img src={group.bgImage} alt="" className="w-full h-full object-cover grayscale brightness-200" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-zinc-950/80 to-zinc-950" />
                  </div>

                  <button
                    onClick={() => setExpandedCategory(isOpen ? null : group.category)}
                    className="w-full p-8 flex justify-between items-center relative z-10 group"
                  >
                    <div className="flex items-center gap-6 text-left">
                      <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center border transition-all duration-500 shadow-xl overflow-hidden bg-zinc-950 ${isOpen ? 'border-primary shadow-[0_0_15px_rgba(var(--brand-color),0.2)]' : 'border-zinc-800'
                        }`}>
                        <span className={`material-symbols-outlined text-2xl transition-colors duration-500 ${isOpen ? 'text-primary' : 'text-primary/40'}`}>{group.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">{group.category}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 flex items-center gap-2">
                          <span className="text-primary">{progress.completed} of {progress.total}</span> SELECTED
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`material-symbols-outlined transition-transform duration-700 text-muted-foreground ${isOpen ? 'rotate-180 text-primary scale-110' : 'group-hover:translate-y-1'}`}>
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-8 pb-10 pt-2">
                          <ul className="space-y-3.5 relative">
                            {/* Connection Line */}
                            <div className="absolute left-7 top-0 bottom-0 w-px bg-zinc-800/50" />

                            {group.items.map((item, i) => {
                              const isCompleted = completedProtocols.has(item);
                              return (
                                <li
                                  key={i}
                                  className={`flex items-center justify-between p-6 rounded-[30px] border transition-all duration-300 relative ${isCompleted
                                    ? 'bg-zinc-900/80 border-emerald-500/20 shadow-lg'
                                    : 'bg-zinc-950/40 border-zinc-800/60 hover:border-zinc-700'
                                    }`}
                                >
                                  <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => setSelectedAction({ item, category: group.category })}
                                  >
                                    <span className={`text-[15px] font-bold tracking-tight block ${isCompleted ? 'text-foreground' : 'text-foreground/60'}`}>
                                      {item}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${isCompleted ? 'text-emerald-500' : 'text-muted-foreground opacity-30'}`}>
                                      +1 POINT
                                    </span>
                                    <button
                                      onClick={() => toggleProtocol(item)}
                                      className={`w-9 h-9 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${isCompleted
                                        ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                        : 'border-zinc-800 text-transparent hover:border-zinc-600'
                                        }`}
                                    >
                                      <span className="material-symbols-outlined text-[20px] font-black">
                                        {isCompleted ? 'check' : ''}
                                      </span>
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </section>

          <AnimatePresence>
            {selectedAction && (
              <ActionDetail
                item={selectedAction.item}
                category={selectedAction.category}
                onClose={() => setSelectedAction(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

        {/* Conditional & Absolute Footer Area */}
        <AnimatePresence>
          {completedProtocols.size > 0 && !selectedAction && (
            <motion.footer
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 px-8 pt-8 pb-14 bg-card/90 backdrop-blur-2xl border-t border-border z-40"
            >
              <div className="flex flex-col gap-6">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                  <p className="text-[10px] text-primary-text text-center leading-relaxed font-medium">
                    <span className="font-black mr-1 uppercase tracking-widest text-[9px]">Disclaimer:</span>
                    This action plan is based on your current biometric data and is intended for informational purposes only. Consult with a qualified healthcare professional before starting any new health protocol.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    className="w-full bg-primary text-primary-foreground py-5 rounded-3xl font-black text-[12px] tracking-[0.2em] uppercase shadow-xl active:scale-[0.98] transition-all hover:opacity-90 font-heading"
                    onClick={onAnalyze}
                  >
                    Analyze & Book
                  </button>
                </div>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-[-100px] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default ActionPlan;
