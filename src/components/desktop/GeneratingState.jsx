import React, { memo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import generationAnimation from '../../assets/generation_animation.json';

// Inject text-pulse CSS once
if (typeof document !== 'undefined' && !document.getElementById('gen-state-css')) {
  const el = document.createElement('style');
  el.id = 'gen-state-css';
  el.textContent = `
    @keyframes genTextPulse {
      0%, 100% { opacity: 0.45; }
      50%       { opacity: 0.75; }
    }
  `;
  document.head.appendChild(el);
}

const GeneratingState = memo(function GeneratingState() {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.7);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-live="polite"
      aria-busy="true"
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      '380px',
        gap:            '16px',
        padding:        '40px 0',
        userSelect:     'none',
      }}
    >
      {/* Lottie animation */}
      <div style={{
        width:  'clamp(100px, 12vw, 140px)',
        height: 'clamp(100px, 12vw, 140px)',
        flexShrink: 0,
      }}>
        <Lottie
          lottieRef={lottieRef}
          animationData={generationAnimation}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Label */}
      <p
        style={{
          margin:        0,
          fontFamily:    'var(--font-main)',
          fontSize:      '14px',
          fontWeight:    500,
          letterSpacing: '0.08em',
          color:         'rgba(var(--muted-foreground))',
          animation:     'genTextPulse 2.2s ease-in-out infinite',
        }}
      >
        Your Action Plan Generating ....
      </p>
    </motion.div>
  );
});

export default GeneratingState;
