import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const OdysseyItem = ({ item, color, isDone, onToggle }) => (
  <motion.button
    whileHover={{ x: 5 }}
    onClick={onToggle}
    className={`w-full flex items-center justify-between p-6 rounded-[32px] border transition-all duration-500 ${isDone ? 'bg-white/10 border-white/20' : 'bg-white/[0.03] border-white/5'}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentcolor]`} style={{ backgroundColor: color }} />
      <span className={`text-[13px] font-bold ${isDone ? 'text-white' : 'text-zinc-500'}`}>{item}</span>
    </div>
    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isDone ? 'bg-white text-[#070708] border-white' : 'border-zinc-800 text-transparent'}`}>
      <span className="material-symbols-outlined text-[18px] font-black">check</span>
    </div>
  </motion.button>
);

const GoalActionOdyssey = ({ onBack, onAnalyze, currentScore, goalScore, setGoalScore, protocols, completedProtocols, toggleProtocol }) => {
  const containerRef = React.useRef(null);
  const { scrollY } = useScroll({ container: containerRef });
  
  const gaugeScale = useTransform(scrollY, [0, 200], [1, 0.6]);
  const gaugeOpacity = useTransform(scrollY, [0, 250], [1, 0.4]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

  return (
    <div className="flex flex-col h-full bg-[#070708] text-white font-sans">
      <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        
        {/* Immersive Header */}
        <div className="sticky top-0 z-50 pt-20 px-8 flex justify-center pointer-events-none">
            <motion.div 
                style={{ scale: gaugeScale, opacity: gaugeOpacity }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 px-10 py-6 rounded-[40px] flex flex-col items-center pointer-events-auto shadow-2xl"
            >
                <div className="text-6xl font-black tracking-tighter tabular-nums text-white leading-none">{currentScore}</div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Potency</span>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Target {goalScore}</span>
                </div>
            </motion.div>
        </div>

        <div className="px-6 pt-12 pb-40 space-y-12">
          {/* Goal Setting Section */}
          <section className="px-4">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6">Redefine Goal</div>
            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px]">
                <input
                    type="range"
                    min="65"
                    max="100"
                    value={goalScore}
                    onChange={(e) => setGoalScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
                />
            </div>
          </section>

          {/* Protocol Odyssey */}
          {protocols.map((group, idx) => (
            <section key={idx} className="space-y-4">
              <div className="px-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-xl" style={{ color: group.color }}>{group.icon}</span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">{group.category}</h3>
              </div>
              <div className="grid gap-3">
                {group.items.map((item, i) => (
                  <OdysseyItem 
                    key={i} 
                    item={item} 
                    color={group.color}
                    isDone={completedProtocols.has(item)}
                    onToggle={() => toggleProtocol(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="p-8 pb-10 bg-gradient-to-t from-black via-black/90 to-transparent fixed bottom-0 left-0 right-0">
        <button
          onClick={onAnalyze}
          className="w-full py-6 bg-blue-600 text-white font-black text-[13px] uppercase tracking-[0.3em] rounded-full shadow-2xl border border-blue-400/20"
        >
          Finalize Odyssey
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 4px solid #070708;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default GoalActionOdyssey;
