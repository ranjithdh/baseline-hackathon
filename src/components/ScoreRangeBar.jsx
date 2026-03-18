import React from 'react';
import { motion } from 'framer-motion';

const ScoreRangeBar = ({ score = 65, showLegend = true, maxWidth = "340px", className = "" }) => {
  const ranges = [
    { label: 'Compromised', color: '#ef4444', min: 0, max: 50, basis: '50%' },
    { label: 'Constrained', color: '#f59e0b', min: 50, max: 65, basis: '15%' },
    { label: 'Stable', color: '#10b981', min: 65, max: 75, basis: '10%' },
    { label: 'Robust', color: '#2b7fff', min: 75, max: 85, basis: '10%' },
    { label: 'Elite', color: '#06b6d4', min: 85, max: 101, basis: '15%' }
  ];

  return (
    <div className={`w-full max-w-[${maxWidth}] px-6 pointer-events-auto ${className}`}>
      <div className="relative pt-6 pb-2">
        {/* Score Indicator (Rounded Arrow ONLY) */}
        <motion.div
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: `${score}%`, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
          className="absolute -top-0 -translate-x-1/2 flex flex-col items-center z-20"
        >
          <span className="material-symbols-outlined text-white text-[28px] leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            arrow_drop_down
          </span>
        </motion.div>

        {/* Proportional Segments */}
        <div className="h-1.5 w-full flex gap-1 items-stretch">
          {ranges.map((range, idx) => (
            <div
              key={range.label}
              style={{ flexBasis: range.basis, backgroundColor: range.color }}
              className={`shadow-[0_0_10px_${range.color}33] ${idx === 0 ? 'rounded-l-full' : ''} ${idx === ranges.length - 1 ? 'rounded-r-full' : ''}`}
            />
          ))}
        </div>

        {/* Ticks & Thresholds */}
        <div className="relative mt-3 flex justify-between px-0 text-[8px] font-black text-zinc-600 tracking-tighter tabular-nums">
          <div className="absolute left-[50%] -translate-x-1/2">50</div>
          <div className="absolute left-[65%] -translate-x-1/2 text-white">65</div>
          <div className="absolute left-[75%] -translate-x-1/2">75</div>
          <div className="absolute left-[85%] -translate-x-1/2">85</div>
        </div>
      </div>

      {/* Classification Legend */}
      {showLegend && (
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {ranges.map((item, idx) => {
            const active = score >= item.min && score < item.max;
            return (
              <div key={idx} className={`flex items-center gap-1.5 transition-all duration-500 ${active ? 'scale-105' : 'opacity-80'}`}>
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: active ? `0 0 10px ${item.color}` : 'none'
                  }}
                />
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${active ? 'text-white' : 'text-zinc-400'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScoreRangeBar;
