import React from 'react';
import { EventItem } from '../types/index.ts';
import { X, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
  onRegister: (event: EventItem) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, onRegister }) => {
  if (!event) return null;

  const isCultural = event.category === 'Cultural';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-slate-100 flex flex-col">
        {/* Modal Header Image */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 overflow-hidden rounded-t-3xl">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Banner */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isCultural ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {event.category}
            </span>
            {event.subcategory && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-amber-300 border border-amber-400/30">
                {event.subcategory}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              FREE REGISTRATION
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Title and Short Overview */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{event.title}</h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              {event.full_desc || event.short_desc}
            </p>
          </div>

          {/* Key Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400 font-medium">Date</p>
                <p className="text-white font-semibold">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400 font-medium">Time</p>
                <p className="text-white font-semibold">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400 font-medium">Venue</p>
                <p className="text-white font-semibold truncate">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Eligibility
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              {event.eligibility}
            </p>
          </div>

          {/* Official Rules */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Event Rules & Guidelines
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {Array.isArray(event.rules) &&
                event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Instructions */}
          {event.instructions && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs sm:text-sm text-amber-200">
              <strong className="block text-amber-300 mb-1">Reporting Instructions:</strong>
              {event.instructions}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-3xl">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>Participation is 100% Free • No registration fee charged.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRegister(event);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Register for this Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
