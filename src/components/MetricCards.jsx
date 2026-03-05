import React from 'react';
import healthData from '../data.json';

const MetricCard = ({ title, mainValue, label, variant, onClick }) => {
  return (
    <div className="card-white" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-header">
        <div className="card-title-group">
          {variant === 'caution' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="3" style={{ marginRight: '10px' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="3" style={{ marginRight: '10px' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          <span className="card-title text-slate-900">{title}</span>
        </div>
      </div>
      <div className="card-content">
        <div className="main-stat flex-1">
          <div className="flex items-center justify-between pointer-events-none">
            <h1 className="stat-value text-slate-900">{mainValue < 10 ? `0${mainValue}` : mainValue}</h1>
            <span className="material-symbols-outlined text-4xl text-amber-500/40">keyboard_arrow_right</span>
          </div>
          <p className="stat-label text-slate-500">{label}</p>
        </div>
      </div>

      <style jsx>{`
        .card-white {
          background: #FFFFFF;
          width: 100%;
          padding: 30px;
          border-radius: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(230, 126, 34, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-white:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
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
        }

        .card-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .card-content {
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
        }

        .stat-value {
          font-size: 5rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -2px;
        }

        .stat-label {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          margin-top: 10px;
          letter-spacing: 0.05em;
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
