import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GoalActionCombined = ({ onBack, onAnalyze, onViewDetailed }) => {
  const [goalScore, setGoalScore] = useState(88);
  const [completedProtocols, setCompletedProtocols] = useState(new Set());

  const baseScore = 65;

  const protocolData = [
    {
      category: "Nutrition",
      icon: "restaurant",
      items: ["Anti inflammatory", "Antioxidant", "Cruciferous", "Detox Support", "Good fat"],
      color: "#10b981"
    },
    {
      category: "Supplements",
      icon: "pill",
      items: ["Vitamin D", "Vitamin B12", "Folate", "Magnesium", "Zinc", "Omega 3", "Berberine", "CoQ 10"],
      color: "#3b82f6"
    },
    {
      category: "Exercise",
      icon: "fitness_center",
      items: ["Strength Training", "Endurance", "HIIT"],
      color: "#f59e0b"
    },
    {
      category: "Lifestyle",
      icon: "nights_stay",
      items: ["Sleep protocol", "Improve REM sleep", "Improve Deep sleep"],
      color: "#a855f7"
    }
  ];

  const currentLevel = useMemo(() => {
    return Math.min(100, baseScore + completedProtocols.size);
  }, [completedProtocols]);

  const status = useMemo(() => {
    if (currentLevel < 50) return { label: 'Compromised', color: 'var(--rating-rank-2)' };
    if (currentLevel < 65) return { label: 'Constrained', color: 'var(--rating-rank-3)' };
    if (currentLevel < 75) return { label: 'Stable', color: 'var(--rating-rank-4)' };
    if (currentLevel < 85) return { label: 'Robust', color: 'var(--rating-rank-5)' };
    return { label: 'Elite', color: 'var(--rating-rank-6)' };
  }, [currentLevel]);

  const toggleProtocol = (item) => {
    setCompletedProtocols(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const progressToGoal = ((currentLevel - baseScore) / (goalScore - baseScore)) * 100;

  return (
    <div className="fixed inset-0 bg-[#070708] text-white flex flex-col font-sans z-[1000]">

      {/* Top Half: Performance Metrics (40%) */}
      <div className="h-[40%] relative px-10 flex flex-col justify-center border-b border-white/5 overflow-hidden pt-8">
        {/* Bio-Glow Background */}
        <div
          className="absolute inset-0 opacity-10 blur-[120px] pointer-events-none transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle at center, rgb(${status.color}) 0%, transparent 70%)`
          }}
        />

        {/* Navigation Overlay */}
        <nav className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase hover:text-white transition-all group">
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
            Dashboard
          </button>
        </nav>

        <div className="relative z-10 w-full max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentcolor] animate-pulse" style={{ backgroundColor: `rgb(${status.color})` }} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: `rgb(${status.color})` }}>{status.label}</span>
              </div>
              <motion.div
                key={currentLevel}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-8xl font-black tracking-tighter tabular-nums leading-none"
              >
                {currentLevel}
              </motion.div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-black text-white/20 tabular-nums">+{currentLevel - baseScore}</div>

              <div className="mt-6 flex flex-col items-end">
                <span className="text-[20px] font-black text-white tabular-nums">{goalScore}</span>
                <div className="w-10 h-1 mt-1 bg-white/20" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progressToGoal))}%` }}
                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              />
            </div>

            <div className="relative">
              <input
                type="range"
                min="65"
                max="100"
                value={goalScore}
                onChange={(e) => setGoalScore(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between mt-3 px-1 text-[8px] font-black tracking-widest text-zinc-600 tabular-nums opacity-60">
                <span>65</span>
                <span>75</span>
                <span>85</span>
                <span>95</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Half: Protocols (55%) */}
      <div className="h-[55%] overflow-y-auto no-scrollbar px-6 pt-10 pb-40">
        <div className="max-w-lg mx-auto grid grid-cols-1 gap-10">
          {protocolData.map((group) => (
            <div key={group.category} className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <span className="material-symbols-outlined text-[16px]" style={{ color: group.color }}>{group.icon}</span>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">{group.category}</div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((item, i) => {
                  const isDone = completedProtocols.has(item);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleProtocol(item)}
                      className={`px-5 py-3.5 rounded-2xl text-[11px] font-bold border transition-all duration-300 flex items-center gap-3 ${isDone ? 'bg-white text-black border-white shadow-[0_10px_20px_rgba(255,255,255,0.1)]' : 'bg-white/[0.03] border-white/10 text-zinc-500 hover:border-white/20'}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-black' : 'bg-white/20'}`} style={{ backgroundColor: isDone ? undefined : group.color }} />
                      {item}
                      {isDone && <span className="material-symbols-outlined text-[14px] font-black">check</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={() => onViewDetailed({ protocolData, completedProtocols })}
            className="w-full py-6 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/60 hover:text-blue-400 transition-colors border-t border-white/5 mt-4"
          >
            View Detailed Analysis →
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-8 z-[100] bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="max-w-lg mx-auto">
          <button
            onClick={onAnalyze}
            className="w-full py-6 bg-blue-600 text-white font-black text-[13px] uppercase tracking-[0.3em] rounded-full shadow-[0_20px_40px_rgba(59,130,246,0.3)] border border-blue-400/20"
          >
            Finalize Plan & Book
          </button>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 8px solid #070708;
          cursor: pointer;
          box-shadow: 0 0 30px rgba(255,255,255,0.2);
          transition: transform 0.2s;
        }
        input[type='range']::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default GoalActionCombined;
