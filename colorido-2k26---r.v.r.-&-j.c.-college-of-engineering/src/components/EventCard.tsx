import React from 'react';
import { EventItem } from '../types/index.ts';
import { Calendar, Clock, MapPin, Sparkles, Trophy, Music, Palette, Activity, Target, Film, BookOpen, Crown, Cpu, Flame, Shield, Users, ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onViewDetails: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails, onRegister }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Music': return <Music className="w-4 h-4" />;
      case 'Palette': return <Palette className="w-4 h-4" />;
      case 'Trophy': return <Trophy className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'Target': return <Target className="w-4 h-4" />;
      case 'Film': return <Film className="w-4 h-4" />;
      case 'Crown': return <Crown className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const isCultural = event.category === 'Cultural';

  return (
    <div className="group relative flex flex-col bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-400/60 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 transform hover:-translate-y-1">
      {/* Event Image Banner with Badge */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md backdrop-blur-md ${
              isCultural
                ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40'
                : 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/40'
            }`}
          >
            {getIcon(event.icon_name)}
            <span>{event.category}</span>
          </span>

          {/* Subcategory or Gender Badge */}
          {(event.subcategory || event.gender) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
              {event.subcategory || event.gender}
            </span>
          )}
        </div>

        {/* Floating Free Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400 text-slate-950 shadow-md">
            FREE ENTRY
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {event.title}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {event.short_desc}
          </p>

          {/* Date, Time, Venue Pills */}
          <div className="mt-4 space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2.5">
          {/* Rules / Details Button */}
          <button
            onClick={() => onViewDetails(event)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors border border-slate-700 hover:border-slate-600 text-center"
          >
            Rules & Details
          </button>

          {/* Register Button -> Navigates to Sign In portal */}
          <button
            onClick={() => onRegister(event)}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1"
          >
            <span>Register Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
