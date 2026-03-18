import React from 'react';
import healthData from '../../data.json';
import MobileBaselineScoreCard from './MobileBaselineScoreCard';

const MobileScoreHero = ({ onSimulate }) => {
  const score = healthData.data.score_details.normalized_baseline_score; // 65

  return (
    <div className="w-full mb-4 px-4 mt-6">
      <MobileBaselineScoreCard
        score={score}
        status="Stable"
        nextLevel="Robust (70)"
        progress={score}
        progressMax={70}
        weeklyGain={4}
        pointsToUnlock={5}
        topPercentage={35}
        biggestBoost="Vitamin D3 + K2"
        biggestBoostGain={7}
        onImprove={onSimulate}
      />
    </div>
  );
};

export default MobileScoreHero;
