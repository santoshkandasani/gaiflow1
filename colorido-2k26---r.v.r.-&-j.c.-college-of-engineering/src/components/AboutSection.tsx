import React from 'react';
import { Award, BookOpen, Users, Compass, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Images & Visual Badges */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl group">
            <img
              src="/campus.jpg"
              alt="RVR&JC College Campus"
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Overlaid Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-amber-500/30">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                R.V.R. & J.C. College of Engineering
              </p>
              <p className="text-sm font-semibold text-white mt-0.5">
                (Autonomous) • Chowdavaram, Guntur, AP
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Sponsored by Nagarjuna Education Society • Affiliated to Acharya Nagarjuna University
              </p>
            </div>
          </div>

          {/* Floating Accreditations Pill */}
          <div className="absolute -top-4 -right-2 sm:-right-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-4 py-2 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>NAAC A+ GRADE • NBA ACCREDITED</span>
          </div>
        </div>

        {/* Right Side: Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT THE FEST</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            The Pinnacle of <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Collegiate Talent & Sportsmanship
            </span>
          </h2>

          {/* Mandatory exact quote */}
          <blockquote className="p-4 rounded-2xl bg-slate-900/90 border-l-4 border-amber-400 text-slate-200 text-sm sm:text-base italic leading-relaxed shadow-sm">
            "COLORIDO 2K26 is a national-level cultural and sports celebration bringing together students from different institutions to showcase creativity, talent, teamwork and sporting spirit."
          </blockquote>

          <p className="text-sm text-slate-300 leading-relaxed">
            Hosted biennially at the sprawling 37-acre campus of <strong className="text-white">R.V.R. & J.C. College of Engineering (Autonomous)</strong>, COLORIDO stands as one of South India's most anticipated collegiate spectacles. With world-class auditoriums, open-air amphitheatres, and floodlit sports facilities, our festival fosters healthy inter-college competition, camaraderie, and artistic brilliance.
          </p>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cultural Events</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Music bands, solo/group dance, Choreoday, dramatics, fashion runway, and literary debates.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Sports Events</h4>
                <p className="text-xs text-slate-400 mt-1">
                  High-stakes Basketball, Volleyball, Throwball, TenniKoit, and Table Tennis championships.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Student Participation</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Dedicated portals for RVR&JC internal students & visiting external contingents.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Inter-college Competition</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Fair play, certified external jury panels, rolling trophies, and merit certificates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
