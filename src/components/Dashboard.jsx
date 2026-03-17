import React, { useState } from 'react';
import HeroScore from './HeroScore';
import MetricCards from './MetricCards';
import StatusLog from './StatusLog';
import healthData from '../data.json';
import TimelineDial from './TimelineDial';
import { motion, AnimatePresence } from 'framer-motion';
import consultationCrystal from '../assets/consultation_crystal.png';


const Dashboard = ({ onSetGoal, onDetail, onSettings, isEmpty = false }) => {
    const [heroView, setHeroView] = useState('score'); // 'score' or 'timeline'

    return (
        <div className="dashboard-container relative pb-32 min-h-screen flex flex-col items-center justify-center">
            {isEmpty ? (
                <h2 className="text-xl font-medium text-white/20 font-heading tracking-[0.2em] uppercase">Data</h2>
            ) : (
                <>
                    {/* Top Unified Header */}
                    <header className="px-4 pt-8 mb-8 flex justify-between items-center w-full relative z-30">
                        {/* ... existing header content ... */}
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

                    {/* Upcoming Consultation Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full mb-8 mt-4 relative overflow-hidden p-6 sm:p-8 shadow-y-xl rounded-[20px] group border-none"
                        style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 1) 0%, rgba(2, 6, 23, 1) 100%)' }}
                    >
                        <div className="relative z-10 w-[65%]">
                            <h3 className="text-[22px] sm:text-[24px] font-medium text-white mb-2 font-heading tracking-tight leading-tight group-hover:text-blue-200 transition-colors">Upcoming Consultation</h3>
                            <p className="text-[#A1A1AA] text-[12px] sm:text-[14px] font-medium tracking-wide mb-1 opacity-80">3:00 PM - 7:00 PM (GMT+5:30)</p>
                            <p className="text-[#A1A1AA] text-[12px] sm:text-[14px] font-medium tracking-wide mb-8 opacity-80">Wednesday, October 20, 2025</p>
                            <button className="bg-[#E4E4E7] text-zinc-950 font-bold text-[13px] tracking-tight px-8 py-3.5 rounded-[12px] hover:bg-white active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] font-heading">
                                Add to Calendar
                            </button>
                        </div>

                        {/* Crystal Background Image */}
                        <div className="absolute right-4 bottom-4 w-[100px] h-[100px] pointer-events-none flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out" style={{ mixBlendMode: 'screen' }}>
                            <img
                                src={consultationCrystal}
                                alt="Consultation Crystal"
                                className="w-full h-full object-contain brightness-125 contrast-125"
                            />
                        </div>
                    </motion.div>

                    <MetricCards onDetail={onDetail} />
                    <StatusLog />
                </>
            )}
        </div>
    );
};

export default Dashboard;
