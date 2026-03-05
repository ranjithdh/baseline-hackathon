import React from 'react';
import healthData from '../data.json';
import ScoreRange from './ScoreRange';

const RecommendationGroup = ({ title, items, icon }) => (
    <div className="req-group">
        <div className="group-header">
            {icon}
            <h3>{title}</h3>
        </div>
        <div className="group-content">
            {items.map((item, idx) => (
                <div key={idx} className="rec-item">
                    <div className="rec-bullet"></div>
                    <p>{item}</p>
                </div>
            ))}
        </div>
        <style jsx>{`
      .req-group {
        background: #111;
        border: 1px solid #222;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
      }
      .group-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
        color: #FFF;
      }
      .group-header h3 {
        font-size: 1rem;
        text-transform: none;
        letter-spacing: 0;
      }
      .rec-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 12px;
      }
      .rec-bullet {
        width: 6px;
        height: 6px;
        background: #444;
        border-radius: 50%;
        margin-top: 7px;
        flex-shrink: 0;
      }
      .rec-item p {
        font-size: 0.9rem;
        color: #A0A0A0;
        line-height: 1.4;
      }
    `}</style>
    </div>
);

const ImprovementPlan = ({ onBack }) => {
    const { score_details, contributors } = healthData.data;

    // Personalized data based on negative factors
    const recommendations = {
        supplements: [
            "Vitamin D3 (5000 IU) with K2 (100mcg) daily to raise levels from 19.69 to target >30.",
            "Consider Berberine or Magnesium Glycinate to support metabolic stability."
        ],
        nutrition: [
            "Increase fatty fish (Salmon, Mackerel) and egg yolks for natural Vitamin D.",
            "Shift towards a lower glycemic index diet to stabilize HbA1c further.",
            "High-fiber intake (30g+) to support LDL and Triglyceride reduction."
        ],
        activities: [
            "Zone 2 Cardio: 4 sessions/week (45 mins) to improve VO2 Max.",
            "Resistance Training: 3x per week to optimize body composition and basal metabolic rate.",
            "10-min post-meal walks to maintain glucose stability."
        ]
    };

    return (
        <div className="plan-container">
            <div className="nav-header">
                <button onClick={onBack} className="back-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="title-alt">Your Path to Stable</h2>
            </div>

            <ScoreRange score={score_details.normalized_baseline_score} />

            <div className="plan-narrative">
                <p>Your current score is <strong>{score_details.normalized_baseline_score}</strong>. To cross the threshold into <strong>Stable (65+)</strong>, focus on these high-impact adjustments:</p>
            </div>

            <RecommendationGroup
                title="Targeted Supplements"
                items={recommendations.supplements}
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.5 3.5a2.121 2.121 0 0 1 3 3L7 13l-3 1 1-3 6.5-6.5zM15 6.5l3 3M9.5 8.5l3 3M17 11l.5 4.5-2 3-3-1-3 1-2-3 .5-4.5" /></svg>}
            />

            <RecommendationGroup
                title="Nutrition Focus"
                items={recommendations.nutrition}
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3zM6 15h12M6 19h12M6 11h12M12 3v18" /></svg>}
            />

            <RecommendationGroup
                title="Priority Activities"
                items={recommendations.activities}
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}
            />

            <style jsx>{`
        .plan-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .nav-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .back-btn {
          background: none;
          border: none;
          color: #FFF;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          font-weight: 600;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .back-btn:hover { opacity: 1; }
        .title-alt {
          font-size: 1.5rem;
          color: #FFF;
          text-transform: none;
          letter-spacing: 0;
        }
        .plan-narrative {
          color: #888;
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .plan-narrative strong { color: #FFF; }
      `}</style>
        </div>
    );
};

export default ImprovementPlan;
