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
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          transition: all 0.3s ease;
        }

        .status-row:hover {
          transform: translateX(4px);
          border-color: rgba(230, 126, 34, 0.2);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
        }

        .log-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .log-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(230, 126, 34, 0.08);
          color: #E67E22;
        }

        .log-title {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1A1A1B;
          margin-bottom: 4px;
        }

        .log-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #64748B;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .xp-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          font-weight: 900;
          color: #E67E22;
          background: rgba(230, 126, 34, 0.05);
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid rgba(230, 126, 34, 0.1);
        }
      `}</style>
    </div>
  );
};

const StatusLog = () => {
  const { contributors } = healthData.data;

  return (
    <div className="status-log-section" style={{ width: '100%', paddingBottom: '40px' }}>
      <p className="section-label" style={{
        marginBottom: '20px',
        fontSize: '0.65rem',
        color: '#94A3B8',
        letterSpacing: '0.3em',
        fontWeight: '900',
        textTransform: 'uppercase',
        borderLeft: '2px solid #E67E22',
        paddingLeft: '12px'
      }}>High Impact</p>

      {contributors.negative.map((item, idx) => (
        <LogItem
          key={idx}
          icon={<span className="material-symbols-outlined text-[18px]">emergency_home</span>}
          title={`${item.display_name} • ${item.inference}`}
          subtitle={`${item.current_value}${item.unit}`}
          xp="-12.0"
        />
      ))}
    </div>
  );
};

export default StatusLog;
