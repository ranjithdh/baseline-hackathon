import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ActionProtocolDrawer = ({ group, completedProtocols, onToggle, onItemSelected, onClose }) => {
  if (!group) return null;

  const completedCount = group.items.filter(item => completedProtocols.has(item)).length;
  const progressPercentage = (completedCount / group.items.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col justify-end"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[430px] mx-auto bg-zinc-900 border-t border-zinc-800 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center py-4">
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-8 pb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800/50 shadow-inner">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(var(--brand-color), 0.4))' }}>{group.icon}</span>
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest text-foreground uppercase font-heading">{group.category}</h2>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                {completedCount} of {group.items.length} COMPLETED
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            <span className="material-symbols-outlined text-foreground">close</span>
          </button>
        </div>

        {/* Progress Sticky */}
        <div className="px-8 mb-4">
          <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="h-full bg-primary shadow-[0_0_15px_rgba(var(--brand-color),0.5)]"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
          <ul className="space-y-4 pb-20">
            {group.items.map((item, idx) => {
              const isCompleted = completedProtocols.has(item);
              return (
                <li
                  key={idx}
                  className={`group relative flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-zinc-800/30 border-emerald-500/20' 
                      : 'bg-zinc-950/20 border-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div 
                    className="flex-1 py-1 cursor-pointer"
                    onClick={() => onItemSelected(item)}
                  >
                    <span className={`text-[14px] font-bold tracking-tight block ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">+1 Vitality</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onToggle(item)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                        : 'border-zinc-700 text-transparent hover:border-zinc-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] font-black">
                      {isCompleted ? 'check' : ''}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

export default ActionProtocolDrawer;
