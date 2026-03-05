import React from 'react';
import healthData from '../data.json';

const LogItem = ({ icon, title, subtitle, xp, variant }) => {
  return (
    <div className={`status-row ${variant}`}>
      <div className="log-left">
        <div className="log-icon">
          {icon}
        </div>
        <div className="log-info">
          <h4 className="log-title">{title}</h4>
          <p className="mono-text log-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="log-right">
        <span className="xp-tag">{xp} XP</span>
      </div>

      <style jsx>{`
        .status-row {
          width: 100%;
          border: 1px solid #333;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          background: transparent;
        }

        .status-row.white {
          background: #FFFFFF;
          color: #000;
          border: none;
        }

        .log-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .log-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .log-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
        }

        .log-subtitle {
          font-size: 0.6rem;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .xp-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .white .log-subtitle {
          color: #444;
        }

        .white .xp-tag {
          color: #000;
        }
      `}</style>
    </div>
  );
};

const StatusLog = () => {
  const { contributors } = healthData.data;

  return (
    <div className="status-log-section" style={{ width: '100%', paddingBottom: '40px' }}>
      <p className="section-label mono-text" style={{ marginBottom: '16px', fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>High Impact</p>

      {contributors.negative.map((item, idx) => (
        <LogItem
          key={idx}
          variant="white"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          title={`${item.display_name} ${item.inference}`}
          subtitle={`Impact Detail: ${item.current_value} ${item.unit}`}
          xp="-12.0"
        />
      ))}
    </div>
  );
};

export default StatusLog;
