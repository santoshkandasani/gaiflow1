import React from 'react';
import { Announcement } from '../types/index.ts';
import { Bell, Calendar, AlertCircle, Info, Bus, Clock } from 'lucide-react';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ announcements }) => {
  const getBadgeStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'transport':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'schedule':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'transport':
        return <Bus className="w-4 h-4 text-blue-400" />;
      case 'schedule':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <section id="announcements" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>BULLETIN BOARD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Latest <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Announcements</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
            Important updates, reporting notices, transport instructions, and festival bulletins from the executive steering committee.
          </p>
        </div>
      </div>

      {/* Grid of Announcement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/40 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeStyle(
                    ann.category
                  )}`}
                >
                  {getIcon(ann.category)}
                  <span>{ann.category}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ann.date}</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">
                {ann.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {ann.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>COLORIDO Convenor Desk</span>
              <span className="text-amber-400 font-semibold">Official Notice</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
