import React from 'react';
import { motion } from 'framer-motion';

const GoalActionMatrix = ({ onBack, onAnalyze, currentScore, goalScore, setGoalScore, protocols, completedProtocols, toggleProtocol, status }) => {
  const binary = Array.from({ length: 40 }, () => Math.round(Math.random())).join('');

  return (
    <div className="flex flex-col h-full bg-[#050505] text-[#a0a0a0] font-mono p-6 pt-16">
      
      {/* Matrix Header */}
      <div className="border border-white/10 p-6 mb-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 text-[8px] opacity-20 text-blue-500 overflow-hidden h-4 whitespace-nowrap">
            {binary}{binary}{binary}
        </div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
                <div className="text-[10px] text-blue-500 mb-1 flex items-center gap-2">
                    <span className="animate-pulse">●</span> BIO_TELEMETRY_LIVE
                </div>
                <div className="text-7xl font-light text-white tracking-widest leading-none">
                    {currentScore}<span className="text-xl text-white/20">.0</span>
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] mt-2 opacity-40">Potency Vector Analysis</div>
            </div>
            <div className="text-right">
                <div className="text-[10px] mb-1 opacity-40">TARGET_INTENSITY</div>
                <div className="text-3xl text-blue-400 font-light">{goalScore}</div>
                <div className="mt-4 flex flex-col items-end">
                    <div className="text-[9px] opacity-30 leading-none mb-1">DELTA</div>
                    <div className="text-xl text-emerald-500/80 font-light">+{currentScore - 65}</div>
                </div>
            </div>
        </div>

        {/* Matrix Command Slider */}
        <div className="space-y-4">
            <div className="flex justify-between text-[8px] tracking-[0.2em]">
                <span>SCALE_MIN_65</span>
                <span>CMD_INPUT_REACTIVE</span>
                <span>SCALE_MAX_100</span>
            </div>
            <input
                type="range"
                min="65"
                max="100"
                value={goalScore}
                onChange={(e) => setGoalScore(parseInt(e.target.value))}
                className="w-full h-[1px] bg-white/10 appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[8px] opacity-20">
                <span>[ | | | | | | | | | | ]</span>
                <span>[ | | | | | | | | | | ]</span>
                <span>[ | | | | | | | | | | ]</span>
            </div>
        </div>
      </div>

      {/* Protocol Matrix Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="grid grid-cols-1 gap-6">
            {protocols.map((group) => (
                <div key={group.category} className="space-y-2">
                    <div className="text-[9px] text-zinc-600 flex items-center gap-4">
                        <span className="text-white/10">////////////////</span>
                        <span className="tracking-[0.5em]">{group.category}</span>
                        <span className="flex-1 h-[1px] bg-white/5"></span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-[2px] bg-white/5 border border-white/5">
                        {group.items.map((item, i) => {
                            const isDone = completedProtocols.has(item);
                            return (
                                <button
                                    key={i}
                                    onClick={() => toggleProtocol(item)}
                                    className={`relative px-4 py-3 flex items-center justify-between text-[11px] transition-all duration-100 ${isDone ? 'bg-white/[0.07] text-white' : 'bg-[#080808] hover:bg-white/[0.03]'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[9px] ${isDone ? 'text-blue-500' : 'opacity-20'}`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="uppercase tracking-widest">{item}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`text-[8px] tracking-tighter ${isDone ? 'text-emerald-500' : 'opacity-10'}`}>
                                            {isDone ? 'ACTIVE_SYNC' : 'NODE_IDLE'}
                                        </div>
                                        <div className={`w-1 h-3 ${isDone ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/5'}`} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Matrix Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-8 z-[200] bg-black/80 backdrop-blur-md border-t border-white/5">
        <button
          onClick={onAnalyze}
          className="w-full py-5 border border-blue-500/50 hover:bg-blue-500/10 text-blue-400 text-[10px] font-mono uppercase tracking-[0.8em] transition-all"
        >
          [ EXECUTE_CONVERGENCE_INIT ]
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 8px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 0;
          box-shadow: 0 0 10px rgba(59,130,246,0.5);
        }
      `}</style>
    </div>
  );
};

export default GoalActionMatrix;
