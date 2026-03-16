import React, { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';



const BaselineScoreDeepDive = ({ onClose, onSetGoal }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 40, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const moveX = useTransform(springX, [0, window.innerWidth], [-25, 25]);
  const moveY = useTransform(springY, [0, window.innerHeight], [-25, 25]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] overflow-hidden flex flex-col items-center"
      style={{ backgroundColor: 'rgb(var(--zinc-950))' }}
    >
      {/* Close Button - Top Right Fixed */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-[1100] w-12 h-12 rounded-full border border-border flex items-center justify-center bg-card/80 backdrop-blur-md shadow-lg hover:border-primary transition-all group pointer-events-auto"
      >
        <span className="material-symbols-outlined text-xl text-muted-foreground group-hover:text-primary transition-colors">close</span>
      </button>
      {/* Parallax Cloud Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--border) 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border/20 z-0 pointer-events-none" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-border/20 z-0 pointer-events-none" />



      {/* Main Content Area (Scrollable) */}
      <div className="relative z-20 w-full flex flex-col items-center pt-24 pb-[200px] h-full overflow-y-auto no-scrollbar">

        {/* Title Heading */}
        <div className="max-w-[340px] px-6 text-center pointer-events-auto mb-10">
          <h2 className="text-foreground text-2xl font-black tracking-[-0.04em] normalcase leading-tight font-heading">
            Baseline Score
          </h2>
        </div>

        {/* Glass Score Core */}
        <div className="relative w-44 h-44 flex items-center justify-center pointer-events-auto flex-shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-[#4c93ff]/20 rounded-[38%] opacity-50"
          />
          <div className="relative z-10 flex flex-col items-center bg-card/80 backdrop-blur-2xl w-[140px] h-[140px] rounded-full border border-[#4c93ff]/30 shadow-2xl flex items-center justify-center">
            <span className="text-foreground text-7xl font-black font-heading tracking-tighter leading-none">65</span>
          </div>
          <motion.div
            animate={{
              opacity: [0.08, 0.18, 0.08],
              scale: [0.98, 1.05, 0.98]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-[#4c93ff] rounded-full blur-[70px] pointer-events-none"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] border-t-2 border-[#4c93ff]/40 rounded-full pointer-events-none"
          />
        </div>

        {/* Potential Score Indicator - Refined */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pointer-events-auto flex items-center gap-3 bg-white/5 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-blue-400 font-variation-icon-bold">trending_up</span>
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] font-heading">Potential</span>
          </div>
          <div className="w-[1px] h-3 bg-white/20" />
          <span className="text-white text-[12px] font-black font-heading tracking-tight">80</span>
        </motion.div>
        {/* BIOMETRIC HORIZON (Score Range) */}
        <div className="mt-16 w-full max-w-[340px] px-6 pointer-events-auto">
          <div className="relative pt-6 pb-2">
            {/* Score Indicator (Vertical Line Only) */}
            <motion.div
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: "65%", opacity: 1 }}
              transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
              className="absolute -top-1 -translate-x-1/2 flex flex-col items-center z-10"
            >
              <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
            </motion.div>

            {/* Proportional Segments */}
            <div className="h-1.5 w-full flex gap-1 items-stretch">
              {/* Compromised (0-50) */}
              <div className="basis-1/2 bg-[#ef4444] rounded-l-full shadow-[0_0_10px_#ef444433]" />
              {/* Constrained (50-65) */}
              <div className="basis-[15%] bg-[#f59e0b] shadow-[0_0_10px_#f59e0b44]" />
              {/* Stable (65-75) */}
              <div className="basis-[10%] bg-[#10b981] shadow-[0_0_15px_#10b98188]" />
              {/* Robust (75-85) */}
              <div className="basis-[10%] bg-[#2b7fff] shadow-[0_0_10px_#2b7fff44]" />
              {/* Elite (85-100) */}
              <div className="basis-[15%] bg-[#06b6d4] rounded-r-full shadow-[0_0_10px_#06b6d433]" />
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
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {[
              { label: 'Compromised', color: '#ef4444', min: 0, max: 50 },
              { label: 'Constrained', color: '#f59e0b', min: 50, max: 65 },
              { label: 'Stable', color: '#10b981', min: 65, max: 75 },
              { label: 'Robust', color: '#2b7fff', min: 75, max: 85 },
              { label: 'Elite', color: '#06b6d4', min: 85, max: 101 }
            ].map((item, idx) => {
              const active = 65 >= item.min && 65 < item.max;
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
        </div>

        {/* Description Section */}
        <div className="mt-20 max-w-[340px] px-6 text-center pointer-events-auto">
          <div className="space-y-4">
            <p className="text-foreground opacity-90 text-[13px] leading-relaxed font-semibold font-main">
              The <span className="text-primary font-bold">Baseline Score</span> is Deep Holistics’ proprietary health score, developed through clinical research, systems-based analysis, and years of preventive health insight.
            </p>
            <p className="text-muted-foreground text-[12px] leading-relaxed font-medium font-main">
              Instead of looking at individual markers in isolation, it brings together data across key body systems to reflect how your body is actually functioning today.
            </p>
            <p className="text-muted-foreground text-[12px] leading-relaxed font-medium font-main">
              This allows you to move beyond “normal” ranges and focus on what needs attention now.
            </p>
          </div>
        </div>

      </div>

      {/* Floating Set Your Goal CTA - Join Style */}
      <div className="fixed bottom-10 left-0 right-0 z-[1050] flex justify-center px-6 pointer-events-none">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSetGoal}
          className="bg-white text-[#0A0F29] text-[11px] font-black uppercase tracking-[0.3em] px-12 py-[18px] rounded-full hover:bg-blue-50 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] pointer-events-auto font-heading border border-white/20"
        >
          Set Your Goal
        </motion.button>
      </div>



      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

export default BaselineScoreDeepDive;
