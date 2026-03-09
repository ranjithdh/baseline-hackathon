import React, { useState } from 'react';
import HeroScore from './HeroScore';
import MetricCards from './MetricCards';
import StatusLog from './StatusLog';
import healthData from '../data.json';
import TimelineDial from './TimelineDial';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ onSetGoal, onDetail }) => {
    const [heroView, setHeroView] = useState('score'); // 'score' or 'timeline'

    return (
        <div className="dashboard-container relative">
            {/* View Toggle Icon */}
            <div className="absolute top-4 right-6 z-30">
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setHeroView(prev => prev === 'score' ? 'timeline' : 'score')}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-all"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {heroView === 'score' ? 'schedule' : 'leaderboard'}
                    </span>
                </motion.button>
            </div>

            <div className="w-full">
                <AnimatePresence mode="wait">
                    {heroView === 'score' ? (
                        <motion.div
                            key="score"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <HeroScore onSetGoal={onSetGoal} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center pt-10 pb-10"
                        >
                            <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-8">Daily Protocol Dial</h2>
                            <TimelineDial compact={true} />
                            <p className="mt-8 text-slate-500 text-[11px] font-medium max-w-[80%] text-center uppercase tracking-widest">Tap icons to see protocol details</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <MetricCards onDetail={onDetail} />
            <StatusLog />
        </div>
    );
};

export default Dashboard;
