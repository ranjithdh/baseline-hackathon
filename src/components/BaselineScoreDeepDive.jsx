import React, { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const cloudBiomarkers = [
  { name: "HbA1c", value: "5.4%", status: "optimal", size: 60, z: 0 },
  { name: "Insulin", value: "7.6", status: "optimal", size: 55, z: 1 },
  { name: "Vit D", value: "19.7", status: "low", size: 65, z: 2 },
  { name: "Body Fat", value: "33.7%", status: "high", size: 70, z: 0 },
  { name: "TSH", value: "5.0", status: "high", size: 58, z: 1 },
  { name: "VO2 Max", value: "41.0", status: "good", size: 62, z: 2 },
  { name: "Cortisol", value: "12.4", status: "stable", size: 50, z: 0 },
  { name: "hs-CRP", value: "0.8", status: "optimal", size: 55, z: 1 },
  { name: "ApoB", value: "85", status: "stable", size: 60, z: 2 },
  { name: "HDL", value: "52", status: "good", size: 52, z: 0 },
  { name: "LDL", value: "110", status: "stable", size: 58, z: 1 },
  { name: "Glucose", value: "88", status: "optimal", size: 54, z: 2 },
  { name: "Ferritin", value: "95", status: "good", size: 56, z: 0 },
  { name: "Magnesium", value: "2.1", status: "stable", size: 48, z: 1 },
  { name: "Omega-3", value: "6.2%", status: "good", size: 60, z: 2 },
  { name: "Estradiol", value: "45", status: "stable", size: 50, z: 0 },
  { name: "ALT", value: "22", status: "optimal", size: 45, z: 1 },
  { name: "AST", value: "18", status: "optimal", size: 45, z: 2 },
  { name: "Creatinine", value: "0.9", status: "optimal", size: 48, z: 0 },
  { name: "Testo", value: "550", status: "stable", size: 54, z: 1 },
  { name: "Iron", value: "110", status: "good", size: 50, z: 2 },
];

const streamBiomarkers = [
  "A1C", "ALT", "AST", "ApoB", "B12", "C-Peptide", "Calcium", "Chloride", "Cortisol",
  "Creatinine", "DHEA-S", "Estradiol", "Ferritin", "Folate", "Glucose", "HDL", "LDL",
  "hs-CRP", "IGF-1", "Insulin", "Iron", "Magnesium", "Omega-3", "Omega-6", "Potassium",
  "Progesterone", "PSA", "SHBG", "Sodium", "Testosterone", "TSH", "Free T3", "Free T4",
  "Vitamin A", "Vitamin B6", "Vitamin C", "Vitamin D", "Vitamin E", "Zinc", "Uric Acid",
  "Homocysteine", "ApoA1", "Lp(a)", "GGT", "BUN", "Albumin", "Globulin", "Hct", "Hgb", "MCV"
];

const BiomarkerBubble = ({ data, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const angle = (index / cloudBiomarkers.length) * Math.PI * 2;
  const radius = 100 + Math.random() * 90;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const isAlert = data.status === 'low' || data.status === 'high';
  const blur = data.z * 1.5;
  const opacity = 1 - (data.z * 0.2);

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: [x, x + Math.random() * 12 - 6, x],
        y: [y, y + Math.random() * 12 - 6, y],
        opacity: opacity,
        scale: 1,
        filter: isHovered ? 'blur(0px)' : `blur(${blur}px)`
      }}
      transition={{
        delay: index * 0.04,
        x: { duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.15, opacity: 1, zIndex: 100 }}
      className={`absolute rounded-full flex flex-col items-center justify-center cursor-pointer border transition-all duration-500`}
      style={{
        width: data.size, height: data.size,
        left: '50%', top: '50%',
        marginLeft: -data.size / 2, marginTop: -data.size / 2,
        background: isAlert
          ? 'linear-gradient(135deg, rgba(255,244,237,0.8), rgba(255,244,237,0.4))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
        borderColor: isAlert ? 'rgba(230,126,34,0.3)' : 'rgba(255,255,255,0.8)',
        backdropBlur: '12px',
        boxShadow: isAlert
          ? '0 8px 32px rgba(230,126,34,0.1), inset 0 0 10px rgba(255,255,255,0.5)'
          : '0 8px 32px rgba(0,0,0,0.03), inset 0 0 10px rgba(255,255,255,0.8)'
      }}
    >
      <span className="text-[7px] font-black uppercase tracking-tighter text-slate-400 mb-0.5 font-['Inter']">{data.name}</span>
      <span className={`text-[10px] font-black font-['Outfit'] ${isAlert ? 'text-[#E67E22]' : 'text-slate-900'}`}>{data.value}</span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.15, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className="absolute h-[1px] bg-orange-500 origin-right transition-all"
            style={{ width: radius + 20, right: '50%', rotate: (angle * 180 / Math.PI) + 180, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>
      <div className={`absolute -bottom-1 w-2 h-2 rounded-full border-2 border-white shadow-sm ${isAlert ? 'bg-orange-500' : 'bg-emerald-400'}`} />
    </motion.div>
  );
};

const BiomarkerStrip = () => {
  const doubleStream = [...streamBiomarkers, ...streamBiomarkers];
  return (
    <div className="w-full relative py-8 overflow-hidden pointer-events-auto">
      {/* Edge Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FDFCFB] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FDFCFB] to-transparent z-10" />

      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-4 whitespace-nowrap"
      >
        {doubleStream.map((name, i) => (
          <div
            key={i}
            className="px-4 py-2 bg-white/60 border border-white rounded-xl shadow-sm flex flex-col items-center min-w-[100px]"
          >
            <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest mb-1">{name}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/30 flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-emerald-500 rounded-full" />
              </div>
              <span className="text-[10px] font-black text-slate-800 font-['Space_Mono']">
                {(Math.random() * 100 + 10).toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="flex justify-center mt-6">
        <span className="text-slate-300 text-[8px] font-black uppercase tracking-[0.4em] opacity-40">100+ Systems Biomarkers Interaction Layer</span>
      </div>
    </div>
  );
};

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
      className="fixed inset-0 z-[1000] bg-[#FDFCFB] overflow-hidden flex flex-col items-center"
    >
      {/* Parallax Cloud Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#E2E8F0 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-amber-100/10 rounded-full blur-[160px]" />
      </div>

      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-200/30 z-0 pointer-events-none" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200/30 z-0 pointer-events-none" />

      {/* The Cloud Container */}
      <motion.div
        style={{ x: moveX, y: moveY, top: '35%' }}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <div className="absolute w-[240px] h-[240px] rounded-full border border-orange-500/10 shadow-[inset_0_0_80px_rgba(230,126,34,0.03)]" />
        {cloudBiomarkers.map((data, i) => (
          <BiomarkerBubble key={data.name} data={data} index={i} />
        ))}
      </motion.div>

      {/* Main Content Area (Scrollable) */}
      <div className="relative z-20 w-full flex flex-col items-center pt-24 h-full overflow-y-auto no-scrollbar pointer-events-none">

        {/* Glass Score Core */}
        <div className="relative w-44 h-44 flex items-center justify-center pointer-events-auto flex-shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-orange-500/10 rounded-[38%] opacity-50"
          />
          <div className="relative z-10 flex flex-col items-center bg-white/60 backdrop-blur-2xl w-[140px] h-[140px] rounded-full border border-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex items-center justify-center">
            <span className="text-slate-900 text-7xl font-black font-['Outfit'] tracking-tighter leading-none">65</span>
          </div>
          <div className="absolute inset-0 bg-orange-400 rounded-full blur-[50px] opacity-10 animate-pulse pointer-events-none" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] border-t-2 border-orange-500/20 rounded-full pointer-events-none"
          />
        </div>

        <div className="mt-20 max-w-[340px] px-6 text-center pointer-events-auto">
          <h2 className="text-[#1A1A1B] text-2xl font-black tracking-[-0.04em] uppercase mb-2 leading-tight font-['Outfit']">
            Baseline<br />Score
          </h2>
          <div className="space-y-4">
            <p className="text-[#4A4A4A] text-[13px] leading-relaxed font-semibold font-['Inter']">
              The <span className="text-[#E67E22]">Baseline Score</span> is Deep Holistics’ proprietary health score, developed through clinical research, systems-based analysis, and years of preventive health insight.
            </p>
            <p className="text-[#64748B] text-[12px] leading-relaxed font-medium font-['Inter']">
              Instead of looking at individual markers in isolation, it brings together data across key body systems to reflect how your body is actually functioning today.
            </p>
            <p className="text-[#64748B] text-[12px] leading-relaxed font-medium font-['Inter']">
              This allows you to move beyond “normal” ranges and focus on what needs attention now.
            </p>
          </div>
        </div>

        {/* New Creative Biomarker Stream Section */}
        <div className="w-full mt-12 mb-12">
          <BiomarkerStrip />
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onClose}
          className="mt-4 mb-24 group relative flex flex-col items-center pointer-events-auto"
        >
          <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-orange-500 transition-all mb-3 text-slate-400 bg-white/80 backdrop-blur-sm shadow-md">
            <span className="material-symbols-outlined text-xl group-hover:text-orange-500 transition-colors">close</span>
          </div>
          <span className="text-slate-400 text-[7px] font-black uppercase tracking-[0.5em] group-hover:text-slate-600 transition-colors">
            Exit Experience
          </span>
        </motion.button>
      </div>

      {/* Decorative Branding */}
      <div className="fixed top-12 left-12 flex items-center gap-2 pointer-events-none z-50">
        <div className="w-5 h-5 rounded-xs border border-orange-500/20 flex items-center justify-center rotate-45">
          <div className="w-2 h-2 bg-orange-500/80 rounded-full" />
        </div>
        <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.6em] font-['Space_Mono']">Baseline Labs / Deep Dive</span>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

export default BaselineScoreDeepDive;
