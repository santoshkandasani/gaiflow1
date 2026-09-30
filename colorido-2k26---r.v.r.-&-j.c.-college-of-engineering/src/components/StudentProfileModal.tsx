import React, { useState, useEffect } from 'react';
import { EventItem, Registration } from '../types/index.ts';
import {
  X,
  User,
  School,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Printer,
  Trash2,
  PlusCircle,
  Bus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  QrCode,
  ArrowRight
} from 'lucide-react';

interface EnrichedRegistration extends Registration {
  event_venue?: string;
  event_date?: string;
  event_time?: string;
  event_category?: string;
}

interface StudentProfile {
  student_name: string;
  student_type: 'internal' | 'external';
  roll_number?: string | null;
  college_name: string;
  department: string;
  year: string;
  section?: string | null;
  email: string;
  phone: string;
  bus_required: number;
  bus_time?: string | null;
  registrations: EnrichedRegistration[];
}

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterMore: (studentType: 'internal' | 'external') => void;
  initialQuery?: string;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  onRegisterMore,
  initialQuery = '',
}) => {
  const [queryType, setQueryType] = useState<'internal' | 'external'>('internal');
  const [internalInput, setInternalInput] = useState('');
  const [externalInput, setExternalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activePass, setActivePass] = useState<EnrichedRegistration | null>(null);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setCancelNotice(null);
      if (initialQuery.trim()) {
        fetchStudentProfile(initialQuery.trim());
      }
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const fetchStudentProfile = async (queryTerm: string) => {
    if (!queryTerm.trim()) {
      setErrorMsg('Please enter your lookup details.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/student/lookup?query=${encodeURIComponent(queryTerm.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No registrations found for this student');
      }
      setProfile(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not find registrations.');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = queryType === 'internal' ? internalInput : externalInput;
    fetchStudentProfile(query);
  };

  const handleCancelRegistration = async (regId: string | number) => {
    if (!window.confirm('Are you sure you want to cancel this event registration?')) return;
    try {
      const res = await fetch(`/api/student/registrations/${regId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cancellation failed');

      setCancelNotice(`Registration ${regId} has been cancelled.`);
      setTimeout(() => setCancelNotice(null), 4000);

      // Refresh profile
      if (profile) {
        const remaining = profile.registrations.filter(r => r.registration_id !== regId && r.id !== regId);
        if (remaining.length === 0) {
          setProfile(null);
        } else {
          setProfile({ ...profile, registrations: remaining });
        }
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Student Portal & Registration Tracking
              </h3>
              <p className="text-[11px] text-amber-400 font-semibold">
                R.V.R. & J.C. College of Engineering (Autonomous)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-100">
          {cancelNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{cancelNotice}</span>
            </div>
          )}

          {!profile ? (
            /* Student Sign-In / Lookup Screen (matches reference picture Sign-In Portal) */
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  STUDENT ACCESS PORTAL
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Track Your Registrations
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-300">
                  Access your delegate passes, venue instructions, and registered sports & cultural competitions.
                </p>
              </div>

              {/* Toggle Cards: Internal Student vs External Student */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setQueryType('internal')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                    queryType === 'internal'
                      ? 'bg-amber-950/30 border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${queryType === 'internal' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Internal Student</h4>
                    <p className="text-xs text-slate-300 mt-0.5">R.V.R. & J.C. College Roll Number</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setQueryType('external')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                    queryType === 'external'
                      ? 'bg-blue-950/30 border-blue-400 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${queryType === 'external' ? 'bg-blue-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">External Student</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Visiting College Email or Reg ID</p>
                  </div>
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form depending on selected type */}
              <form onSubmit={handleLookupSubmit} className="space-y-4 pt-2">
                {queryType === 'internal' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                      Enter RVR&JC Roll Number or Registered Email *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Y21CS124 or sravan.v@rvrjcce.ac.in"
                        value={internalInput}
                        onChange={(e) => setInternalInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm uppercase focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Demo Internal accounts: <span className="font-mono text-amber-300">Y21CS124</span> or <span className="font-mono text-amber-300">Y22ME089</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-300 mb-1.5">
                      Enter External Email, Phone, or Registration ID *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. deepika.reddy@vrsec.ac.in or CLR26-0002"
                        value={externalInput}
                        onChange={(e) => setExternalInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Demo External accounts: <span className="font-mono text-blue-300">CLR26-0002</span> or <span className="font-mono text-blue-300">deepika.reddy@vrsec.ac.in</span>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl hover:shadow-amber-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? 'Finding Records...' : 'View My Registrations & Passes'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* Student Profile Dashboard View */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Profile Card Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-700 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">{profile.student_name}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          profile.student_type === 'internal'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {profile.student_type.toUpperCase()} STUDENT
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-300 mt-1">
                      {profile.college_name}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                      {profile.roll_number && (
                        <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">
                          Roll: {profile.roll_number}
                        </span>
                      )}
                      <span>{profile.department} ({profile.year})</span>
                      <span>•</span>
                      <span>{profile.email}</span>
                    </div>

                    {profile.student_type === 'external' && profile.bus_required === 1 && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/40 text-[11px] font-bold text-blue-300">
                        <Bus className="w-3.5 h-3.5 text-blue-400" />
                        <span>Complimentary Bus Transit: {profile.bus_time} Slot Allocated</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  <button
                    onClick={() => setProfile(null)}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Switch Account
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onRegisterMore(profile.student_type);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs shadow hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Register Another Event</span>
                  </button>
                </div>
              </div>

              {/* Registered Events Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>My Registered Events ({profile.registrations.length})</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    Festival Date: October 9, 2026
                  </span>
                </div>

                <div className="space-y-3">
                  {profile.registrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                            {reg.registration_id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              reg.event_category === 'Cultural'
                                ? 'bg-purple-900/60 text-purple-300'
                                : 'bg-emerald-900/60 text-emerald-300'
                            }`}
                          >
                            {reg.event_category || 'Event'}
                          </span>
                          <span className="text-xs text-slate-400">
                            Mode: <strong className="text-slate-200">{reg.participation_type}</strong>
                            {reg.team_name ? ` (${reg.team_name})` : ''}
                          </span>
                        </div>

                        <h5 className="text-base font-bold text-white pt-0.5">
                          {reg.event_name}
                        </h5>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {reg.event_date || 'October 9, 2026'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {reg.event_time || '10:00 AM – 5:00 PM'}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            {reg.event_venue || 'Campus Venue'}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons for this registration */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setActivePass(reg)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View / Print Pass</span>
                        </button>
                        <button
                          onClick={() => handleCancelRegistration(reg.registration_id)}
                          className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-colors"
                          title="Cancel Registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Single Pass Modal Preview */}
              {activePass && (
                <div className="p-6 rounded-3xl bg-slate-950 border-2 border-amber-400/50 shadow-2xl relative space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <img src="/college-logo.png" alt="RVR&JC Logo" className="w-9 h-9 object-contain" />
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase">
                          R.V.R. & J.C. College of Engineering (Autonomous)
                        </h4>
                        <p className="text-[10px] text-amber-400 font-bold uppercase">
                          COLORIDO 2K26 Official Delegate Pass
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActivePass(null)}
                      className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800"
                    >
                      Close Pass
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs py-2">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Delegate Name</span>
                      <span className="font-bold text-white text-sm">{activePass.student_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Registration ID</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">{activePass.registration_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Event Title</span>
                      <span className="font-bold text-white">{activePass.event_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Venue</span>
                      <span className="text-slate-200">{activePass.event_venue || 'Campus Venue'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Institution</span>
                      <span className="text-slate-200">{activePass.college_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Date & Time</span>
                      <span className="text-slate-200">October 9, 2026 (10 AM - 5 PM)</span>
                    </div>
                    {activePass.bus_required === 1 && (
                      <div className="col-span-2">
                        <span className="text-blue-300 text-[10px] block">Bus Transport Slot</span>
                        <span className="text-blue-200 font-bold">{activePass.bus_time} Scheduled Coach</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      ✓ Validated Official Entry Pass • Free Participation
                    </span>
                    <button
                      onClick={handlePrint}
                      className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Pass</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
