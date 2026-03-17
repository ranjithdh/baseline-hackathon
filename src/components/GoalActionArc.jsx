import React from 'react';
import { motion } from 'framer-motion';

const GoalActionArc = ({ onBack, onAnalyze, currentScore, goalScore, setGoalScore, protocols, completedProtocols, toggleProtocol, status }) => {
  const rotation = ((goalScore - 65) / (100 - 65)) * 180 - 90;
  const currentRotation = ((currentScore - 65) / (100 - 65)) * 180 - 90;

  return (
    <div className="flex flex-col h-full bg-[#030406] text-white font-sans overflow-hidden">
      
      {/* Top Section: Radial Telemetry */}
      <div className="relative h-[55%] flex flex-col items-center justify-end pb-12 pt-16">
        {/* Glow Background */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 blur-[120px] pointer-events-none transition-colors duration-1000"
          style={{ 
            background: `radial-gradient(circle at center, ${status.color} 0%, transparent 70%)` 
          }} 
        />

        {/* The Arc */}
        <div className="relative w-80 h-40 border-t-2 border-l-2 border-r-2 border-white/5 rounded-t-full overflow-hidden">
            <div className="absolute inset-0 border-t-2 border-white/10 rounded-t-full" />
            
            {/* Target Indicator */}
            <motion.div 
                animate={{ rotate: rotation }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute bottom-0 left-1/2 w-1 h-32 bg-blue-500 origin-bottom shadow-[0_0_20px_#3b82f6]"
                style={{ translateX: "-50%" }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
                    <span className="text-[10px] font-black tabular-nums bg-blue-500 px-2 py-0.5 rounded text-white">{goalScore}</span>
                </div>
            </motion.div>

            {/* Current Indicator */}
            <motion.div 
                animate={{ rotate: currentRotation }}
                className="absolute bottom-0 left-1/2 w-0.5 h-28 bg-white/40 origin-bottom"
                style={{ translateX: "-50%" }}
            />
        </div>

        {/* Digital Readout */}
        <div className="absolute bottom-20 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: status.color }} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: status.color }}>{status.label}</span>
            </div>
            <motion.div 
                key={currentScore}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-black tracking-tighter tabular-nums leading-none"
            >
                {currentScore}
            </motion.div>
            <div className="text-[9px] font-black uppercase tracking-[0.6em] text-zinc-500 mt-4">Bio-Intensity Level</div>
        </div>

        {/* Goal Slider Overlay */}
        <div className="absolute bottom-4 w-64">
            <input
                type="range"
                min="65"
                max="100"
                value={goalScore}
                onChange={(e) => setGoalScore(parseInt(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
            />
        </div>
      </div>

      {/* Bottom Section: Radial Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-10 pb-40">
        <div className="grid grid-cols-1 gap-10">
            {protocols.map((group) => (
                <div key={group.category} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[14px]" style={{ color: group.color }}>{group.icon}</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">{group.category}</span>
                        </div>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{group.items.length} Nodes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {group.items.map((item, i) => {
                            const isDone = completedProtocols.has(item);
                            return (
                                <button
                                    key={i}
                                    onClick={() => toggleProtocol(item)}
                                    className={`relative group p-4 rounded-xl text-left transition-all duration-300 border ${isDone ? 'bg-white text-black border-white' : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10'}`}
                                >
                                    <div className="text-[10px] font-bold leading-tight mb-2 pr-4">{item}</div>
                                    <div className="flex justify-between items-center">
                                        <div className={`text-[8px] font-black uppercase tracking-widest ${isDone ? 'text-black/40' : 'text-zinc-600'}`}>Status</div>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-black' : 'bg-white/10'}`} style={{ backgroundColor: isDone ? undefined : group.color }} />
                                    </div>
                                    {isDone && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2 text-black"
                                        >
                                            <span className="material-symbols-outlined text-[14px] font-black">done_all</span>
                                        </motion.div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-8 z-[200] bg-gradient-to-t from-black via-black/90 to-transparent">
        <button
          onClick={onAnalyze}
          className="w-full py-6 bg-white text-black font-black text-[12px] uppercase tracking-[0.4em] rounded-sm shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-zinc-200 transition-colors"
        >
          Initialize Convergence
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 4px solid #030406;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
};

export default GoalActionArc;
