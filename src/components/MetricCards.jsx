import React from 'react';
import healthData from '../data.json';

const MetricCard = ({ title, mainValue, label, variant, onClick }) => {
  const isCaution = variant === 'caution';
  const isWatch = variant === 'watch';
  const statusColor = isCaution ? 'var(--red-9)' : isWatch ? '245, 158, 11' : 'var(--green-9)';

  return (
    <div
      className={`card-white ${variant}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="card-header">
        <div className="card-title-group">
          <div className="status-icon-container">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ color: `rgb(${statusColor})` }}
            >
              {isCaution ? 'warning' : isWatch ? 'visibility' : 'check_circle'}
            </span>
            <div className="icon-glow" style={{ '--glow-color': `rgb(${statusColor})` }} />
          </div>
          <span className="card-title">{title}</span>
        </div>
      </div>
      <div className="card-content">
        <div className="main-stat flex-1">
          <div className="flex items-center justify-between pointer-events-none">
            <h1 className="stat-value">{mainValue < 10 ? `0${mainValue}` : mainValue}</h1>
            <span className="material-symbols-outlined text-3xl opacity-20">dock_to_right</span>
          </div>
          <p className="stat-label">
            {label}
          </p>
        </div>
      </div>

      <style jsx>{`
        .card-white {
          width: 100%;
          padding: 24px;
          border-radius: 20px;
          margin-bottom: 16px;
          background: rgb(var(--card));
          border: none;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          color: var(--text-primary);
          cursor: pointer;
          outline: none;
        }

        .card-white:hover, .card-white:focus, .card-white:active {
          transform: translateY(-2px);
          border-color: rgba(var(--brand-color), 0.3);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          background: rgb(var(--card)) !important; /* Force consistent background */
        }

        .status-icon-container {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #121214;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          
          /* Deep inner shadow for the "recessed" feel */
          box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.8);
          transition: all 0.3s ease;
        }

        /* Razor-sharp top-rim highlight using mask-composite */
        .status-icon-container::after {
          content: "";
          position: absolute;
          inset: -0.5px;
          border-radius: 50%;
          padding: 1px;
          background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 45%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .icon-glow {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
          opacity: 0.1;
          filter: blur(8px);
          pointer-events: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-secondary);
        }

        .card-content {
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
          margin-bottom: 12px;
        }

        .stat-value {
          font-family: var(--font-mono);
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -2px;
          color: var(--text-primary);
        }

        .stat-label {
          font-family: var(--font-main);
          font-weight: 700;
          font-size: 0.6rem;
          text-transform: uppercase;
          margin-top: 8px;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </div>
  );
};

const MetricCards = ({ onDetail }) => {
  const { contributors } = healthData.data;

  return (
    <div className="metrics-group" style={{ width: '100%', padding: '0 1px' }}>
      <MetricCard
        title="What's Working Well"
        mainValue={contributors.positive_count}
        label="POSITIVE FACTORS"
        onClick={() => onDetail('positive')}
      />
      <MetricCard
        title="Watch Closely"
        mainValue={3}
        label="MONITORING REQUIRED"
        variant="watch"
        onClick={() => onDetail('watch')}
      />
      <MetricCard
        title="Needs Attention"
        mainValue={contributors.negative_count}
        label="REDUCING YOUR SCORE"
        variant="caution"
        onClick={() => onDetail('negative')}
      />
    </div>
  );
};

export default MetricCards;
