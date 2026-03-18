import React from 'react';
import consultIcon from '../../assets/consult-icon.png';
import { motion } from 'framer-motion';

const MobileConsultBanner = ({ onBookNow }) => {
  return (
    <div className="px-4 mb-6 w-full">
      <motion.div 
        whileTap={{ scale: 0.98 }}
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(135deg, #253282 0%, #374DAE 50%, #537DD3 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          boxSizing: 'border-box',
          padding: '28px 24px',
          minHeight: '180px',
        }}
      >
        {/* Left: text + button */}
        <div style={{ position: 'relative', zIndex: 10, width: '60%' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '22px',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '10px',
            lineHeight: 1.1,
          }}>
            Let's Get Started
          </div>
          <div style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '24px',
            lineHeight: 1.4,
          }}>
            Get the best out of your result with a consultation from our expert for free.
          </div>
          <button
            onClick={onBookNow}
            style={{
              background: '#ffffff',
              color: '#2B63FF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'var(--font-main)',
              cursor: 'pointer',
            }}
          >
            Book Consultation
          </button>
        </div>

        {/* Right: image — touches bottom-right corner */}
        <div style={{
          position: 'absolute',
          right: '0',
          bottom: '0',
          width: '50%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
          <img
            src={consultIcon}
            alt="consult icon"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom right',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MobileConsultBanner;
