import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ActionDetail from './ActionDetail';

const ActionPlan = ({ onBack, onAnalyze }) => {
  const scrollContainerRef = useRef(null);
  const lastScrollY = useRef(0);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);
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

    return [
      {
        category: "Supplements",
        icon: "pill",
        items: getRandom(protocolPool.supplements, 4),
        borderClass: "gradient-border-white",
        bgImage: "file:///Users/apple/.gemini/antigravity/brain/a9f9dd11-ca93-4dde-a11f-e8700f653cb0/supplements_bg_bw_1772713067859.png"
      },
      {
        category: "Nutrition",
        icon: "restaurant",
        items: getRandom(protocolPool.nutrition, 3),
        borderClass: "gradient-border-mono",
        bgImage: "file:///Users/apple/.gemini/antigravity/brain/a9f9dd11-ca93-4dde-a11f-e8700f653cb0/nutrition_bg_bw_1772713086135.png"
      },
      {
        category: "Exercise",
        icon: "fitness_center",
        items: getRandom(protocolPool.exercises, 2),
        borderClass: "gradient-border-gray",
        bgImage: "file:///Users/apple/.gemini/antigravity/brain/a9f9dd11-ca93-4dde-a11f-e8700f653cb0/exercise_bg_bw_1772713104489.png"
      },
      {
        category: "Lifestyle",
        icon: "nights_stay",
        items: [...getRandom(protocolPool.sleep, 1), ...getRandom(protocolPool.stress, 1)],
        borderClass: "gradient-border-mono",
        bgImage: "file:///Users/apple/.gemini/antigravity/brain/a9f9dd11-ca93-4dde-a11f-e8700f653cb0/lifestyle_bg_bw_1772713120099.png"
      }
    ];
  });

  const [completedProtocols, setCompletedProtocols] = useState(() => {
    const allItems = selectedProtocols.flatMap(g => g.items);
    return new Set(allItems);
  });

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const scrollDiff = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 0) {
        setIsFooterVisible(true);
      } else if (scrollDiff > 5) {
        // Scrolling Down - Hide Footer
        setIsFooterVisible(false);
      } else if (scrollDiff < -5) {
        // Scrolling Up - Show Footer
        setIsFooterVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleProtocol = (item) => {
    setCompletedProtocols(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const getProgressStyle = (items) => {
    if (!items.length) return { width: '0%' };
    const completedCount = items.filter(item => completedProtocols.has(item)).length;
    const percentage = (completedCount / items.length) * 100;
    return { width: `${percentage}%` };
  };

  const getTargetScore = () => {
    const allItems = selectedProtocols.flatMap(g => g.items);
    const completedCount = allItems.filter(item => completedProtocols.has(item)).length;
    return baseScore + completedCount;
  };

  return (
    <div className="bg-background text-foreground font-main h-screen flex justify-center overflow-hidden">
      <main className="w-full max-w-[430px] h-full bg-background flex flex-col relative shadow-2xl">

        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-8 pt-12 pb-8 custom-scrollbar relative z-10"
        >
          <nav className="flex justify-between items-center mb-12">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase hover:text-primary transition-all group"
            >
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
              RE-ADJUST GOAL
            </button>
          </nav>

          <header className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none font-heading">
                Action<br />Plan
              </h1>
              <div className="text-right">
                <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Target Score</p>
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-4xl font-black text-primary leading-none font-heading">{getTargetScore()}</span>
                  <span className="text-sm font-bold opacity-30">/ 100</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[95%] font-medium">
              Your path to peak vitality. These protocols are prioritized for your unique biometric signature.
            </p>
          </header>

          <section className="space-y-6">
            {selectedProtocols.map((group, idx) => (
              <div
                key={idx}
                className="rounded-[32px] relative group overflow-hidden shadow-md border border-border"
                style={{
                  backgroundImage: `url(${group.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Readability Overlay - Solar Vitality Frosted Glass */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-0"></div>

                <div className="relative z-10 p-7">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-primary">{group.icon}</span>
                      </div>
                      <h2 className="text-[11px] font-black tracking-[0.2em] text-foreground uppercase font-heading">{group.category}</h2>
                    </div>
                    <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.4)] transition-all duration-1000"
                        style={getProgressStyle(group.items)}
                      ></div>
                    </div>
                  </div>
                  <ul className="space-y-5">
                    {group.items.map((item, i) => {
                      const isCompleted = completedProtocols.has(item);
                      return (
                        <li
                          key={i}
                          className={`flex items-center justify-between transition-all duration-300 ${isCompleted ? 'opacity-100 scale-100' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div 
                            className="flex-1 py-1"
                            onClick={() => setSelectedAction({ item, category: group.category })}
                          >
                            <span className={`text-[13px] font-bold tracking-tight ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{item}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-emerald-500 mb-0.5">+1</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleProtocol(item);
                              }}
                              className={`w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-md' : 'border-border text-transparent'}`}
                            >
                              <span className="material-symbols-outlined text-[16px] font-black">{isCompleted ? 'check' : ''}</span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
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

        {/* Static Footer Area */}
        <footer className={`px-8 pt-8 pb-14 bg-card/80 backdrop-blur-xl border-t border-border relative z-20 transition-all duration-500 ${selectedAction ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          <div className={`flex flex-col gap-6 overflow-hidden transition-all duration-500 ease-in-out ${isFooterVisible ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-8 pointer-events-none'}`}>
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
        </footer>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-[-100px] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default ActionPlan;
