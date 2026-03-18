import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BentoTile = ({ children, title, icon, color, className = "" }) => (
  <div className={`bg-white/[0.03] border border-white/[0.05] rounded-[32px] p-6 backdrop-blur-md flex flex-col ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">
        <span className="material-symbols-outlined text-[18px]" style={{ color }}>{icon}</span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{title}</span>
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const GoalActionBento = ({ onBack, onAnalyze, currentScore, goalScore, setGoalScore, protocols, completedProtocols, toggleProtocol, status }) => {
  return (
    <div className="flex flex-col h-full bg-[#070708] text-white overflow-hidden font-sans pt-20">
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="grid grid-cols-2 gap-4 auto-rows-min">
          
          {/* Main Score Tile */}
          <BentoTile title="Potency Status" icon="analytics" color="#3b82f6" className="col-span-2 p-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-6xl font-black tracking-tighter tabular-nums mb-1">{currentScore}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Current Score</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white/20 tabular-nums">/{goalScore}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Target</div>
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
              <div className="flex justify-between mt-4">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Baseline: 65</span>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Elite: 100</span>
              </div>
            </div>
          </BentoTile>

          {/* Category Tiles */}
          {protocols.map((group, idx) => {
            const completedCount = group.items.filter(it => completedProtocols.has(it)).length;
            const progress = (completedCount / group.items.length) * 100;

            return (
              <BentoTile key={idx} title={group.category} icon={group.icon} color={group.color}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-black tabular-nums">{completedCount}<span className="text-white/20 text-sm ml-0.5">/{group.items.length}</span></div>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full"
                      style={{ backgroundColor: group.color }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {group.items.slice(0, 3).map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => toggleProtocol(item)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all ${completedProtocols.has(item) ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-zinc-500'}`}
                      >
                        {item}
                      </button>
                    ))}
                    {group.items.length > 3 && (
                      <div className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-white/5 border border-white/5 text-zinc-600">
                        +{group.items.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </BentoTile>
            );
          })}

          {/* Action Tile */}
          <div className="col-span-2 pt-8 pb-12">
            <button
              onClick={onAnalyze}
              className="w-full py-6 bg-white text-black font-black text-[13px] uppercase tracking-[0.3em] rounded-[32px] shadow-2xl"
            >
              Analyze & Book
            </button>
          </div>
        </div>
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
          box-shadow: 0 0 20px rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
};

export default GoalActionBento;
