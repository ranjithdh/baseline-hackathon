import React, { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const biomarkers = [
  "Cortisol", "Insulin", "Glucose", "HDL", "LDL", "Ferritin", 
  "TSH", "Vitamin D", "Magnesium", "Estradiol", "Testosterone",
  "hs-CRP", "HbA1c", "Omega-3", "ApoB", "IGF-1"
];

const BiomarkerSphere = ({ name, delay = 0 }) => {
  // Random starting position and animation variants
  const initialX = Math.random() * 80 + 10; // 10% to 90%
  const initialY = Math.random() * 80 + 10; 
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.2, 0.6, 0.2],
        scale: [0.8, 1.1, 0.8],
        x: [0, Math.random() * 20 - 10, 0],
        y: [0, Math.random() * 20 - 10, 0],
      }}
      transition={{ 
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      className="absolute flex flex-col items-center pointer-events-none"
      style={{ left: `${initialX}%`, top: `${initialY}%` }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 blur-[2px] mb-2" />
      <span className="text-[7px] font-black uppercase tracking-[0.3em] text-amber-500/40 whitespace-nowrap">
        {name}
      </span>
    </motion.div>
  );
};

const BaselineScoreDeepDive = ({ onClose }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const moveX = useTransform(springX, [0, window.innerWidth], [-20, 20]);
  const moveY = useTransform(springY, [0, window.innerHeight], [-20, 20]);

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
      className="fixed inset-0 z-[1000] bg-[#0A0B0D] overflow-hidden flex flex-col items-center justify-center p-8"
    >
      {/* Background Liquid Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Parallax Layer: Floating Markers */}
      <motion.div 
        style={{ x: moveX, y: moveY }}
        className="absolute inset-0 z-10"
      >
        {biomarkers.map((name, i) => (
          <BiomarkerSphere key={name} name={name} delay={i * 0.5} />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-[400px] flex flex-col items-center text-center">
        
        {/* The Core Synthesis Visual */}
        <div className="relative w-48 h-48 mb-12">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-amber-500/20 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border border-amber-500/10 rounded-[40%]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full blur-[30px] opacity-40 animate-pulse" />
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10" />
            </div>
            
            {/* Orbiting Orbs */}
            {[0, 120, 240].map((angle, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                  style={{ 
                    top: '50%',
                    left: '100%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </motion.div>
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-white text-3xl font-black tracking-[-0.05em] uppercase mb-4 leading-none">
            Harmonic<br />Synthesis
          </h2>
          <p className="text-amber-500/60 text-[9px] font-black uppercase tracking-[0.4em] mb-8">
            The Biological Resonance Index
          </p>
          
          <div className="space-y-6 px-10">
            <p className="text-[#98989E] text-[13px] leading-relaxed font-medium">
              Your <span className="text-white">Baseline Score</span> is not just a number. It is the poetic intersection of your body's hidden rhythms.
            </p>
            <p className="text-[#98989E] text-[13px] leading-relaxed font-medium">
              We capture the subtle vibrations of over <span className="text-amber-400">100+ biomarkers</span>, distilling complex biological noise into a single, elegant frequency.
            </p>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onClose}
          className="mt-16 group relative flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-500 transition-all mb-4">
            <span className="material-symbols-outlined text-white text-xl group-hover:text-amber-500 transition-colors">close</span>
          </div>
          <span className="text-white/30 text-[8px] font-black uppercase tracking-[0.5em] group-hover:text-white transition-colors">
            Exit Experience
          </span>
        </motion.button>
      </div>

      {/* Decorative Corners */}
      <div className="fixed top-12 left-12 w-8 h-[1px] bg-white/10" />
      <div className="fixed top-12 left-12 h-8 w-[1px] bg-white/10" />
      <div className="fixed bottom-12 right-12 w-8 h-[1px] bg-white/10" />
      <div className="fixed bottom-12 right-12 h-8 w-[1px] bg-white/10" />
      
      <div className="fixed bottom-12 left-12 flex gap-4">
        <div className="flex flex-col">
            <span className="text-white/20 text-[6px] font-black uppercase tracking-widest mb-1">Status</span>
            <span className="text-amber-500/80 text-[8px] font-black uppercase tracking-widest">Simulating...</span>
        </div>
        <div className="w-[1px] h-6 bg-white/10" />
        <div className="flex flex-col">
            <span className="text-white/20 text-[6px] font-black uppercase tracking-widest mb-1">Depth</span>
            <span className="text-white text-[8px] font-black uppercase tracking-widest">Layer 04</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BaselineScoreDeepDive;
