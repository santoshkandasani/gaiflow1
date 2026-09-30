import React from 'react';
import { Calendar, Clock, MapPin, Bus, Trophy, Flag, Sparkles } from 'lucide-react';

export const ScheduleSection: React.FC = () => {
  const scheduleItems = [
    {
      time: '07:00 AM & 09:00 AM',
      title: 'External Student Bus Transit Arrivals',
      venue: 'College Main Campus Gate & SAC Plaza',
      desc: 'Arrival of complimentary special express buses from Guntur Bus Station & Vijayawada Benz Circle.',
      badge: 'Transport',
      icon: <Bus className="w-4 h-4 text-blue-400" />,
    },
    {
      time: '08:30 AM – 09:30 AM',
      title: 'Delegate Reporting & Chest Number Verification',
      venue: 'Silver Jubilee Block Registration Pavilion',
      desc: 'Internal and external participants verify registration IDs, collect delegate passes, and submit backing tracks.',
      badge: 'Check-In',
      icon: <Flag className="w-4 h-4 text-amber-400" />,
    },
    {
      time: '09:30 AM – 10:15 AM',
      title: 'Grand Inauguration Ceremony & Torch Relay',
      venue: 'Open Air Theatre (OAT)',
      desc: 'Inaugural address by dignitaries, lighting of the ceremonial Olympic-style torch, and festival anthem rendition.',
      badge: 'Ceremony',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    },
    {
      time: '10:30 AM – 01:00 PM',
      title: 'Morning Competitions: Prelims & Cultural Battles',
      venue: 'Auditorium, OAT, Floodlit Courts, Drawing Halls',
      desc: 'Basketball & Volleyball Knockout rounds; Battle of the Bands; Classical & Solo Dance heats; Fine Arts & Tekraft showcases.',
      badge: 'Competitions',
      icon: <Trophy className="w-4 h-4 text-emerald-400" />,
    },
    {
      time: '01:00 PM – 01:45 PM',
      title: 'Networking & Lunch Interval',
      venue: 'Central Student Canteen & Food Pavilions',
      desc: 'Delicious culinary stalls and refreshment zones open across the lush campus gardens.',
      badge: 'Break',
      icon: <Clock className="w-4 h-4 text-slate-400" />,
    },
    {
      time: '02:00 PM – 04:30 PM',
      title: 'Grand Finals: Choreoday, Slam Dunk & Volleyball Clash',
      venue: 'Main Open Stage & Sports Complex',
      desc: 'Thematic Choreoday dance battles, high-voltage Basketball & Volleyball championship finals, and Fashion Show runway.',
      badge: 'Finals',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
    },
    {
      time: '04:30 PM – 05:30 PM',
      title: 'Valedictory Ceremony & Grand Prize Distribution',
      venue: 'Main Open Air Theatre (OAT)',
      desc: 'Awarding of trophies, merit cash honours, overall championship rolling shield, and student concert.',
      badge: 'Valedictory',
      icon: <Sparkles className="w-4 h-4 text-yellow-400" />,
    },
    {
      time: '05:00 PM & 07:00 PM',
      title: 'External Return Express Buses Departure',
      venue: 'East Campus Bus Bay',
      desc: 'Return coaches departing to Guntur, Vijayawada, and Tenali transit hubs.',
      badge: 'Transport',
      icon: <Bus className="w-4 h-4 text-blue-400" />,
    },
  ];

  return (
    <section id="schedule" className="py-20 bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>FESTIVAL TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Schedule & <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Key Timings</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            A full day of electric performances, high-stakes athleticism, and cultural celebration on October 9, 2026.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-28 space-y-8">
          {scheduleItems.map((item, index) => (
            <div key={index} className="relative pl-6 sm:pl-8 group">
              {/* Dot Icon */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              {/* Time display for larger screens on left */}
              <div className="hidden sm:block absolute -left-28 top-1.5 w-24 text-right">
                <span className="text-xs font-bold text-amber-400 block leading-tight">
                  {item.time.split('&')[0]}
                </span>
              </div>

              {/* Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 transition-all shadow-md hover:shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs sm:hidden font-mono font-bold text-amber-400">
                    {item.time}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{item.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
