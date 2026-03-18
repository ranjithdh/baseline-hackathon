import React from 'react';
import healthData from '../../data.json';
import BaselineScoreCard from './BaselineScoreCard';

const DesktopScoreHero = ({ onSimulate }) => {
  const score = healthData.data.score_details.normalized_baseline_score; // 65

  return (
    <BaselineScoreCard
      score={score}
      status="Stable"
      nextLevel="Strong (70)"
      progress={score}
      progressMax={70}
      weeklyGain={4}
      pointsToUnlock={5}
      topPercentage={35}
      biggestBoost="Vitamin D3 + K2"
      biggestBoostGain={7}
      onImprove={onSimulate}
      showRangeBar={false}
      showActionButton={false}
    />
  );
};

export default DesktopScoreHero;
