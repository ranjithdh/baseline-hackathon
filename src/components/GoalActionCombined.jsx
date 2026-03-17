import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GoalActionCombined = ({ onBack, onAnalyze, onViewDetailed, isEmpty = false }) => {
  const [goalScore, setGoalScore] = useState(88);
  const [completedProtocols, setCompletedProtocols] = useState(new Set());

  const baseScore = 65;

  const protocolData = [
    {
      category: "Nutrition",
      icon: "restaurant",
      items: [
        { name: "Anti inflammatory", emoji: "🥦", points: 2 },
        { name: "Antioxidant", emoji: "🫐", points: 1 },
        { name: "Cruciferous", emoji: "🥗", points: 2 },
        { name: "Detox Support", emoji: "🍋", points: 1 },
        { name: "Good fat", emoji: "🥑", points: 2 }
      ],
      color: "#10b981"
    },
    {
      category: "Supplements",
      icon: "pill",
      items: [
        { name: "Vitamin D", emoji: "☀️", points: 2 },
        { name: "Vitamin B12", emoji: "🥩", points: 1 },
        { name: "Folate", emoji: "🥬", points: 1 },
        { name: "Magnesium", emoji: "🧂", points: 2 },
        { name: "Zinc", emoji: "🦪", points: 1 },
        { name: "Omega 3", emoji: "🐟", points: 2 },
        { name: "Berberine", emoji: "🌿", points: 2 },
        { name: "CoQ 10", emoji: "🔋", points: 2 }
      ],
      color: "#3b82f6"
    },
    {
      category: "Exercise",
      icon: "fitness_center",
      items: [
        { name: "Strength Training", emoji: "🏋️", points: 3 },
        { name: "Endurance", emoji: "🏃", points: 2 },
        { name: "HIIT", emoji: "⚡", points: 3 }
      ],
      color: "#f59e0b"
    },
    {
      category: "Lifestyle",
      icon: "nights_stay",
      items: [
        { name: "Sleep protocol", emoji: "😴", points: 3 },
        { name: "Improve REM sleep", emoji: "🧠", points: 2 },
        { name: "Improve Deep sleep", emoji: "💤", points: 2 }
      ],
      color: "#a855f7"
    }
  ];

  const currentLevel = useMemo(() => {
    return Math.min(100, baseScore + completedProtocols.size);
  }, [completedProtocols]);

  const status = useMemo(() => {
    if (goalScore < 50) return { label: 'Compromised', color: 'var(--rating-rank-2)' };
    if (goalScore < 65) return { label: 'Constrained', color: 'var(--rating-rank-3)' };
    if (goalScore < 75) return { label: 'Stable', color: 'var(--rating-rank-4)' };
    if (goalScore < 85) return { label: 'Robust', color: 'var(--rating-rank-5)' };
    return { label: 'Elite', color: 'var(--rating-rank-6)' };
  }, [goalScore]);

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
    <div className={`min-h-screen bg-[#070708] text-white flex flex-col font-sans relative pb-32 ${isEmpty ? 'items-center justify-center' : ''}`}>
      {isEmpty ? (
        <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-white/10">Action Plan</h3>
      ) : (
        <>
          <div className="h-[45%] relative px-10 flex flex-col border-b border-white/5 overflow-hidden pt-12 w-full">
            {/* Bio-Glow Background */}
            <div
              className="absolute inset-0 opacity-10 blur-[120px] pointer-events-none transition-colors duration-1000"
              style={{
                background: `radial-gradient(circle at center, rgb(${status.color}) 0%, transparent 70%)`
              }}
            />

            {/* Navigation */}
            <nav className="mb-12 flex justify-between items-center z-20">
              <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase hover:text-white transition-all group">
                <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
                Dashboard
              </button>
            </nav>

            <div className="relative z-10 w-full max-w-lg mx-auto flex-1 flex flex-col justify-center pb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentcolor] animate-pulse" style={{ backgroundColor: `rgb(${status.color})` }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: `rgb(${status.color})` }}>{status.label}</span>
                  </div>
                  <motion.div
                    key={goalScore}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-8xl font-black tracking-tighter tabular-nums leading-none"
                  >
                    {goalScore}
                  </motion.div>
                </div>
              </div>

              <div className="space-y-4">

                <div className="relative">
                  <div className="mb-4">
                    <span className="text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-50">Adjust Target Score</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goalScore}
                    onChange={(e) => setGoalScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between mt-4 px-1 text-[8px] font-black tracking-widest text-zinc-600 tabular-nums opacity-60">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: Protocols (55%) */}
          <div className="h-[55%] overflow-y-auto no-scrollbar px-6 pt-10 pb-40 w-full">
            <div className="max-w-lg mx-auto grid grid-cols-1 gap-10">
              {protocolData.map((group) => (
                <div key={group.category} className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: group.color }}>{group.icon}</span>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">{group.category}</div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {group.items.map((item, i) => {
                      const isDone = completedProtocols.has(item.name);
                      return (
                        <button
                          key={i}
                          onClick={() => toggleProtocol(item.name)}
                          className={`group relative px-5 py-3 rounded-full text-[11px] font-bold border transition-all duration-300 flex items-center gap-2.5 
                            ${isDone 
                              ? 'bg-zinc-100 text-black border-white shadow-[0_8px_30px_rgba(255,255,255,0.08)]' 
                              : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:bg-white/[0.06] hover:border-white/20 hover:text-white'
                            }`}
                        >
                          <span className={`text-[15px] transition-transform duration-300 ${isDone ? 'scale-110' : 'group-hover:scale-110'}`}>{item.emoji}</span>
                          <span className="tracking-tight">{item.name}</span>
                          {isDone && (
                            <motion.span 
                              initial={{ scale: 0, opacity: 0 }} 
                              animate={{ scale: 1, opacity: 1 }}
                              className="material-symbols-outlined text-[14px] font-black ml-1 text-black/60"
                            >
                              check_circle
                            </motion.span>
                          )}
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
        </>
      )}

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
