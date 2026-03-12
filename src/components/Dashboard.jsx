import React, { useState } from 'react';
import HeroScore from './HeroScore';
import MetricCards from './MetricCards';
import StatusLog from './StatusLog';
import healthData from '../data.json';
import TimelineDial from './TimelineDial';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ onSetGoal, onDetail, onSettings }) => {
    const [heroView, setHeroView] = useState('score'); // 'score' or 'timeline'

    return (
        <div className="dashboard-container relative">
            {/* Top Unified Header */}
            <header className="px-4 pt-8 mb-8 flex justify-between items-center w-full relative z-30">
                <div className="flex-1 min-w-0 pr-4">
                    <h1 className="text-[22px] font-medium text-foreground tracking-tight font-heading truncate normal-case">
                        Welcome Guest
                    </h1>
                    <p className="text-[12px] font-normal text-[#E4E4E7]/60 tracking-widest mt-1 truncate">
                        Last updated {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                <div className="flex gap-2 shrink-0">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={onSettings}
                        className="w-10 h-10 rounded-full bg-card/10 backdrop-blur-md shadow-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            settings
                        </span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setHeroView(prev => prev === 'score' ? 'timeline' : 'score')}
                        className="w-10 h-10 rounded-full bg-card/10 backdrop-blur-md shadow-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {heroView === 'score' ? 'schedule' : 'leaderboard'}
                        </span>
                    </motion.button>
                </div>
            </header>


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
                            <h2 className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase mb-8 font-heading">Daily Protocol Dial</h2>
                            <TimelineDial compact={true} />
                            <p className="mt-8 text-muted-foreground text-[11px] font-medium max-w-[80%] text-center uppercase tracking-widest font-main">Tap icons to see protocol details</p>
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
