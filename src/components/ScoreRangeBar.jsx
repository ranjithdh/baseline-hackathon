import React from 'react';
import { motion } from 'framer-motion';

const ScoreRangeBar = ({ score = 65, showLegend = true, maxWidth = "340px", className = "" }) => {
  const ranges = [
    { label: 'Compromised', color: 'rgb(var(--chart-2))', min: 0, max: 50, basis: '50%' },
    { label: 'Constrained', color: 'rgb(var(--chart-3))', min: 50, max: 65, basis: '15%' },
    { label: 'Stable', color: 'rgb(var(--chart-4))', min: 65, max: 75, basis: '10%' },
    { label: 'Robust', color: 'rgb(var(--chart-5))', min: 75, max: 85, basis: '10%' },
    { label: 'Elite', color: 'rgb(var(--chart-6))', min: 85, max: 101, basis: '15%' }
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
        <div className="relative mt-3 flex justify-between px-0 text-[10px] font-normal text-white/40 tracking-tighter tabular-nums">
          <div className="absolute left-[50%] -translate-x-1/2">50</div>
          <div className="absolute left-[65%] -translate-x-1/2">65</div>
          <div className="absolute left-[75%] -translate-x-1/2">75</div>
          <div className="absolute left-[85%] -translate-x-1/2">85</div>
        </div>
      </div>

      {/* Classification Legend */}
      {showLegend && (
        <div className="mt-8 flex flex-row flex-nowrap justify-between w-full px-1">
          {ranges.map((item, idx) => {
            const active = score >= item.min && score < item.max;
            // Convert to literal camelCase (e.g. "compromised")
            const camelCaseLabel = item.label.charAt(0).toUpperCase() + item.label.slice(1);
            return (
              <div key={idx} className="flex items-center gap-1 opacity-80">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: 'none'
                  }}
                />
                <span className="text-[10px] font-normal tracking-tight text-white/40 whitespace-nowrap">
                  {camelCaseLabel}
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
