import React from 'react';
import healthData from '../data.json';

const MetricCard = ({ title, mainValue, label, variant, onClick }) => {
  return (
    <div className="card-white" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-header">
        <div className="card-title-group">
          {variant === 'caution' ? (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100/50">
                <span className="material-symbols-outlined text-orange-600 text-[18px]">warning</span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100/50">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
            </div>
          )}
          <span className="card-title">{title}</span>
        </div>
      </div>
      <div className="card-content">
        <div className="main-stat flex-1">
          <div className="flex items-center justify-between pointer-events-none">
            <h1 className="stat-value">{mainValue < 10 ? `0${mainValue}` : mainValue}</h1>
            <span className="material-symbols-outlined text-3xl text-slate-200">dock_to_right</span>
          </div>
          <p className="stat-label">
            <span className={`w-1.5 h-1.5 rounded-full ${variant === 'caution' ? 'bg-orange-500 shadow-[0_0_8px_rgba(230,126,34,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`} />
            {label}
          </p>
        </div>
      </div>

      <style jsx>{`
        .card-white {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          width: 100%;
          padding: 30px;
          border-radius: 28px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .card-white::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(230, 126, 34, 0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .card-white:hover {
          transform: translateY(-6px) scale(1.01);
          border-color: rgba(230, 126, 34, 0.2);
          box-shadow: 0 20px 40px rgba(230, 126, 34, 0.05);
        }

        .card-white:hover::before {
          opacity: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-title {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #64748B;
        }

        .card-content {
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
        }

        .stat-value {
          font-family: 'Space Mono', monospace;
          font-size: 4.8rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -4px;
          color: #1A1A1B;
        }

        .stat-label {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.65rem;
          text-transform: uppercase;
          margin-top: 12px;
          letter-spacing: 0.15em;
          color: #94A3B8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: full;
          background: var(--accent-color);
          box-shadow: 0 0 8px var(--accent-color);
        }
      `}</style>
    </div>
  );
};

const MetricCards = ({ onDetail }) => {
  const { contributors } = healthData.data;

  return (
    <div className="metrics-group" style={{ width: '100%', padding: '0 10px' }}>
      <MetricCard
        title="What's Working Well"
        mainValue={contributors.positive_count}
        label="POSITIVE FACTORS"
        onClick={() => onDetail('positive')}
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
