import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import healthData from '../data.json';
import consultationCrystal from '../assets/consultation_crystal.png';
import baselineSilhouette from '../assets/baseline-silhouette.png';
import baselineBg from '../assets/baseline_background_image.png';

const Home = ({ onDetail, onSetGoal, onScoreClick, showConsultation }) => {
    const { score_details, contributors } = healthData.data;

    const score = score_details.normalized_baseline_score;
    const status = score_details.display_rating || 'Constrained';

    const getFirstThree = (list) => list.slice(0, 3);

    // Mock "Watch Closely" markers
    const watchMarkers = [
        { "display_name": "C-Reactive Protein", "current_value": 2.1, "unit": "mg/L", "inference": "Borderline High", "category": "Inflammation" },
        { "display_name": "Homocysteine", "current_value": 11.4, "unit": "µmol/L", "inference": "Optimal but rising", "category": "Heart" },
        { "display_name": "Uric Acid", "current_value": 6.8, "unit": "mg/dL", "inference": "Near threshold", "category": "Metabolic" }
    ];

    const getRankFromInference = (inference) => {
        const inf = inference.toLowerCase();
        if (inf.includes('optimal') || inf.includes('elite')) return 6;
        if (inf.includes('good') || inf.includes('robust') || inf.includes('ideal')) return 5;
        if (inf.includes('normal') || inf.includes('stable')) return 4;
        if (inf.includes('low') || inf.includes('high') || inf.includes('constrained') || inf.includes('borderline')) return 3;
        if (inf.includes('very low') || inf.includes('poor') || inf.includes('compromised')) return 2;
        return 4; // Default
    };

    const MarkerSection = ({ title, markers, variant, onClick }) => {
        const isCaution = variant === 'caution';
        const isWatch = variant === 'watch';
        const sectionStatusColor = isCaution ? '#EF4444' : isWatch ? '#F59E0B' : '#10B981';
        const icon = isCaution ? 'warning' : isWatch ? 'visibility' : 'check_circle';

        return (
            <div className="mb-8 w-full px-1">
                <div
                    className="flex items-center justify-between mb-4 cursor-pointer group"
                    onClick={onClick}
                >
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]" style={{ color: sectionStatusColor }}>{icon}</span>
                        <h3 className="text-[11px] font-black tracking-[0.2em] text-[#E4E4E7] uppercase font-heading">{title}</h3>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground text-[18px] group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>

                <div className="flex flex-col gap-3">
                    {markers.map((marker, idx) => {
                        const rank = getRankFromInference(marker.inference);
                        const rankToken = `rgb(var(--rating-rank-${rank}))`;

                        return (
                            <motion.div
                                key={idx}
                                whileTap={{ scale: 0.98 }}
                                className="bg-[rgb(var(--card))] rounded-2xl p-4 flex flex-col shadow-sm border-none"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-[13px] font-black text-white font-heading truncate leading-tight">{marker.display_name}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-[16px] font-black text-white font-heading leading-none mb-1">
                                            {marker.current_value}
                                            <span className="text-[8px] font-bold text-muted-foreground ml-1 uppercase tracking-tighter">{marker.unit}</span>
                                        </p>
                                        <p className="text-[8px] font-medium italic text-muted-foreground tracking-tight">{marker.inference}</p>
                                    </div>
                                </div>

                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-1000 ease-out rounded-full"
                                        style={{
                                            width: `${(rank / 6) * 100}%`,
                                            backgroundColor: rankToken,
                                            boxShadow: `0 0 8px ${rankToken}44`
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container relative overflow-y-auto overflow-x-hidden min-h-screen" style={{ paddingBottom: '200px' }}>
            {/* Header */}
            <header className="w-full pt-8 mb-6 px-1 flex items-center justify-between">
                <div>
                    <h1 className="text-[24px] font-medium text-white tracking-tight font-heading">Welcome Guest</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-white/60 text-[24px]">account_circle</span>
                </div>
            </header>

            {/* Final Floating Consultation Pill */}
            {showConsultation && (
                <div className="fixed bottom-32 left-0 right-0 z-[45] flex justify-center px-6 pointer-events-none">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        whileHover={{ scale: 1.01 }}
                        className="w-full max-w-sm bg-[#0A0F29]/85 backdrop-blur-3xl border border-white/10 rounded-full p-1.5 pl-2 flex items-center justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] pointer-events-auto"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-400/20 flex-shrink-0">
                                <span className="material-symbols-outlined text-blue-400 text-[20px] animate-pulse">videocam</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="text-white text-[11px] font-black uppercase tracking-wider font-heading leading-tight">Dr. Sarah Johnson</h4>
                                <p className="text-blue-300/40 text-[8px] font-bold uppercase tracking-widest mt-0.5">Session • Today 3:00 PM</p>
                            </div>
                        </div>
                        <button className="bg-white text-[#0A0F29] text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-blue-50 transition-all active:scale-90 shadow-lg font-heading ml-4">
                            Join
                        </button>
                    </motion.div>
                </div>
            )}
            {/* Baseline Score Card - Blue Style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.99 }}
                onClick={onScoreClick}
                className="w-full rounded-[24px] p-5 relative overflow-hidden mb-6 shadow-xl cursor-pointer"
                style={{
                    background: 'linear-gradient(145deg, #0A0F29 0%, #1E3A8A 100%)',
                    border: 'none'
                }}
            >
                {/* Background Image Overlay - Constrained Dimensions */}
                <div className="absolute right-[-5%] top-[10%] bottom-[-5%] w-[45%] pointer-events-none overflow-hidden opacity-[0.45]">
                    <div className="absolute inset-0 bg-gradient-to-l from-[#0A0F29]/80 via-transparent to-transparent z-10" />
                    <img
                        src={baselineBg}
                        alt=""
                        className="w-full h-full object-contain object-right mix-blend-screen grayscale brightness-90 relative z-5"
                    />
                </div>

                <div className="relative z-20">
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-[16px] font-bold text-white font-heading  tracking-[0.2em]">Baseline Score</h2>
                        <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[7px] font-bold text-white/30 italic uppercase border border-white/10">Beta</span>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-5xl font-black text-white font-heading leading-none tracking-tighter">64</span>
                            <span className="text-[14px] font-bold text-white/20 uppercase tracking-widest font-heading">/ 100</span>
                        </div>
                        <p className="text-[#FBBF24] text-[12px] font-black mt-1 font-medium tracking-tight  italic drop-shadow-md">Constrained</p>
                    </div>

                    <p className="text-white/80 text-[12px] leading-[1.6] max-w-[90%] font-medium mb-5 font-main">
                        Your results show solid markers across inflammation and metabolics — with clear opportunities in Vitamin D, sleep recovery, and iron balance.
                    </p>
                </div>


            </motion.div>

            {/* Marker Sections */}
            <MarkerSection
                title="What's Working Well"
                markers={getFirstThree(contributors.positive)}
                onClick={() => onDetail('positive')}
            />

            <MarkerSection
                title="Watch Closely"
                markers={getFirstThree(watchMarkers)}
                variant="watch"
                onClick={() => onDetail('watch')}
            />

            <MarkerSection
                title="Needs Attention"
                markers={getFirstThree(contributors.negative)}
                variant="caution"
                onClick={() => onDetail('negative')}
            />
        </div>
    );
};

export default Home;
