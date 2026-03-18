import React from 'react';
import healthData from '../../data.json';
import BaselineScoreCard from './BaselineScoreCard';

const DesktopScoreHero = ({ onSimulate }) => {
  const score = healthData.data.score_details.normalized_baseline_score; // 65

  return (
    <BaselineScoreCard
      score={score}
      status="Stable"
      headline="You're doing well — but there's strong potential to improve your energy, appearance, and performance."
      topPercentage={35}
      pointsToGrow={18}
      onTap={onSimulate}
    />
  );
};

export default DesktopScoreHero;
