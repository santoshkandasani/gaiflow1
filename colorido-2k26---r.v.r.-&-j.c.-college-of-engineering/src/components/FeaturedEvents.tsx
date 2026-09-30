import React from 'react';
import { EventItem } from '../types/index.ts';
import { EventCard } from './EventCard.tsx';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedEventsProps {
  events: EventItem[];
  onViewDetails: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
  onExploreAll: () => void;
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  events,
  onViewDetails,
  onRegister,
  onExploreAll,
}) => {
  const featured = events.filter((e) => e.is_featured === 1);

  return (
    <section id="featured-events" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVER COLORIDO 2K26</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Featured <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Events</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
            Highlighting our premier cultural and sporting battles taking place on October 9, 2026 across RVR&JC College campus.
          </p>
        </div>

        <button
          onClick={onExploreAll}
          className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-yellow-300 transition-colors group"
        >
          <span>View All 16+ Competitions</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Modern Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {featured.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onViewDetails={onViewDetails}
            onRegister={onRegister}
          />
        ))}
      </div>
    </section>
  );
};
