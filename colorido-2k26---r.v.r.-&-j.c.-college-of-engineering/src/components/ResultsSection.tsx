import React, { useState } from 'react';
import { ResultItem } from '../types/index.ts';
import { Trophy, Medal, Award, Sparkles, Activity } from 'lucide-react';

interface ResultsSectionProps {
  results: ResultItem[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Cultural' | 'Sports'>('All');

  const filteredResults = results.filter((res) => {
    if (activeCategory === 'All') return true;
    return res.category === activeCategory;
  });

  return (
    <section id="results" className="py-20 bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>HONOUR BOARD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Championship <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Results</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Celebrating triumphant collegiate contingents, individual champions, and podium finishers across Cultural and Sports arenas.
          </p>

          {/* Category Toggle */}
          <div className="mt-6 inline-flex p-1 rounded-full bg-slate-900 border border-slate-800">
            {(['All', 'Cultural', 'Sports'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Results' : `${cat} Events`}
              </button>
            ))}
          </div>
        </div>

        {/* Results Cards Grid (NO GIANT TABLE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between"
            >
              {/* Top Bar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.category === 'Cultural'
                        ? 'bg-purple-900/80 text-purple-200 border border-purple-500/30'
                        : 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/30'
                    }`}
                  >
                    {item.category}
                  </span>
                  {item.score_detail && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      {item.score_detail}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-4">
                  {item.event_name}
                </h3>

                {/* Winner Card */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-3">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Winner (1st Place)</span>
                  </div>
                  <p className="text-sm font-bold text-white leading-tight">
                    {item.winner}
                  </p>
                  <p className="text-xs text-amber-300/90 mt-0.5 font-medium">
                    {item.college_winner}
                  </p>
                </div>

                {/* Runner Up Card */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-wider mb-1">
                    <Medal className="w-4 h-4 text-slate-300" />
                    <span>Runner-Up (2nd Place)</span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-tight">
                    {item.runner_up}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.college_runner}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified by Jury Panel</span>
                <span className="text-amber-400 font-semibold">Trophy Awarded</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
