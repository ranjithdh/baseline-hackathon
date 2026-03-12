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
          background: var(--card-bg-translucent);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .status-row:hover {
          transform: translateX(4px);
          border-color: rgba(var(--brand-color), 0.2);
          background: var(--card-bg);
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
          background: var(--primary-bg);
          color: var(--primary);
        }

        .log-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--foreground);
          margin-bottom: 4px;
        }

        .log-subtitle {
          font-family: var(--font-main);
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--muted-foreground);
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .xp-tag {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 900;
          color: var(--primary);
          background: var(--primary-bg);
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid var(--primary-border);
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
        color: 'var(--muted-foreground)',
        letterSpacing: '0.3em',
        fontWeight: '900',
        textTransform: 'uppercase',
        borderLeft: '2px solid var(--primary)',
        paddingLeft: '12px',
        fontFamily: 'var(--font-heading)'
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
