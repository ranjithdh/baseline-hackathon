import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoActionPlan = ({ onBack }) => {
  const [activeVariant, setActiveVariant] = useState('timeline');

  const protocolData = [
    { name: "Vitamin D3", type: "Vitamin", time: "Morning", category: "Supplements", icon: "pill" },
    { name: "Strength Training", type: "Hypertrophy", time: "Morning", category: "Exercise", icon: "fitness_center" },
    { name: "Anti-inflammatory", type: "Diet", time: "Morning", category: "Nutrition", icon: "restaurant" },
    { name: "Omega-3", type: "Fatty Acid", time: "Morning", category: "Supplements", icon: "pill" },
    { name: "HIIT Session", type: "Cardio", time: "Mid-day", category: "Exercise", icon: "fitness_center" },
    { name: "Berberine", type: "Metabolic", time: "Mid-day", category: "Supplements", icon: "pill" },
    { name: "HRV Breathing", type: "Relaxation", time: "Evening", category: "Lifestyle", icon: "potted_plant" },
    { name: "Magnesium", type: "Mineral", time: "Night", category: "Supplements", icon: "pill" },
    { name: "Sleep Protocol", type: "Hygiene", time: "Night", category: "Lifestyle", icon: "nights_stay" },
    { name: "L-Theanine", type: "Amino Acid", time: "Night", category: "Supplements", icon: "pill" },
  ];

  const variants = [
    { id: 'timeline', label: 'Timeline', icon: 'schedule' },
    { id: 'carousel', label: 'Carousel', icon: 'view_carousel' },
    { id: 'focus', label: 'Focus', icon: 'fullscreen' },
    { id: 'filter', label: 'Filter', icon: 'filter_alt' },
    { id: 'accordion', label: 'Expand', icon: 'expand' }
  ];

  return (
    <div className="bg-background text-foreground font-main h-screen flex justify-center overflow-hidden">
      <main className="w-full max-w-[430px] h-full bg-background flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Nav */}
        <nav className="px-8 pt-12 pb-4 flex justify-between items-center z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
            EXIT DEMO
          </button>
          <div className="text-right">
             <p className="text-[10px] font-black tracking-widest text-primary uppercase">Lab Preview</p>
          </div>
        </nav>

        {/* Variant Selector */}
        <div className="px-6 pb-6 z-20">
          <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800/50 gap-1 overflow-x-auto no-scrollbar backdrop-blur-md">
            {variants.map(v => (
              <button
                key={v.id}
                onClick={() => setActiveVariant(v.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all whitespace-nowrap ${
                  activeVariant === v.id 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--brand-color),0.4)]' 
                    : 'text-muted-foreground hover:bg-zinc-800'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{v.icon}</span>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Area */}
        <div className="flex-1 overflow-hidden relative px-6">
          <AnimatePresence mode="wait">
            {activeVariant === 'timeline' && <TimelineVariant key="timeline" items={protocolData} />}
            {activeVariant === 'carousel' && <CarouselVariant key="carousel" items={protocolData} />}
            {activeVariant === 'focus' && <FocusVariant key="focus" items={protocolData} />}
            {activeVariant === 'filter' && <FilterVariant key="filter" items={protocolData} />}
            {activeVariant === 'accordion' && <AccordionVariant key="accordion" items={protocolData} />}
          </AnimatePresence>
        </div>

        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      </main>
    </div>
  );
};

// --- Variant 1: Timeline (Integrated Categories) ---
const TimelineVariant = ({ items }) => {
  const times = ["Morning", "Mid-day", "Evening", "Night"];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="h-full overflow-y-auto custom-scrollbar pr-2 pb-32"
    >
      <div className="relative border-l-2 border-zinc-800/50 ml-6 pl-10 space-y-12 pt-6">
        {times.map((time, idx) => {
            const timeItems = items.filter(i => i.time === time);
            if (timeItems.length === 0) return null;
            return (
                <div key={idx} className="relative">
                    {/* Time Marker */}
                    <div className="absolute -left-[54px] top-0 w-12 h-12 bg-background border border-zinc-800 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-primary text-lg">
                            {time === 'Morning' ? 'wb_sunny' : time === 'Mid-day' ? 'light_mode' : time === 'Evening' ? 'dark_mode' : 'nights_stay'}
                        </span>
                    </div>

                    <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.3em] mb-8 ml-2 flex items-center gap-3">
                        {time}
                        <span className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></span>
                    </h3>

                    <div className="space-y-4">
                        {timeItems.map((item, i) => (
                            <div key={i} className="group relative">
                                {/* Connection Pin */}
                                <div className="absolute -left-[50px] top-1/2 -translate-y-1/2 w-4 h-px bg-zinc-800" />
                                
                                <div className="p-6 bg-zinc-900/30 border border-zinc-800/40 rounded-[28px] flex items-center gap-5 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all shadow-sm">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                                        item.category === 'Supplements' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                        item.category === 'Exercise' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                        item.category === 'Nutrition' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                        'bg-purple-500/10 border-purple-500/20 text-purple-500'
                                    }`}>
                                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.category}</span>
                                        </div>
                                        <p className="text-[15px] font-black text-foreground tracking-tight">{item.name}</p>
                                    </div>
                                    <button className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:border-primary/50 group-hover:text-primary transition-all">
                                        <span className="material-symbols-outlined text-xl">radio_button_unchecked</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        })}
      </div>
    </motion.div>
  );
};

// --- Variant 2: Horizontal Carousel (Premium Sections) ---
const CarouselVariant = ({ items }) => {
  const categories = ["Supplements", "Exercise", "Nutrition", "Lifestyle"];
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full overflow-y-auto custom-scrollbar pt-4 pb-32"
    >
      <div className="space-y-10">
        {categories.map(cat => (
            <div key={cat} className="space-y-4">
                <div className="flex justify-between items-end px-2">
                    <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">{cat}</h3>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">Swipe →</span>
                </div>
                <div className="flex overflow-x-auto gap-4 py-2 no-scrollbar pl-2">
                    {items.filter(i => i.category === cat).map((item, i) => (
                        <div key={i} className="min-w-[160px] p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-[32px] flex flex-col items-center text-center group hover:bg-zinc-900 transition-all border-b-4 border-b-transparent hover:border-b-primary shadow-lg">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center mb-5 border border-zinc-800/80 shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                            </div>
                            <p className="text-[13px] font-black text-foreground leading-tight mb-2 h-8 flex items-center">{item.name}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.time}</p>
                        </div>
                    ))}
                    {items.filter(i => i.category === cat).length === 0 && (
                        <div className="min-w-[160px] p-6 bg-zinc-900/20 border border-zinc-800/30 rounded-[32px] flex flex-col items-center justify-center opacity-40">
                            <span className="material-symbols-outlined text-zinc-700 text-3xl mb-2">inventory_2</span>
                            <p className="text-[10px] font-bold uppercase">No Tasks</p>
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Variant 3: Focus Mode (Immersive Depth) ---
const FocusVariant = ({ items }) => {
  const [index, setIndex] = useState(0);
  const current = items[index];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="h-full flex flex-col justify-center items-center pb-20 pt-4"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Live Focus Session</span>
        </div>
        <p className="text-sm font-bold text-muted-foreground">{index + 1} of {items.length} Remaining</p>
      </div>

      <div className="relative w-full aspect-[4/5] perspective-[2000px]">
        {/* Background Stack Cards */}
        <div className="absolute top-4 left-4 right-4 bottom-[-16px] bg-zinc-900/50 border border-zinc-800/30 rounded-[48px] -z-10 scale-[0.94] blur-[1px]" />
        <div className="absolute top-8 left-8 right-8 bottom-[-32px] bg-zinc-900/30 border border-zinc-800/20 rounded-[48px] -z-20 scale-[0.88] blur-[2px]" />

        <AnimatePresence mode="popLayout">
            <motion.div
                key={index}
                initial={{ rotateX: 20, opacity: 0, y: 50 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                exit={{ x: -200, rotateZ: -10, opacity: 0, transition: { duration: 0.4 } }}
                className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-[48px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] p-12 flex flex-col items-center justify-between overflow-hidden"
            >
                {/* Visual Backdrop */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50" />
                
                <div className="relative z-10 w-28 h-28 rounded-[40px] bg-zinc-950 border border-zinc-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-5xl" style={{ filter: 'drop-shadow(0 0 15px rgba(var(--brand-color), 0.6))' }}>{current.icon}</span>
                </div>
                
                <div className="relative z-10 space-y-4">
                    <h4 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">{current.name}</h4>
                    <div className="flex gap-2 justify-center">
                        <span className="px-4 py-1.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-[10px] font-black text-primary uppercase tracking-widest">{current.category}</span>
                        <span className="px-4 py-1.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-[10px] font-black text-muted-foreground uppercase tracking-widest">{current.time}</span>
                    </div>
                </div>

                <div className="relative z-10 w-full space-y-4 mt-8">
                    <button 
                        onClick={() => setIndex((i) => (i + 1) % items.length)}
                        className="w-full py-5 bg-primary rounded-[32px] text-[12px] font-black text-white uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(var(--brand-color),0.3)] hover:scale-[1.02] transition-transform"
                    >
                        COMPLETE TASK
                    </button>
                    <button 
                        onClick={() => setIndex((i) => (i + 1) % items.length)}
                        className="w-full py-5 bg-zinc-950 border border-zinc-800 rounded-[32px] text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors"
                    >
                        RE-SCHEDULE
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3 mt-16">
        {items.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-primary' : 'w-1.5 bg-zinc-800 opacity-50'}`} />
        ))}
      </div>
    </motion.div>
  );
};

// --- Variant 4: Smart Filter (Adaptive List) ---
const FilterVariant = ({ items }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Supplements', 'Exercise', 'Nutrition', 'Lifestyle'];
  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
      className="h-full flex flex-col pt-4"
    >
      <div className="flex bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800/50 gap-1 overflow-x-auto no-scrollbar mb-8">
        {categories.map(c => (
            <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    filter === c 
                        ? 'bg-zinc-100 text-zinc-950 shadow-lg' 
                        : 'bg-transparent text-muted-foreground hover:bg-zinc-800'
                }`}
            >
                {c}
            </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-32">
        <div className="space-y-3">
            {filteredItems.map((item, i) => (
                <div key={i} className="p-5 bg-zinc-900/30 border border-zinc-800/40 rounded-[28px] flex items-center justify-between group hover:border-zinc-700 transition-all shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 shadow-inner group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm font-black text-foreground tracking-tight">{item.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                    item.category === 'Supplements' ? 'bg-amber-500' :
                                    item.category === 'Exercise' ? 'bg-blue-500' :
                                    item.category === 'Nutrition' ? 'bg-emerald-500' :
                                    'bg-purple-500'
                                }`} />
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.time}</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 transition-colors">
                        <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Variant 5: Accordion (Expand/Collapse) ---
const AccordionVariant = ({ items }) => {
    const [expanded, setExpanded] = useState('Supplements');
    const categories = ["Supplements", "Exercise", "Nutrition", "Lifestyle"];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="h-full overflow-y-auto custom-scrollbar pt-4 pb-32 pr-2"
        >
            <div className="space-y-4">
                {categories.map((cat, idx) => {
                    const isOpen = expanded === cat;
                    const catItems = items.filter(i => i.category === cat);
                    
                    return (
                        <div 
                            key={idx} 
                            className={`rounded-[32px] border transition-all duration-500 overflow-hidden ${
                                isOpen ? 'bg-zinc-900/40 border-zinc-700/50 shadow-xl' : 'bg-zinc-900/10 border-zinc-800/30'
                            }`}
                        >
                            <button 
                                onClick={() => setExpanded(isOpen ? null : cat)}
                                className="w-full p-6 flex justify-between items-center"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                                        isOpen ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(var(--brand-color),0.3)]' : 'bg-zinc-950 text-muted-foreground border-zinc-800'
                                    }`}>
                                        <span className="material-symbols-outlined text-xl">
                                            {cat === 'Supplements' ? 'pill' : cat === 'Exercise' ? 'fitness_center' : cat === 'Nutrition' ? 'restaurant' : 'potted_plant'}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">{cat}</h3>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{catItems.length} Tasks</p>
                                    </div>
                                </div>
                                <span className={`material-symbols-outlined transition-transform duration-500 text-muted-foreground ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                                    expand_more
                                </span>
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 pt-2 space-y-3">
                                            {catItems.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-2xl">
                                                    <span className="text-sm font-bold text-foreground/80">{item.name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[9px] font-black text-muted-foreground uppercase opacity-40">{item.time}</span>
                                                        <div className="w-6 h-6 rounded-full border border-zinc-800" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default DemoActionPlan;
