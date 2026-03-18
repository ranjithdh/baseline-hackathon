import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';


const BaselineScoreInfoOverlay = ({ isOpen, onClose }) => {
  const overlayContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[2001] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[480px] bg-[#0A0A0A] rounded-[40px] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] pointer-events-auto"
            >
              {/* Header with Theme Gradient */}
              <div className="relative h-56 flex flex-col items-center justify-center overflow-hidden">
                {/* Smooth Gradient Layer (Brand Theme) */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom right, #1e40af 0%, #3b82f6 45%, #0f172a 100%)'
                  }}
                />

                {/* Subtle top reflection */}
                <div className="absolute top-0 inset-x-0 h-px bg-white/10" />
                
                <h2 className="relative z-10 text-white text-3xl font-bold font-heading tracking-tight text-center px-12 leading-[1.3] mt-2">
                  What is<br />Baseline Score
                </h2>

                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-8 right-8 w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-all group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Content Body */}
              <div className="p-12 pt-10 space-y-8">
                <div className="space-y-6">
                  <p className="text-[#F1F1F1] text-[17px] leading-relaxed font-main font-semibold">
                    The <span className="text-white">Baseline Score</span> is Deep Holistics’ proprietary health score, developed through clinical research, systems-based analysis, and years of preventive health insight.
                  </p>
                  <p className="text-[#A1A1A1] text-[16px] leading-relaxed font-main font-medium">
                    Instead of looking at individual markers in isolation, it brings together data across key body systems to reflect how your body is actually functioning today.
                  </p>
                  <p className="text-[#A1A1A1] text-[16px] leading-relaxed font-main font-medium">
                    This allows you to move beyond “normal” ranges and focus on what needs attention now.
                  </p>
                </div>
                
                <div className="pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-lg"
                  >
                    Got it
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(overlayContent, document.body);
};


export default BaselineScoreInfoOverlay;

