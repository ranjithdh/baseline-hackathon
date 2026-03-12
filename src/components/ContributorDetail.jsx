import React, { useState } from 'react';
import healthData from '../data.json';

const ContributorDetail = ({ initialTab = 'positive', onBack }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const { contributors } = healthData.data;

    const getContributors = () => {
        return activeTab === 'positive' ? contributors.positive : contributors.negative;
    };

    return (
        <div className="bg-background text-foreground font-main h-screen flex justify-center overflow-hidden">
            <main className="w-full max-w-[430px] h-full bg-background flex flex-col relative shadow-2xl">

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-8 pt-12 pb-8 custom-scrollbar relative z-10">
                    <nav className="flex justify-between items-center mb-12">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase hover:text-primary transition-all group"
                        >
                            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
                            OVERVIEW
                        </button>
                    </nav>

                    <header className="mb-10">
                        <h1 className="text-5xl font-black text-foreground mb-4 tracking-tighter uppercase leading-none font-heading">
                            System<br />Factors
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-[95%] mb-12 font-medium">
                            Explore the core biometrics driving your health index. Optimizing these markers is the most efficient path to peak vitality.
                        </p>

                        {/* Tabs */}
                        <div className="flex gap-10 border-b border-border mb-8 items-center">
                            <button
                                onClick={() => setActiveTab('positive')}
                                className={`pb-5 text-[10px] font-black tracking-[0.25em] uppercase transition-all relative ${activeTab === 'positive' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                ROBUST
                                {activeTab === 'positive' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-md"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('negative')}
                                className={`pb-5 text-[10px] font-black tracking-[0.25em] uppercase transition-all relative ${activeTab === 'negative' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                ATTENTION
                                {activeTab === 'negative' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-md"></div>}
                            </button>
                        </div>
                    </header>

                    {/* Factor List */}
                    <div className="space-y-6">
                        {getContributors().map((item, idx) => (
                            <div key={idx} className="bg-card rounded-3xl p-7 relative border border-border shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg">
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <h3 className="text-[9px] font-black tracking-[0.2em] text-primary opacity-60 uppercase mb-2 font-heading">{item.category}</h3>
                                        <h2 className="text-xl font-black text-foreground font-heading">{item.display_name}</h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-foreground tracking-tight font-heading">{item.current_value}</div>
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.unit}</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-muted border border-border">
                                    <p className="text-[11px] leading-relaxed text-foreground opacity-80 font-medium italic">
                                        "{item.inference}"
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center gap-3">
                                    <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-primary shadow-sm transition-all duration-1000 ${activeTab === 'positive' ? 'w-full' : 'w-1/3'}`}
                                            style={{ width: activeTab === 'positive' ? '100%' : '33%' }}
                                        ></div>
                                    </div>
                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.1em]">Impact Level</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-40 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Footer info */}
                <div className="p-6 text-center border-t border-border bg-background/80 backdrop-blur-md relative z-20">
                    <p className="text-[8px] font-black text-muted-foreground tracking-[0.4em] uppercase">SYSTEM_DIAGNOSTICS_SIGMA // SOLAR_VAR_A</p>
                </div>
            </main>
        </div>
    );
};

export default ContributorDetail;
