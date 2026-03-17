import React, { useState } from 'react';
import HeroScore from './HeroScore';
import MetricCards from './MetricCards';
import StatusLog from './StatusLog';
import healthData from '../data.json';
import TimelineDial from './TimelineDial';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ onSetGoal, onDetail, onSettings, onSwitchView }) => {
    const [heroView, setHeroView] = useState('score'); // 'score' or 'timeline'

    return (
        <div className="dashboard-container relative">
            {/* Top Controls */}
            <div className="absolute top-4 right-6 z-30 flex gap-2">
                {/* Switch View — returns to the ViewSelectorScreen */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onSwitchView}
                    title="Switch to Desktop View"
                    className="w-10 h-10 rounded-full bg-card/10 backdrop-blur-md shadow-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-primary transition-all"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        devices
                    </span>
                </motion.button>

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

            {/* Welcome Header */}
            <header className="px-6 mb-8 w-full">
                <h1 className="text-xl font-black text-foreground tracking-tight lowercase font-heading">
                    Welcome <span className="capitalize">Guest</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    Last updated {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
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
