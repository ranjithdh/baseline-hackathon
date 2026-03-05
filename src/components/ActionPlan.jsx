import React, { useState } from 'react';

const ActionPlan = ({ onBack }) => {
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

  return (
    <div className="bg-[#FDFCFB] text-slate-900 font-sans h-screen flex justify-center overflow-hidden">
      <main className="w-full max-w-[430px] h-full bg-[#FDFCFB] flex flex-col relative shadow-2xl">

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pt-12 pb-8 custom-scrollbar relative z-10">
          <nav className="flex justify-between items-center mb-12">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase hover:text-amber-600 transition-all group"
            >
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
              RE-ADJUST GOAL
            </button>
          </nav>

          <header className="mb-10">
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
              Action<br />Plan
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[95%] font-medium">
              Your path to peak vitality. These protocols are prioritized for your unique biometric signature.
            </p>
          </header>

          <section className="space-y-6">
            {selectedProtocols.map((group, idx) => (
              <div
                key={idx}
                className="rounded-[32px] relative group overflow-hidden shadow-[0_10px_30px_rgba(230,126,34,0.05)] border border-slate-50"
                style={{
                  backgroundImage: `url(${group.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Readability Overlay - Solar Vitality Frosted Glass */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-0"></div>

                <div className="relative z-10 p-7">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <span className="material-symbols-outlined text-amber-600">{group.icon}</span>
                      </div>
                      <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">{group.category}</h2>
                    </div>
                    <div className="h-1.5 w-16 bg-slate-100/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 shadow-[0_0_10px_rgba(230,126,34,0.4)] transition-all duration-1000"
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
                          onClick={() => toggleProtocol(item)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className={`text-[13px] font-bold tracking-tight ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>{item}</span>
                          <button className={`w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${isCompleted ? 'bg-amber-500 border-amber-500 text-white shadow-[0_4px_12px_rgba(230,126,34,0.3)]' : 'border-slate-200 text-transparent'}`}>
                            <span className="material-symbols-outlined text-[16px] font-black">{isCompleted ? 'check' : ''}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Static Footer Area */}
        <footer className="px-8 pt-8 pb-14 bg-white/80 backdrop-blur-xl border-t border-slate-100 relative z-20">
          <div className="flex flex-col gap-6">
            <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-4">
              <p className="text-[10px] text-amber-700/80 text-center leading-relaxed font-medium">
                <span className="font-black mr-1 uppercase tracking-widest text-[9px]">Disclaimer:</span>
                This action plan is based on your current biometric data and is intended for informational purposes only. Consult with a qualified healthcare professional before starting any new health protocol.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-amber-500 text-white py-5 rounded-3xl font-black text-[12px] tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(230,126,34,0.2)] active:scale-[0.98] transition-all hover:bg-amber-600 hover:shadow-[0_15px_30px_rgba(230,126,34,0.3)]"
                onClick={() => alert('Booking Consultation...')}
              >
                Book Consultation
              </button>
              <button
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-[12px] tracking-[0.2em] uppercase shadow-xl active:scale-[0.98] transition-all hover:bg-black"
                onClick={() => alert('Sending to Nutritionist...')}
              >
                Nutritionist Review
              </button>
            </div>
          </div>
        </footer>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-[-100px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default ActionPlan;
