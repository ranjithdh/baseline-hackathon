import React from 'react';
import { motion } from 'framer-motion';

const BottomNav = ({ activeView, onNavigate }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'dashboard', label: 'Data', icon: 'monitoring' },
        { id: 'action-plan', label: 'Action Plan', icon: 'event_note' }
    ];

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pointer-events-auto bg-[#0A0A0A]/40 backdrop-blur-3xl border border-white/10 rounded-full py-2 px-3 flex items-center gap-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
                {navItems.map((item) => {
                    const isActive = activeView === item.id;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className="relative px-5 py-2 rounded-full transition-all group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-blue-500/10 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className="flex flex-col items-center gap-1.5 relative z-10">
                                <span 
                                    className={`material-symbols-outlined text-[20px] transition-colors ${
                                        isActive ? 'text-blue-400 font-variation-icon-fill' : 'text-white/40 group-hover:text-white/60'
                                    }`}
                                >
                                    {item.icon}
                                </span>
                                <span 
                                    className={`text-[9px] font-bold uppercase tracking-[0.15em] transition-colors ${
                                        isActive ? 'text-blue-400' : 'text-white/30 group-hover:text-white/50'
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </motion.nav>
        </div>
    );
};

export default BottomNav;
