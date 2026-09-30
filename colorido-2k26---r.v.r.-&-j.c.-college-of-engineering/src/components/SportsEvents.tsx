import React, { useState } from 'react';
import { EventItem } from '../types/index.ts';
import { EventCard } from './EventCard.tsx';
import { Trophy, Activity, Target, Shield, Flame, Users, Calendar, MapPin, Sparkles } from 'lucide-react';

interface SportsEventsProps {
  events: EventItem[];
  onViewDetails: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
}

export const SportsEvents: React.FC<SportsEventsProps> = ({
  events,
  onViewDetails,
  onRegister,
}) => {
  const [activeGender, setActiveGender] = useState<'All' | 'Boys' | 'Girls'>('All');

  const sportsEvents = events.filter((e) => e.category === 'Sports');

  const filteredSports = sportsEvents.filter((e) => {
    if (activeGender === 'All') return true;
    if (activeGender === 'Boys') return e.gender === 'Boys' || e.gender === 'All';
    if (activeGender === 'Girls') return e.gender === 'Girls' || e.gender === 'All';
    return true;
  });

  return (
    <section id="sports" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span>NATIONAL SPORTS ARENA 2K26</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Inter-College <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Sports Championships</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          State-of-the-art courts and synthetic complexes hosting high-octane collegiate tournaments on <strong className="text-white">October 9, 2026</strong>. Participation is 100% FREE for all colleges.
        </p>

        {/* Division Filter Tabs */}
        <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <button
            onClick={() => setActiveGender('All')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeGender === 'All'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Sports Competitions ({sportsEvents.length})
          </button>
          <button
            onClick={() => setActiveGender('Boys')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeGender === 'Boys'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Boys Division</span>
            <span className="text-[11px] opacity-80">(Basketball, Volleyball, Table Tennis)</span>
          </button>
          <button
            onClick={() => setActiveGender('Girls')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeGender === 'Girls'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Girls Division</span>
            <span className="text-[11px] opacity-80">(Throwball, TenniKoit, Table Tennis)</span>
          </button>
        </div>
      </div>

      {/* Grid of Sports Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredSports.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onViewDetails={onViewDetails}
            onRegister={onRegister}
          />
        ))}
      </div>

      {/* Sports Venue Facilities Callout */}
      <div className="mt-12 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">FIBA & VFI Standards</h4>
            <p className="text-slate-400 mt-0.5">Certified referees & official match balls</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Trophies & Merit Medals</h4>
            <p className="text-slate-400 mt-0.5">Overall rolling trophy for college champions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Contingent Facilities</h4>
            <p className="text-slate-400 mt-0.5">Locker rooms, sports medical team & free bus</p>
          </div>
        </div>
      </div>
    </section>
  );
};
