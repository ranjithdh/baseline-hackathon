import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CircularGauge = ({ value, status }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="gauge-container">
      <svg width="240" height="240" viewBox="0 0 240 240">
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="12"
          opacity="0.5"
        />
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="none"
          stroke="var(--accent-color)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 8px rgba(var(--brand-color), 0.3))'
          }}
          transform="rotate(-90 120 120)"
        />
      </svg>
      <div className="gauge-text">
        <h2 className="text-primary-text">{value}</h2>
      </div>
      <style jsx>{`
        .gauge-container {
          position: relative;
          width: 240px;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .gauge-text {
          position: absolute;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gauge-text h2 {
          font-size: 5rem;
          font-weight: 900;
          line-height: 1;
          margin: 0;
          letter-spacing: -3px;
        }
        .label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 3px;
          margin-top: 10px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

const GeneratingOverlay = () => {
  const [progress, setProgress] = React.useState(0);
  const [stage, setStage] = React.useState("ANALYZING BIOMETRICS");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    const stageTimer = setTimeout(() => setStage("OPTIMIZING PROTOCOLS"), 1000);
    const stageTimer2 = setTimeout(() => setStage("FINALIZING STRATEGY"), 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(stageTimer);
      clearTimeout(stageTimer2);
    };
  }, []);

  return (
    <div className="generating-overlay">
      <div className="anim-content">
        <div className="scanner-line"></div>
        <div className="progress-value text-primary-text">{progress}%</div>
        <div className="stage-text text-primary">{stage}</div>
        <div className="progress-bar-outer bg-muted">
          <div className="progress-bar-fill bg-primary shadow-[0_0_20px_rgba(var(--brand-color),0.4)]" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <style jsx>{`
        .generating-overlay {
          position: absolute;
          inset: 0;
          background: var(--bg-color);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .anim-content {
          width: 100%;
          padding: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }
        .scanner-line {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
          position: absolute;
          top: 0;
          animation: scan 3s linear infinite;
          opacity: 0.2;
        }
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        .progress-value {
          font-size: 6rem;
          font-weight: 900;
          letter-spacing: -5px;
          line-height: 1;
        }
        .stage-text {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 4px;
          font-weight: 800;
          text-transform: uppercase;
        }
        .progress-bar-outer {
          width: 100%;
          height: 4px;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          transition: width 0.1s linear;
        }
      `}</style>
    </div>
  );
};

const GoalPage = ({ onBack, onNext }) => {
  const [goalScore, setGoalScore] = useState(70);
  const [isGenerating, setIsGenerating] = useState(false);

  const getStatus = (val) => {
    if (val <= 50) return { label: 'Compromised', color: 'var(--rating-rank-2)' };
    if (val <= 65) return { label: 'Constrained', color: 'var(--rating-rank-3)' };
    if (val <= 75) return { label: 'Stable', color: 'var(--rating-rank-4)' };
    if (val <= 85) return { label: 'Robust', color: 'var(--rating-rank-5)' };
    return { label: 'Elite', color: 'var(--rating-rank-6)' };
  };

  const currentStatus = getStatus(goalScore);

  const handleNext = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onNext();
    }, 3000);
  };

  return (
    <div className="minimal-goal-page bg-background text-foreground font-main h-screen flex justify-center overflow-hidden">
      {isGenerating && <GeneratingOverlay />}
      <main className="w-full max-w-[430px] h-full bg-background flex flex-col relative shadow-2xl overflow-hidden text-[#f2f2f2]">
        <div className="bg-effects z-0">
          <div className="grid"></div>
          <div className="glow-orb" style={{ backgroundColor: 'var(--accent-color)' }}></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <header className="px-6 sm:px-8 pt-8 pb-4 mb-4">
            <nav className="flex justify-between items-center mb-10">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-muted-foreground hover:text-primary transition-all group px-4 py-2 bg-zinc-900/50 rounded-full border border-zinc-700/30"
              >
                <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
                BACK
              </button>
            </nav>


          </header>

          <main className="main-setter px-8 pb-32">
            <motion.div 
              animate={{ 
                borderColor: `rgb(${currentStatus.color})`,
                boxShadow: `0 0 20px rgb(${currentStatus.color} / 0.15)`
              }}
              transition={{ duration: 0.4 }}
              className="status-badge shadow-sm mb-12 bg-zinc-900/60 backdrop-blur-md"
              style={{ 
                border: `1px solid rgb(${currentStatus.color})`,
                boxShadow: `0 0 15px rgb(${currentStatus.color} / 0.15)`
              }}
            >
              <motion.span 
                className="dot" 
                animate={{ backgroundColor: `rgb(${currentStatus.color})` }}
                transition={{ duration: 0.4 }}
              />
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStatus.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="text-primary-text"
                >
                  {currentStatus.label}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <div className="visualization mb-14 scale-[1.05]">
              <CircularGauge value={goalScore} status={currentStatus} />
            </div>

            <div className="control-center">
              <div className="slider-header mb-6">
                <span className="text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-50">Adjust Target Score</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={goalScore}
                onChange={(e) => setGoalScore(parseInt(e.target.value))}
                className="minimal-slider"
                style={{
                  background: `linear-gradient(to right, var(--secondary-color) 0%, var(--secondary-color) ${goalScore}%, rgb(var(--zinc-800)) ${goalScore}%, rgb(var(--zinc-800)) 100%)`
                }}
              />
              <div className="slider-hints mt-4">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
          </main>
        </div>

        {/* Glass Bottom Action Area */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-zinc-800/20 px-8 pt-6 pb-[12px] flex flex-col items-center gap-5 overflow-hidden">
          <p className="text-[8px] sm:text-[9px] text-muted-foreground/50 text-center leading-relaxed font-bold tracking-widest max-w-[320px]">
            Ready to generate your personalized wellness protocols?
          </p>

          <button
            onClick={handleNext}
            className="w-full bg-primary text-zinc-950 font-black text-[12px] tracking-[0.25em] uppercase py-5 rounded-full shadow-2xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all font-heading"
          >
            Generate Protocol
          </button>
        </div>
      </main>

      <style jsx>{`
        .minimal-goal-page {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        .bg-effects {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(var(--zinc-800) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.15;
        }

        .glow-orb {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
          transition: transform 0.8s ease;
        }

        .main-setter {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 20px;
          border-radius: 40px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          background: rgba(24, 24, 27, 0.4);
          backdrop-filter: blur(32px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }

        .visualization {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .control-center {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .minimal-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 6px;
          outline: none;
        }

        .minimal-slider::-webkit-slider-runnable-track {
          background: transparent;
        }

        .minimal-slider::-moz-range-track {
          background: transparent;
        }

        .minimal-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: #FFF;
          border: 2px solid var(--primary);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
        }

        .minimal-slider::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }

        .slider-hints {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--muted-foreground);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default GoalPage;
