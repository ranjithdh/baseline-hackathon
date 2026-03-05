import React from 'react';
import HeroScore from './HeroScore';
import MetricCards from './MetricCards';
import StatusLog from './StatusLog';
import healthData from '../data.json';

const Dashboard = ({ onSetGoal, onDetail }) => {
    return (
        <div className="dashboard-container">
            <HeroScore onSetGoal={onSetGoal} />
            <MetricCards onDetail={onDetail} />
            <StatusLog />
        </div>
    );
};

export default Dashboard;
