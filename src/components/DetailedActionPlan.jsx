import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailedActionPlan = ({ data, onBack }) => {
  const { completedProtocols } = data || { completedProtocols: new Set() };

  const [searchTerm, setSearchTerm] = useState("");

  const protocolPool = {
    Nutrition: ["Anti inflammatory", "Antioxidant", "Cruciferous", "Detox Support", "Good fat", "High Fat", "High fiber", "High Glycemic", "High Oxalate", "High protein", "High Purine", "Low fat", "Low Glycemic", "Pro Inflammatory", "Alcohol", "Probiotics", "Food fat", "High Sodium", "Low Fiber", "Polyphenol"],
    Supplements: ["Vitamin D", "Vitamin B12", "Folate", "Vitamin B6", "Vitamin B9", "Vitamin B1", "Vitamin B2", "Vitamin B3", "Magnesium", "Zinc", "Selenium", "Vitamin E", "Retinol", "Iron", "Vitamin B Complex", "Berberine", "Omega 3", "Fiber", "Citrus Bergamot", "CoQ 10", "Alpha Lipoic Acid", "Chromium", "NAC", "Milk Thistle (Silymarin)", "TUDCA", "Betaine", "Curcumin", "Creatine", "Ashwagandha", "Reservetrol", "Beetroot", "Quercetin", "L Carnitine"],
    Exercise: ["Strength Training", "Endurance", "HIIT"],
    Lifestyle: ["Sleep protocol", "Improve REM sleep", "Improve Deep sleep", "Imrove efficiency", "Fix stress", "Improve HRV"]
  };

  const categories = Object.keys(protocolPool);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const getDetails = (item) => {
    const details = {
      "HbA1c": {
        explanation: "Strategic management of glycemic variability. HbA1c reflects your average blood sugar levels over the past 2-3 months, serving as a key marker for metabolic stability.",
        biomarkers: ["Glucose", "Insulin"]
      },
      "Vitamin D": {
        explanation: "Critical hormone precursor regulation. Vitamin D is essential for bone mineralization, immune cell modulation, and neurotransmitter balance.",
        biomarkers: ["Calcium", "PTH", "Immune Markers"]
      },
      "Strength Training": {
        explanation: "Mechanical loading for metabolic efficiency. Resistance training increases GLUT4 translocation, improving systemic insulin sensitivity and lean mass retention.",
        biomarkers: ["Body Fat %", "Testosterone", "Glucose"]
      },
      "Sleep protocol": {
        explanation: "Circadian alignment and cognitive restoration. Optimizing sleep architecture ensures proper lymphatic drainage of the brain and hormonal homeostasis.",
        biomarkers: ["Cortisol", "HRV", "CRP"]
      },
      "default": {
        explanation: "Targeted clinical intervention designed to optimize your biological systems. This protocol addresses specific friction points identified in your biomarker analysis to improve overall resilience.",
        biomarkers: ["Metabolic Health", "Systemic Stability"]
      }
    };
    return details[item] || details["default"];
  };

  const getItemImage = (item) => {
    const map = {
      "Strength Training": "strength_training.png",
      "Endurance": "endurance.png",
      "HIIT": "hiit.png",
      "Anti inflammatory": "Anti-inflammatory.png",
      "Antioxidant": "Antioxidant.png",
      "Cruciferous": "Cruciferous.png",
      "Detox Support": "Detox Support.png",
      "Good fat": "Good Fat.png",
      "High Fat": "High Fat.png",
      "High fiber": "high_fibre.png",
      "High Glycemic": "glycemic.png",
      "High Oxalate": "Oxalate.png",
      "High protein": "High Protein.png",
      "High Purine": "purin.png",
      "Low fat": "Low Fat.png",
      "Low Glycemic": "Low Glycemic.png",
      "Pro Inflammatory": "Pro Inflammatory.png",
      "Alcohol": "Alcohol.png",
      "Probiotics": "Probiotics.png",
      "Food fat": "Food Fat.png",
      "High Sodium": "high_sodium.png",
      "Low Fiber": "Low Fiber.png",
      "Polyphenol": "Polyphenol.png",
      "Low fibre": "Low Fibre.png",
      "Sleep protocol": "sleep_protocol.png",
      "Improve REM sleep": "improve_rem_sleep.png",
      "Improve Deep sleep": "improve_deep_sleep.png",
      "Imrove efficiency": "improve_sleep_efficiency.png",
      "Fix stress": "fix_stress.png",
      "Improve HRV": "improve_hrv.png",
      "Vitamin D": "Vitamin D3 + K2.png",
      "Vitamin B12": "Vitamin B12.png",
      "Folate": "Folate.png",
      "Vitamin B6": "Vitamin B6.png",
      "Vitamin B9": "Vitamin B9.png",
      "Magnesium": "Magnesium Glycinate.png",
      "Zinc": "Zinc.png",
      "Iron": "Iron.png",
      "Berberine": "Berberine HCL.png",
      "Omega 3": "Omega 3 Fish Oil.png",
      "Chromium": "Chromium.png",
      "NAC": "Detox Support.png",
      "Milk Thistle (Silymarin)": "Milk Thistle (Silymarin).png",
      "Betaine": "Betaine.png",
      "Curcumin": "Anti-inflammatory.png",
      "Creatine": "Creatine Monohydrate.png",
      "Ashwagandha": "Ashwagandha.png",
      "Reservetrol": "Resveratrol.png",
      "Beetroot": "Antioxidant.png",
      "Quercetin": "Quercetin.png",
      "CoQ 10": "CoQ 10 (Ubiquinol).png",
    };

    const fileName = map[item] || "Polyphenol.png";
    return new URL(`../assets/action-images/${fileName}`, import.meta.url).href;
  };

  const getTargetScore = () => {
    const baseScore = 70;
    return baseScore + (data?.completedProtocols?.size || 0);
  };

  // Logic to filter all items if a search term is present
  const allItems = Object.values(protocolPool).flat();
  const searchResults = searchTerm.trim() === ""
    ? (protocolPool[activeCategory] || [])
    : allItems.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-[#09090b] text-[#f2f2f2] font-main flex justify-center overflow-hidden" style={{ height: '100dvh' }}>
      <main className="w-full max-w-[430px] h-full bg-[#09090b] flex flex-col relative shadow-2xl overflow-hidden">

        {/* Sticky Header Section */}
        <div className="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-900/40 px-6 pt-8 pb-4">
          <nav className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase hover:text-[#4c93ff] transition-all group"
            >
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
              ACTION PLAN
            </button>
          </nav>



          {/* Search Bar */}
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">search</span>
            <input
              type="text"
              placeholder="Search protocols (e.g. Vitamin D)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-[13px] text-white focus:outline-none focus:border-[#2b7fff] focus:ring-1 focus:ring-[#2b7fff]/20 transition-all placeholder:text-zinc-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Category Tabs - Only highlighted if not searching */}
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar -mx-2 px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchTerm(""); // Clear search when tab is explicitly clicked? 
                  // User said search works for all, so if searching we might show results from all.
                  // If searching, tabs are less relevant.
                }}
                className={`text-[11px] font-bold tracking-widest uppercase whitespace-nowrap px-4 py-2 rounded-full transition-all border ${activeCategory === cat && searchTerm === ""
                  ? 'bg-[#2b7fff] border-[#2b7fff] text-white shadow-[0_0_15px_rgba(43,127,255,0.3)]'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-6 pt-6 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={searchTerm ? "search-mode" : activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {searchTerm && (
                <div className="pb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    Search Results ({searchResults.length})
                  </span>
                </div>
              )}

              {searchResults.map((item, index) => {
                const details = getDetails(item);
                const itemImage = getItemImage(item);

                return (
                  <div
                    key={index}
                    className="rounded-[24px] border border-zinc-800/40 bg-[#0d0d0f] p-4 flex flex-col gap-4 shadow-2xl relative group"
                  >
                    <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden relative border border-white/5">
                      <img
                        src={itemImage}
                        alt={item}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="px-1 pb-2 flex flex-col gap-4 relative">
                      <div className="relative z-10">
                        <h3 className="text-[20px] font-bold text-white mb-2 font-heading tracking-tight">{item}</h3>
                        <p className="text-[13px] leading-relaxed text-zinc-400 font-medium font-main">
                          {details.explanation}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 relative z-10">
                        {details.biomarkers.map((bio, i) => (
                          <span key={i} className="text-[8px] font-bold text-blue-400/80 bg-blue-500/5 border border-blue-500/20 px-2 py-1 rounded-md uppercase tracking-wider">
                            {bio}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {searchResults.length === 0 && (
                <div className="py-20 text-center">
                  <span className="material-symbols-outlined text-4xl text-zinc-800 mb-4 opacity-50">search_off</span>
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No protocols found matching "{searchTerm}"</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar { display: none; }
          .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </main>
    </div>
  );
};

export default DetailedActionPlan;
