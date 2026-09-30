import React, { useState } from 'react';
import { EventItem } from '../types/index.ts';
import { EventCard } from './EventCard.tsx';
import { Sparkles, Music, Palette, BookOpen, Film, Crown } from 'lucide-react';

interface CulturalEventsProps {
  events: EventItem[];
  onViewDetails: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
}

export const CulturalEvents: React.FC<CulturalEventsProps> = ({
  events,
  onViewDetails,
  onRegister,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const culturalEvents = events.filter((e) => e.category === 'Cultural');

  const filteredEvents = culturalEvents.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'music') return e.id.includes('music');
    if (filter === 'dance') return e.id.includes('dance') || e.id.includes('choreo');
    if (filter === 'drama') return e.id.includes('dramatics') || e.id.includes('fashion');
    if (filter === 'arts') return e.id.includes('fine') || e.id.includes('tekraft') || e.id.includes('literary');
    return true;
  });

  return (
    <section id="cultural-events" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPRESSION & CREATIVITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Cultural <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Extravaganza</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            From the thunder of live rock bands and expressive dance choreographies to theatrical drama and fine arts exhibitions.
          </p>

          {/* Sub-filter tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Cultural Events' },
              { id: 'music', label: 'Music & Band' },
              { id: 'dance', label: 'Dance & Choreoday' },
              { id: 'drama', label: 'Dramatics & Fashion' },
              { id: 'arts', label: 'Fine Arts, Tekraft & Literary' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Cultural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onViewDetails}
              onRegister={onRegister}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
