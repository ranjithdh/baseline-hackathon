import React from 'react';

const ScoreRange = ({ score }) => {
    const ranges = [
        { label: 'Compromised', color: '#ef4444', min: 0, max: 50 },
        { label: 'Constrained', color: '#f59e0b', min: 50, max: 65 },
        { label: 'Stable', color: '#10b981', min: 65, max: 75 },
        { label: 'Robust', color: '#2b7fff', min: 75, max: 85 },
        { label: 'Elite', color: '#06b6d4', min: 85, max: 100 }
    ];

    // Helper to calculate position percentage (0-100)
    const getPosition = (val) => {
        return Math.min(Math.max((val / 100) * 100, 0), 100);
    };

    const currentRange = ranges.find(r => score >= r.min && score < r.max) || ranges[ranges.length - 1];

    return (
        <div className="score-range-container">
            <div className="score-summary">
                <div className="score-main">
                    <span className="score-big">{score}</span>
                    <span className="score-total">of 100</span>
                </div>
                <div className="score-badge" style={{ backgroundColor: currentRange.color }}>
                    {currentRange.label}
                </div>
            </div>

            <div className="range-label-main">Score Range</div>

            <div className="range-bar-wrapper">
                <div className="range-bar">
                    {ranges.map((range, index) => (
                        <div
                            key={index}
                            className="range-segment"
                            style={{
                                width: `${range.max - range.min}%`,
                                backgroundColor: range.color,
                                opacity: score > range.min ? 1 : 0.3
                            }}
                        />
                    ))}
                    <div
                        className="score-marker"
                        style={{ left: `${getPosition(score)}%` }}
                    >
                        <div className="marker-triangle"></div>
                    </div>
                </div>

                <div className="range-markers">
                    <span>50</span>
                    <span>65</span>
                    <span>75</span>
                    <span>85</span>
                </div>
            </div>

            <div className="range-legend">
                {ranges.slice(0, 4).map((range, index) => (
                    <div key={index} className="legend-item">
                        <div className="legend-dot" style={{ backgroundColor: range.color }}></div>
                        <span>{range.label}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .score-range-container {
          width: 100%;
          background: #111;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .score-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .score-big {
          font-size: 3rem;
          font-weight: 900;
          color: #FFF;
          margin-right: 8px;
        }

        .score-total {
          font-size: 1.2rem;
          color: #666;
          font-weight: 600;
        }

        .score-badge {
          padding: 8px 16px;
          border-radius: 20px;
          color: #000;
          font-weight: 900;
          font-size: 0.9rem;
          text-transform: capitalize;
        }

        .range-label-main {
          color: rgba(228,228,231,0.4);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .range-bar-wrapper {
          position: relative;
          margin-bottom: 32px;
        }

        .range-bar {
          display: flex;
          height: 8px;
          border-radius: 4px;
          overflow: visible;
          position: relative;
          background: #222;
        }

        .range-segment {
          height: 100%;
          margin-right: 2px;
          border-radius: 1px;
        }

        .range-segment:first-child { border-top-left-radius: 4px; border-bottom-left-radius: 4px; }
        .range-segment:last-child { border-top-right-radius: 4px; border-bottom-right-radius: 4px; margin-right: 0; }

        .score-marker {
          position: absolute;
          top: -8px;
          transform: translateX(-50%);
          z-index: 10;
        }

        .marker-triangle {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 10px solid #FFF;
        }

        .range-markers {
          display: flex;
          justify-content: space-between;
          padding: 0 50% 0 50%; /* approximate for 50 line */
          margin-top: 8px;
          color: #FFF;
          font-size: 0.8rem;
          position: absolute;
          width: 100%;
          left: 0;
        }

        /* Hardcoded positions for standard markers */
        .range-markers span:nth-child(1) { position: absolute; left: 50%; transform: translateX(-50%); }
        .range-markers span:nth-child(2) { position: absolute; left: 65%; transform: translateX(-50%); }
        .range-markers span:nth-child(3) { position: absolute; left: 75%; transform: translateX(-50%); }
        .range-markers span:nth-child(4) { position: absolute; left: 85%; transform: translateX(-50%); }

        .range-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 24px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #888;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>
        </div>
    );
};

export default ScoreRange;
