import React from 'react';
import { Calendar, Users, Bus, Trophy, ShieldCheck, Sparkles } from 'lucide-react';

interface StatsBannerProps {
  onOpenPortal: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ onOpenPortal }) => {
  return (
    <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Stat 1 */}
          <div className="flex flex-col items-center justify-center p-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center mb-2 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">October 9, 2026</span>
            <span className="text-xs text-slate-400 font-medium">10:00 AM – 5:00 PM</span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mb-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">100% FREE</span>
            <span className="text-xs text-slate-400 font-medium">Zero Registration Fee</span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
            <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-400/30 flex items-center justify-center mb-2 text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">16+ Events</span>
            <span className="text-xs text-slate-400 font-medium">Cultural & Sports Battles</span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center mb-2 text-blue-400">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-amber-300">Free Bus Facility</span>
            <span className="text-xs text-slate-400 font-medium">For External College Students</span>
          </div>
        </div>

        {/* Quick Portal CTA banner */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Registrations active for both <strong className="text-white">Internal (RVR&JC)</strong> & <strong className="text-white">External</strong> college students.
            </p>
          </div>
          <button
            onClick={onOpenPortal}
            className="shrink-0 px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 hover:border-amber-400 text-xs font-bold transition-all"
          >
            Open Registration Portal →
          </button>
        </div>
      </div>
    </section>
  );
};
