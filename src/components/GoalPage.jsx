import React, { useState } from 'react';

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
        <span className="label text-muted-foreground">TARGET_SCORE</span>
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
    if (val <= 50) return { label: 'Compromised', color: 'var(--text-secondary)' };
    if (val <= 65) return { label: 'Constrained', color: 'var(--text-secondary)' };
    if (val <= 75) return { label: 'Stable', color: 'var(--accent-color)' };
    if (val <= 85) return { label: 'Robust', color: 'var(--accent-color)' };
    return { label: 'Elite', color: 'var(--accent-color)' };
  };

  const currentStatus = getStatus(goalScore);

  const handleNext = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onNext();
    }, 3000);
  };

  return (
    <div className="minimal-goal-page">
      {isGenerating && <GeneratingOverlay />}
      <div className="bg-effects">
        <div className="grid"></div>
        <div className="glow-orb" style={{ backgroundColor: 'var(--accent-color)' }}></div>
      </div>

      <div className="content">
        <header className="page-header">
          <button onClick={onBack} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

        </header>

        <main className="main-setter">
          <div className="status-badge shadow-sm">
            <span className="dot" style={{ backgroundColor: currentStatus.color }}></span>
            <span className="text-primary-text">{currentStatus.label}</span>
          </div>

          <div className="visualization">
            <CircularGauge value={goalScore} status={currentStatus} />
          </div>

          <div className="control-center">
            <div className="slider-header">
              <span>ADJUST_BASELINE_PARAMETER</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={goalScore}
              onChange={(e) => setGoalScore(parseInt(e.target.value))}
              className="minimal-slider"
            />
            <div className="slider-hints">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </main>

        <footer className="page-footer">
          <button className="next-btn" onClick={handleNext}>
            NEXT
          </button>
        </footer>
      </div>

      <style jsx>{`
        .minimal-goal-page {
          position: relative;
          background: var(--bg-color);
          height: 100vh;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
          color: var(--text-primary);
          font-family: var(--font-main);
          overflow: hidden;
        }

        .bg-effects {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.1;
        }

        .glow-orb {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          transition: transform 0.8s ease;
        }

        .content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 40px 30px;
        }

        .page-header {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 40px;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0;
          opacity: 0.3;
          transition: all 0.3s;
        }
        .close-btn:hover { 
          opacity: 1; 
          transform: rotate(90deg);
        }

        .main-setter {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 60px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 20px;
          border: 1px solid var(--border-color);
          border-radius: 40px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          background: var(--card-bg-translucent);
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--shadow-sm);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }

        .control-center {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .slider-header {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-secondary);
          text-align: center;
          letter-spacing: 2.5px;
          font-weight: 700;
        }

        .minimal-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: var(--border-color);
          border-radius: 4px;
          outline: none;
        }

        .minimal-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: #FFF;
          border: 2px solid var(--accent-color);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: var(--shadow-md);
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
          color: var(--text-secondary);
          font-weight: 700;
        }

        .page-footer {
          text-align: center;
          padding-bottom: 20px;
        }

        .next-btn {
          width: 100%;
          background: var(--accent-color);
          border: none;
          color: #FFF;
          padding: 18px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(var(--brand-color), 0.2);
        }

        .next-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(var(--brand-color), 0.3);
        }
      `}</style>
    </div>
  );
};

export default GoalPage;
