import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplitReactive = ({ onBack, onAnalyze, currentScore, goalScore, setGoalScore, protocols, completedProtocols, toggleProtocol, status }) => {
  const gap = goalScore - currentScore;
  const progressToGoal = ((currentScore - 65) / (goalScore - 65)) * 100;

  return (
    <div className="flex flex-col h-full bg-[#070708] text-white font-sans pt-12">
      
      {/* Top Half: Performance Control */}
      <div className="h-[45%] relative px-10 flex flex-col justify-center border-b border-white/5 overflow-hidden">
        {/* Dynamic Bio-Glow */}
        <div 
          className="absolute inset-0 opacity-10 blur-[100px] pointer-events-none transition-colors duration-1000"
          style={{ 
            background: `radial-gradient(circle at center, ${status.color} 0%, transparent 70%)` 
          }} 
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
              <div>
                  <div className="flex items-center gap-3 mb-1">
                      <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentcolor] animate-pulse" style={{ backgroundColor: status.color }} />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: status.color }}>{status.label}</span>
                  </div>
                  <motion.div 
                      key={currentScore}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-9xl font-black tracking-tighter tabular-nums leading-none"
                  >
                      {currentScore}
                  </motion.div>
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mt-2">Live Potency Readout</div>
              </div>
              
              <div className="text-right">
                  <div className="text-3xl font-black text-white/20 tabular-nums">+{currentScore - 65}</div>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">Score Delta</div>
                  
                  <div className="mt-8 flex flex-col items-end">
                      <span className="text-[20px] font-black text-white tabular-nums">{goalScore}</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Target</span>
                  </div>
              </div>
          </div>
          
          <div className="space-y-6">
              <div className="flex justify-between items-end">
                  <div className="flex-1 mr-8">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-3">
                          <span>Convergence Meter</span>
                          <span className={gap <= 0 ? 'text-emerald-400' : 'text-blue-400'}>
                              {gap <= 0 ? 'GOAL REACHED' : `${gap} PTS REMAINING`}
                          </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, Math.max(0, progressToGoal))}%` }}
                              className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                          />
                      </div>
                  </div>
              </div>

              <div className="mt-8">
                <input
                    type="range"
                    min="65"
                    max="100"
                    value={goalScore}
                    onChange={(e) => setGoalScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
                />
              </div>
          </div>
        </div>
      </div>

      {/* Bottom Half: Rapid Access Protocols */}
      <div className="h-[55%] overflow-y-auto no-scrollbar px-6 pt-10 pb-40">
        <div className="grid grid-cols-1 gap-8">
            {protocols.map((group) => (
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
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 z-[100] bg-gradient-to-t from-black via-black/95 to-transparent">
        <button
          onClick={onAnalyze}
          className="w-full py-6 bg-blue-600 text-white font-black text-[13px] uppercase tracking-[0.3em] rounded-full shadow-[0_20px_40px_rgba(59,130,246,0.3)] border border-blue-400/20"
        >
          Finalize Performance
        </button>
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

export default SplitReactive;
