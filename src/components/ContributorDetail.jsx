import React, { useState } from 'react';
import healthData from '../data.json';

const ContributorDetail = ({ initialTab = 'positive', onBack }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const { contributors } = healthData.data;

    const getRankFromInference = (inference) => {
        const inf = inference.toLowerCase();
        if (inf.includes('optimal') || inf.includes('elite')) return 6;
        if (inf.includes('good') || inf.includes('robust')) return 5;
        if (inf.includes('normal') || inf.includes('stable')) return 4;
        if (inf.includes('low') || inf.includes('high') || inf.includes('constrained')) return 3;
        if (inf.includes('very low') || inf.includes('poor') || inf.includes('compromised')) return 2;
        return 4; // Default
    };

    const formatMarkerName = (name) => {
        const acronyms = ['TSH', 'HDL', 'LDL', 'ALT', 'AST', 'CRP', 'PSA', 'VO2'];
        const parts = name.split(/[\s_-]+/);

        return parts.map((part, index) => {
            const upper = part.toUpperCase();
            if (acronyms.includes(upper) || upper === 'HBA1C') {
                if (upper === 'HBA1C') return 'HbA1c';
                return upper;
            }
            if (index === 0) return part.toLowerCase();
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }).join('');
    };

    const getContributors = () => {
        if (activeTab === 'positive') return contributors.positive;
        if (activeTab === 'negative') return contributors.negative;

        // Mock "Watch Closely" markers
        return [
            { "display_name": "C-Reactive Protein", "current_value": 2.1, "unit": "mg/L", "inference": "Borderline High", "category": "Inflammation" },
            { "display_name": "Homocysteine", "current_value": 11.4, "unit": "µmol/L", "inference": "Optimal but rising", "category": "Heart" },
            { "display_name": "Uric Acid", "current_value": 6.8, "unit": "mg/dL", "inference": "Near threshold", "category": "Metabolic" }
        ];
    };

    return (
        <div className="bg-background text-foreground font-main h-screen flex justify-center overflow-hidden">
            <main className="w-full max-w-[430px] h-full bg-background flex flex-col relative shadow-2xl">

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-5 sm:px-8 pt-10 sm:pt-12 pb-8 custom-scrollbar relative z-10">
                    <nav className="flex justify-between items-center mb-8 sm:mb-12">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase hover:text-primary transition-all group"
                        >
                            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
                            OVERVIEW
                        </button>
                    </nav>

                    <header className="mb-8">
                        <h1 className="text-[22px] font-medium text-[#E4E4E7] mb-4 tracking-tight uppercase leading-tight font-heading">
                            System Factors
                        </h1>
                        <p className="text-[#A1A1AA] text-[12px] leading-relaxed max-w-[95%] mb-8 font-normal">
                            Explore the core biometrics driving your health index. Optimizing these markers is the most efficient path to peak vitality.
                        </p>

                        {/* Tabs */}
                        <div className="flex gap-8 sm:gap-10 border-b border-border mb-8 items-center">
                            <button
                                onClick={() => setActiveTab('positive')}
                                className={`pb-4 text-[10px] font-black tracking-[0.25em] uppercase transition-all relative ${activeTab === 'positive' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Working well
                                {activeTab === 'positive' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-md"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('watch')}
                                className={`pb-4 text-[10px] font-black tracking-[0.25em] uppercase transition-all relative ${activeTab === 'watch' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                WATCH
                                {activeTab === 'watch' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-md"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('negative')}
                                className={`pb-4 text-[10px] font-black tracking-[0.25em] uppercase transition-all relative ${activeTab === 'negative' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Needs attention
                                {activeTab === 'negative' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-md"></div>}
                            </button>
                        </div>
                    </header>

                    {/* Factor List */}
                    <div className="factor-grid">
                        {getContributors().map((item, idx) => {
                            const rank = getRankFromInference(item.inference);
                            const rankToken = `--rating-rank-${rank}`;

                            return (
                                <div key={idx} className="factor-card relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[7px] font-black tracking-[0.1em] text-primary opacity-60 uppercase mb-0.5 truncate font-heading">{item.category}</h3>
                                            <h2 className="text-xs sm:text-sm font-black text-foreground truncate font-heading leading-tight">{formatMarkerName(item.display_name)}</h2>
                                        </div>
                                    </div>

                                    <div className="text-left mb-2 sm:mb-3">
                                        <span className="text-lg sm:text-xl font-black text-foreground tracking-tight font-heading">{item.current_value}</span>
                                        <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{item.unit}</span>
                                    </div>

                                    <div className="inference-container">
                                        <p className="text-[8px] sm:text-[9px] leading-tight text-foreground opacity-80 font-medium italic">
                                            {item.inference}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4 flex items-center gap-2">
                                        <div className="h-1 flex-1 bg-zinc-800/50 rounded-full overflow-hidden">
                                            <div
                                                className="impact-bar h-full transition-all duration-1000"
                                                style={{
                                                    width: `${(rank / 6) * 100}%`,
                                                    backgroundColor: `rgb(var(${rankToken}))`,
                                                    boxShadow: `0 0 6px rgba(var(${rankToken}), 0.2)`
                                                }}
                                            ></div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>



                <style jsx>{`
                    .factor-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        grid-auto-rows: 1fr;
                        gap: 12px;
                    }

                    @media (min-width: 400px) {
                        .factor-grid {
                            gap: 16px;
                        }
                    }

                    .factor-card {
                        background: rgb(var(--card));
                        border: 1px solid rgb(var(--card-border));
                        border-radius: 16px;
                        padding: 12px;
                        box-shadow: var(--shadow-sm);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                    }

                    @media (min-width: 400px) {
                        .factor-card {
                            border-radius: 20px;
                            padding: 16px;
                        }
                    }

                    .factor-card:hover {
                        transform: translateY(-2px);
                        border-color: rgba(var(--brand-color), 0.3);
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                        background: rgb(var(--card));
                    }

                    .inference-container {
                        padding: 6px 8px;
                        border-radius: 10px;
                        background: rgba(var(--zinc-800), 0.3);
                        border: 1px solid rgba(var(--zinc-700), 0.2);
                        min-height: 2.2rem;
                        display: flex;
                        align-items: center;
                    }

                    @media (min-width: 400px) {
                        .inference-container {
                            padding: 8px 10px;
                            min-height: 2.8rem;
                        }
                    }

                    .impact-bar {
                        border-radius: inherit;
                    }

                    .custom-scrollbar::-webkit-scrollbar {
                        width: 0px;
                    }
                `}</style>
            </main>
        </div>
    );
};

export default ContributorDetail;
