import React, { useState } from 'react';
import healthData from '../data.json';

const ContributorDetail = ({ initialTab = 'positive', onBack }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const { contributors } = healthData.data;

    const getContributors = () => {
        return activeTab === 'positive' ? contributors.positive : contributors.negative;
    };

    return (
        <div className="bg-background-light text-slate-900 font-sans h-screen flex justify-center overflow-hidden">
            <main className="w-full max-w-[430px] h-full bg-[#FDFCFB] flex flex-col relative shadow-2xl">

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-8 pt-12 pb-8 custom-scrollbar relative z-10">
                    <nav className="flex justify-between items-center mb-12">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase hover:text-amber-600 transition-all group"
                        >
                            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
                            OVERVIEW
                        </button>
                    </nav>

                    <header className="mb-10">
                        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
                            System<br />Factors
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[95%] mb-12 font-medium">
                            Explore the core biometrics driving your health index. Optimizing these markers is the most efficient path to peak vitality.
                        </p>

                        {/* Tabs */}
                        <div className="flex gap-10 border-b border-slate-100 mb-8 items-center">
                            <button
                                onClick={() => setActiveTab('positive')}
                                className={`pb-5 text-[10px] font-black tracking-[0.25em] uppercase transition-all relative ${activeTab === 'positive' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                ROBUST
                                {activeTab === 'positive' && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 shadow-[0_4px_10px_rgba(230,126,34,0.3)]"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('negative')}
                                className={`pb-5 text-[10px] font-black tracking-[0.25em] uppercase transition-all relative ${activeTab === 'negative' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                ATTENTION
                                {activeTab === 'negative' && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 shadow-[0_4px_10px_rgba(230,126,34,0.3)]"></div>}
                            </button>
                        </div>
                    </header>

                    {/* Factor List */}
                    <div className="space-y-6">
                        {getContributors().map((item, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-7 relative border border-slate-50 shadow-[0_10px_30px_rgba(230,126,34,0.05)] transition-all hover:translate-y-[-2px] hover:shadow-[0_15px_40px_rgba(230,126,34,0.08)]">
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <h3 className="text-[9px] font-black tracking-[0.2em] text-amber-500/60 uppercase mb-2">{item.category}</h3>
                                        <h2 className="text-xl font-black text-slate-900">{item.display_name}</h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-slate-900 tracking-tight">{item.current_value}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.unit}</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                                    <p className="text-[11px] leading-relaxed text-slate-600 font-medium italic">
                                        "{item.inference}"
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center gap-3">
                                    <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-amber-500 shadow-[0_0_8px_rgba(230,126,34,0.3)] transition-all duration-1000 ${activeTab === 'positive' ? 'w-full' : 'w-1/3'}`}
                                            style={{ width: activeTab === 'positive' ? '100%' : '33%' }}
                                        ></div>
                                    </div>
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em]">Impact Level</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-40 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Footer info */}
                <div className="p-6 text-center border-t border-slate-50 bg-[#FDFCFB]/80 backdrop-blur-md relative z-20">
                    <p className="text-[8px] font-black text-slate-300 tracking-[0.4em] uppercase">SYSTEM_DIAGNOSTICS_SIGMA // SOLAR_VAR_A</p>
                </div>
            </main>
        </div>
    );
};

export default ContributorDetail;
