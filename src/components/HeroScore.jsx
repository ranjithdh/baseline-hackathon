import React, { useState } from 'react';
import healthData from '../data.json';
import { motion, AnimatePresence } from 'framer-motion';
import BaselineScoreDeepDive from './BaselineScoreDeepDive';

const HeroScore = ({ onSetGoal }) => {
  const { score_details } = healthData.data;
  const [showDeepDive, setShowDeepDive] = useState(false);

  return (
    <div className="hero-section">
      <div className="geometric-container">
        <div className="diamond-outer"></div>
        <div className="square-inner">
          <div className="score-box">
            <p className="score-label">Baseline Score</p>
            <h1 className="score-value">{score_details.normalized_baseline_score}</h1>
            <div className="score-delta">
              <p className="delta-text">Status: {score_details.inference}</p>
            </div>
            
            {/* Creative Explanation Tag */}
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(var(--brand-color), 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeepDive(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-[10px] font-black tracking-[0.2em] text-primary-text uppercase shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              Deep Dive
            </motion.button>
          </div>
        </div>
        {/* Atmospheric Glows */}
        <div className="solar-glow"></div>
      </div>

      <div className="system-description">
        <p className="description-text">{score_details.baseline_score_description}</p>
        <button className="goal-btn group" onClick={onSetGoal}>
          <span>Set Goal for Stable</span>
          <div className="btn-glow"></div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Immersive Explanation Overlay */}
      <AnimatePresence>
        {showDeepDive && (
          <BaselineScoreDeepDive onClose={() => setShowDeepDive(false)} />
        )}
      </AnimatePresence>

      <style jsx>{`
        .hero-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          padding: 60px 0 40px 0;
          position: relative;
        }

        .geometric-container {
          position: relative;
          width: 280px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .diamond-outer {
          position: absolute;
          width: 220px;
          height: 220px;
          border: 1px solid var(--accent-secondary);
          transform: rotate(45deg);
          opacity: 0.3;
        }

        .square-inner {
          position: absolute;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: var(--gradient-score);
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .solar-glow {
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(var(--brand-color), 0.08) 0%, transparent 70%);
          z-index: 1;
          pointer-events: none;
        }

        .score-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 3;
        }

        .score-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .score-value {
          font-family: var(--font-heading);
          font-size: 5.5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 12px;
          color: #FFFFFF;
          letter-spacing: -2px;
        }

        .score-delta {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: #FFF;
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .delta-text {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .system-description {
          text-align: center;
          max-width: 85%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 25px;
        }

        .description-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .goal-btn {
          position: relative;
          background: var(--accent-color);
          color: #FFF;
          border: none;
          padding: 18px 32px;
          border-radius: 40px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .goal-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          opacity: 0.9;
        }

        .btn-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .goal-btn:hover .btn-glow {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default HeroScore;
