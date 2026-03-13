import React, { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';



const BaselineScoreDeepDive = ({ onClose }) => {
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
      <div className="relative z-20 w-full flex flex-col items-center pt-24 h-full overflow-y-auto no-scrollbar pointer-events-none">

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
              <div className="basis-1/2 bg-[#ef4444]/20 rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#ef4444] opacity-20" />
              </div>
              {/* Constrained (50-65) */}
              <div className="basis-[15%] bg-[#f59e0b]/20">
                <div className="h-full w-full bg-[#f59e0b] opacity-40 shadow-[0_0_10px_#f59e0b44]" />
              </div>
              {/* Stable (65-75) */}
              <div className="basis-[10%] bg-[#10b981]">
                <div className="h-full w-full bg-[#10b981] shadow-[0_0_15px_#10b98188]" />
              </div>
              {/* Robust (75-85) */}
              <div className="basis-[10%] bg-[#2b7fff]/20">
                <div className="h-full w-full bg-[#2b7fff] opacity-30" />
              </div>
              {/* Elite (85-100) */}
              <div className="basis-[15%] bg-[#06b6d4]/20 rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#06b6d4] opacity-20" />
              </div>
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
              { label: 'Compromised', color: '#ef4444', active: false },
              { label: 'Constrained', color: '#f59e0b', active: false },
              { label: 'Stable', color: '#10b981', active: true },
              { label: 'Robust', color: '#2b7fff', active: false },
              { label: 'Elite', color: '#06b6d4', active: false }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-1.5 transition-all duration-500 ${item.active ? 'opacity-100 scale-105' : 'opacity-30'}`}>
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: item.active ? `0 0 10px ${item.color}` : 'none'
                  }}
                />
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${item.active ? 'text-white' : 'text-zinc-500'}`}>
                  {item.label}
                </span>
              </div>
            ))}
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




        <div className="mt-12 h-24" />{/* Bottom Spacer */}
      </div>



      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

export default BaselineScoreDeepDive;
