import React, { useState, useEffect } from 'react';
import { EventItem, Registration } from '../types/index.ts';
import {
  X,
  School,
  Building2,
  Bus,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowLeft,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  Hash,
  BookOpen,
  Users,
  ShieldCheck,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  preSelectedEvent?: EventItem | null;
  initialStudentType?: 'internal' | 'external' | null;
  onRegistrationSuccess?: (reg: Registration) => void;
  onOpenProfile?: (queryTerm?: string) => void;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  events,
  preSelectedEvent,
  initialStudentType,
  onRegistrationSuccess,
  onOpenProfile,
}) => {
  // Step 1: 'choose' | 'internal_form' | 'external_form' | 'success'
  const [step, setStep] = useState<'choose' | 'internal_form' | 'external_form' | 'success'>('choose');

  // Internal Student Form State
  const [internalForm, setInternalForm] = useState({
    student_name: '',
    roll_number: '',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    section: 'A',
    email: '',
    phone: '',
    event_id: preSelectedEvent ? preSelectedEvent.id : (events[0]?.id || ''),
    participation_type: 'Individual',
    team_name: '',
    team_size: '1',
    emergency_contact: '',
  });

  // External Student Form State
  const [externalForm, setExternalForm] = useState({
    student_name: '',
    college_name: '',
    department: '',
    year: '2nd Year',
    email: '',
    phone: '',
    event_id: preSelectedEvent ? preSelectedEvent.id : (events[0]?.id || ''),
    participation_type: 'Individual',
    team_name: '',
    team_size: '1',
    emergency_contact: '',
    bus_required: false,
    bus_time: '7:00 AM',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedReg, setConfirmedReg] = useState<Registration | null>(null);

  // Sync state if modal opens with preselection
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      if (initialStudentType === 'internal') {
        setStep('internal_form');
      } else if (initialStudentType === 'external') {
        setStep('external_form');
      } else {
        setStep('choose');
      }

      if (preSelectedEvent) {
        setInternalForm((prev) => ({ ...prev, event_id: preSelectedEvent.id }));
        setExternalForm((prev) => ({ ...prev, event_id: preSelectedEvent.id }));
      }
    }
  }, [isOpen, initialStudentType, preSelectedEvent]);

  if (!isOpen) return null;

  const handleSelectType = (type: 'internal' | 'external') => {
    setErrorMsg(null);
    if (type === 'internal') {
      setStep('internal_form');
    } else {
      setStep('external_form');
    }
  };

  const handleInternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!internalForm.student_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!internalForm.roll_number.trim()) {
      setErrorMsg('Please enter your college roll number.');
      return;
    }
    if (!internalForm.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!internalForm.phone.trim() || internalForm.phone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const selectedEvent = events.find((ev) => ev.id === internalForm.event_id);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_type: 'internal',
          student_name: internalForm.student_name,
          roll_number: internalForm.roll_number,
          college_name: 'R.V.R. & J.C. College of Engineering (Autonomous)',
          department: internalForm.department,
          year: internalForm.year,
          section: internalForm.section,
          email: internalForm.email,
          phone: internalForm.phone,
          event_id: internalForm.event_id,
          event_name: selectedEvent?.title || '',
          participation_type: internalForm.participation_type,
          team_name: internalForm.participation_type === 'Team' ? internalForm.team_name : null,
          team_size: internalForm.participation_type === 'Team' ? internalForm.team_size : 1,
          emergency_contact: internalForm.emergency_contact,
          bus_required: false,
          bus_time: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setConfirmedReg(data.registration);
      setStep('success');
      if (onRegistrationSuccess) {
        onRegistrationSuccess(data.registration);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while registering');
    } finally {
      setLoading(false);
    }
  };

  const handleExternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!externalForm.student_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!externalForm.college_name.trim()) {
      setErrorMsg('Please enter your College or Institution name.');
      return;
    }
    if (!externalForm.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!externalForm.phone.trim() || externalForm.phone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const selectedEvent = events.find((ev) => ev.id === externalForm.event_id);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_type: 'external',
          student_name: externalForm.student_name,
          roll_number: null,
          college_name: externalForm.college_name,
          department: externalForm.department,
          year: externalForm.year,
          section: null,
          email: externalForm.email,
          phone: externalForm.phone,
          event_id: externalForm.event_id,
          event_name: selectedEvent?.title || '',
          participation_type: externalForm.participation_type,
          team_name: externalForm.participation_type === 'Team' ? externalForm.team_name : null,
          team_size: externalForm.participation_type === 'Team' ? externalForm.team_size : 1,
          emergency_contact: externalForm.emergency_contact,
          bus_required: externalForm.bus_required,
          bus_time: externalForm.bus_required ? externalForm.bus_time : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setConfirmedReg(data.registration);
      setStep('success');
      if (onRegistrationSuccess) {
        onRegistrationSuccess(data.registration);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while registering');
    } finally {
      setLoading(false);
    }
  };

  const printPass = () => {
    window.print();
  };

  const handleResetForAnother = () => {
    setConfirmedReg(null);
    setStep('choose');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wider text-white uppercase">
                COLORIDO 2K26 PORTAL
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

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-100">
          {/* STEP 1: CHOOSE PARTICIPANT TYPE (SIGN IN SCREEN) */}
          {step === 'choose' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center max-w-md mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  SIGN IN / REGISTRATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Choose Participant Type
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300">
                  Please identify your student category below. Registrations are 100% Free with official participation certificates.
                </p>
              </div>

              {/* Selection Cards (Two Separate Portals) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                {/* Option 1: Internal Student */}
                <button
                  type="button"
                  onClick={() => handleSelectType('internal')}
                  className="group relative p-6 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900 border-2 border-slate-700 hover:border-amber-400 text-left transition-all hover:shadow-xl hover:shadow-amber-500/10 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                      <School className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      RVR&JC Students
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mt-1">
                      Internal Student
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      For registered students of R.V.R. & J.C. College of Engineering across B.Tech, M.Tech, MCA & MBA.
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>Enter Roll Number & Register</span>
                    <span>→</span>
                  </div>
                </button>

                {/* Option 2: External Student */}
                <button
                  type="button"
                  onClick={() => handleSelectType('external')}
                  className="group relative p-6 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900 border-2 border-slate-700 hover:border-blue-400 text-left transition-all hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                      Visiting Colleges
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mt-1">
                      External Student
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      For collegiate participants travelling from other institutions and universities across India.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/70 border border-blue-500/40 text-[11px] font-bold text-blue-300">
                      <Bus className="w-3.5 h-3.5" />
                      <span>Free Bus Facility Available</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-400">
                    <span>Select College & Bus</span>
                    <span>→</span>
                  </div>
                </button>
              </div>

              {/* Quick switch to Student Profile */}
              {onOpenProfile && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300">
                    Already registered for COLORIDO 2K26?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenProfile();
                    }}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    Track My Registration Profile →
                  </button>
                </div>
              )}

              {/* Free Notice */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Zero Registration Fees:</strong> COLORIDO 2K26 is fully sponsored. No entry fees or payment gateways.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2A: INTERNAL STUDENT FORM */}
          {step === 'internal_form' && (
            <form onSubmit={handleInternalSubmit} className="space-y-5 animate-in fade-in duration-200">
              {/* Back to selection */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Participant Type</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  INTERNAL STUDENT PORTAL
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sravan Kumar Varma"
                    value={internalForm.student_name}
                    onChange={(e) => setInternalForm({ ...internalForm, student_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Y21CS124"
                    value={internalForm.roll_number}
                    onChange={(e) => setInternalForm({ ...internalForm, roll_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm uppercase focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Department *
                  </label>
                  <select
                    value={internalForm.department}
                    onChange={(e) => setInternalForm({ ...internalForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Computer Science and Engineering">Computer Science & Eng (CSE)</option>
                    <option value="Electronics & Communication">Electronics & Comm (ECE)</option>
                    <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                    <option value="Civil Engineering">Civil Engineering (CE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Chemical Engineering">Chemical Engineering (ChE)</option>
                    <option value="AI & Data Science">AI & Data Science (AI&DS)</option>
                    <option value="CSBS">Computer Science & Business Systems</option>
                    <option value="Management & Sciences">Management & Sciences (MBA/MCA)</option>
                  </select>
                </div>

                {/* Year of Study */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Year of Study *
                  </label>
                  <select
                    value={internalForm.year}
                    onChange={(e) => setInternalForm({ ...internalForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Post Graduate">Post Graduate (PG)</option>
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A / B / C"
                    value={internalForm.section}
                    onChange={(e) => setInternalForm({ ...internalForm, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@rvrjcce.ac.in"
                    value={internalForm.email}
                    onChange={(e) => setInternalForm({ ...internalForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 XXXXX"
                    value={internalForm.phone}
                    onChange={(e) => setInternalForm({ ...internalForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Select Event */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Select Event Competition *
                  </label>
                  <select
                    value={internalForm.event_id}
                    onChange={(e) => setInternalForm({ ...internalForm, event_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border-2 border-amber-500/40 text-white font-medium text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <optgroup label="Featured Competitions">
                      {events
                        .filter((ev) => ev.is_featured === 1)
                        .map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            ★ {ev.title} ({ev.category} - {ev.subcategory || ev.gender})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Cultural Competitions">
                      {events
                        .filter((ev) => ev.category === 'Cultural' && ev.is_featured !== 1)
                        .map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title} ({ev.subcategory || 'Cultural'})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Sports Competitions">
                      {events
                        .filter((ev) => ev.category === 'Sports' && ev.is_featured !== 1)
                        .map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title} ({ev.gender} Division)
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {/* Team / Individual */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Participation Mode
                  </label>
                  <select
                    value={internalForm.participation_type}
                    onChange={(e) =>
                      setInternalForm({ ...internalForm, participation_type: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Individual">Individual Participant</option>
                    <option value="Team">Team Contingent</option>
                  </select>
                </div>

                {/* Team Name if Team */}
                {internalForm.participation_type === 'Team' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Team Name & Size
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Team Name"
                        value={internalForm.team_name}
                        onChange={(e) =>
                          setInternalForm({ ...internalForm, team_name: e.target.value })
                        }
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                      />
                      <input
                        type="number"
                        min="2"
                        max="20"
                        placeholder="Members"
                        value={internalForm.team_size}
                        onChange={(e) =>
                          setInternalForm({ ...internalForm, team_size: e.target.value })
                        }
                        className="w-20 px-2 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm text-center focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Emergency Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Parent / Guardian Contact"
                      value={internalForm.emergency_contact}
                      onChange={(e) =>
                        setInternalForm({ ...internalForm, emergency_contact: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Free Fee Indicator & Submit */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    College: <strong className="text-white">R.V.R. & J.C. College of Engineering</strong> • Fee: <strong className="text-emerald-400">FREE</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl hover:shadow-amber-500/25 disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? 'Submitting Registration...' : 'Complete Internal Registration'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2B: EXTERNAL STUDENT FORM (WITH BUS SELECTION) */}
          {step === 'external_form' && (
            <form onSubmit={handleExternalSubmit} className="space-y-5 animate-in fade-in duration-200">
              {/* Back to selection */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Participant Type</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  EXTERNAL STUDENT PORTAL
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deepika Reddy"
                    value={externalForm.student_name}
                    onChange={(e) => setExternalForm({ ...externalForm, student_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* College Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Your College / Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VR Siddhartha, Bapatla Engg, JNTU..."
                    value={externalForm.college_name}
                    onChange={(e) => setExternalForm({ ...externalForm, college_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Course / Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Course / Branch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech ECE / B.Tech CSE / B.Com"
                    value={externalForm.department}
                    onChange={(e) => setExternalForm({ ...externalForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={externalForm.year}
                    onChange={(e) => setExternalForm({ ...externalForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="deepika@college.edu"
                    value={externalForm.email}
                    onChange={(e) => setExternalForm({ ...externalForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94401 XXXXX"
                    value={externalForm.phone}
                    onChange={(e) => setExternalForm({ ...externalForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Select Event */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                    Select Event Competition *
                  </label>
                  <select
                    value={externalForm.event_id}
                    onChange={(e) => setExternalForm({ ...externalForm, event_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border-2 border-blue-500/40 text-white font-medium text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  >
                    <optgroup label="Featured Competitions">
                      {events
                        .filter((ev) => ev.is_featured === 1)
                        .map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            ★ {ev.title} ({ev.category} - {ev.subcategory || ev.gender})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Cultural Competitions">
                      {events
                        .filter((ev) => ev.category === 'Cultural' && ev.is_featured !== 1)
                        .map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title} ({ev.subcategory || 'Cultural'})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Sports Competitions">
                      {events
                        .filter((ev) => ev.category === 'Sports' && ev.is_featured !== 1)
                        .map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.title} ({ev.gender} Division)
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {/* Participation Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Participation Mode
                  </label>
                  <select
                    value={externalForm.participation_type}
                    onChange={(e) =>
                      setExternalForm({ ...externalForm, participation_type: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Individual">Individual Participant</option>
                    <option value="Team">Team Contingent</option>
                  </select>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Parent / Faculty Guide Contact"
                    value={externalForm.emergency_contact}
                    onChange={(e) =>
                      setExternalForm({ ...externalForm, emergency_contact: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Team Details if Team */}
                {externalForm.participation_type === 'Team' && (
                  <div className="sm:col-span-2 flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Team Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Titans of BEC"
                        value={externalForm.team_name}
                        onChange={(e) =>
                          setExternalForm({ ...externalForm, team_name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div className="w-28">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Team Size
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="20"
                        placeholder="Size"
                        value={externalForm.team_size}
                        onChange={(e) =>
                          setExternalForm({ ...externalForm, team_size: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm text-center focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* EXTERNAL BUS MANAGEMENT (SECTION 14 SPECIFICALLY REQUIRED) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Bus className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      External Student Bus Transportation Facility
                    </h4>
                    <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">
                      Bus facility available for external students only on October 9, 2026. Free transit service connecting Guntur Railway/Bus Station and Vijayawada Benz Circle to RVR&JC Campus.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-blue-300 block mb-1">
                      Do you require College Bus Transportation?
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setExternalForm({ ...externalForm, bus_required: true })}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          externalForm.bus_required
                            ? 'bg-blue-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white'
                        }`}
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        onClick={() => setExternalForm({ ...externalForm, bus_required: false })}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          !externalForm.bus_required
                            ? 'bg-slate-700 text-white shadow-md'
                            : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white'
                        }`}
                      >
                        NO
                      </button>
                    </div>
                  </div>

                  {/* If YES: Show Bus Timing Options */}
                  {externalForm.bus_required && (
                    <div className="animate-in fade-in duration-200">
                      <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
                        Select Bus Slot Timing *
                      </label>
                      <select
                        value={externalForm.bus_time}
                        onChange={(e) =>
                          setExternalForm({ ...externalForm, bus_time: e.target.value })
                        }
                        className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-blue-400/60 text-white text-xs font-semibold focus:outline-none"
                      >
                        <optgroup label="Morning Pickups to Campus">
                          <option value="7:00 AM">7:00 AM (Morning Pickup)</option>
                          <option value="9:00 AM">9:00 AM (Morning Pickup)</option>
                        </optgroup>
                        <optgroup label="Evening Returns from Campus">
                          <option value="5:00 PM">5:00 PM (Evening Return)</option>
                          <option value="7:00 PM">7:00 PM (Evening Return)</option>
                        </optgroup>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Free Fee Indicator & Submit */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    National Event • Registration: <strong className="text-emerald-400">FREE</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500 text-white font-black text-sm shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? 'Submitting Registration...' : 'Complete External Registration'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESSFUL REGISTRATION SCREEN WITH PRINTABLE PASS */}
          {step === 'success' && confirmedReg && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Top Success Badge */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  CONFIRMATION VERIFIED
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Registration Successful!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Your entry has been securely registered in the COLORIDO 2K26 database.
                </p>
              </div>

              {/* Printable Official Pass Card */}
              <div
                id="printable-confirmation-pass"
                className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
              >
                {/* Crest and Title */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/college-logo.png"
                      alt="RVR&JC"
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
                        R.V.R. & J.C. College of Engineering
                      </h4>
                      <p className="text-[10px] sm:text-xs text-amber-400 font-bold uppercase">
                        COLORIDO 2K26 • Official Delegate Pass
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Registration ID</span>
                    <span className="text-sm sm:text-base font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      {confirmedReg.registration_id}
                    </span>
                  </div>
                </div>

                {/* Participant Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Participant Name</span>
                    <span className="text-base font-bold text-white">{confirmedReg.student_name}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Affiliation / College</span>
                    <span className="text-white font-semibold">{confirmedReg.college_name}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Registered Event</span>
                    <span className="text-amber-300 font-bold text-sm">{confirmedReg.event_name}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Participant Type</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                        confirmedReg.student_type === 'internal'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {confirmedReg.student_type.toUpperCase()} STUDENT
                    </span>
                  </div>

                  {confirmedReg.roll_number && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Roll Number</span>
                      <span className="font-mono text-white">{confirmedReg.roll_number}</span>
                    </div>
                  )}

                  {confirmedReg.department && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Department / Year</span>
                      <span className="text-white">
                        {confirmedReg.department} ({confirmedReg.year})
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block text-[11px]">Email & Contact</span>
                    <span className="text-white">
                      {confirmedReg.email} • {confirmedReg.phone}
                    </span>
                  </div>

                  {/* Bus information if external */}
                  {confirmedReg.student_type === 'external' && (
                    <div className="sm:col-span-2 p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-blue-200">
                          Bus Transportation: {confirmedReg.bus_required ? 'REQUIRED' : 'NOT REQUIRED'}
                        </span>
                      </div>
                      {confirmedReg.bus_required === 1 && confirmedReg.bus_time && (
                        <span className="px-2 py-0.5 rounded bg-blue-500 text-slate-950 font-bold text-[11px]">
                          Slot: {confirmedReg.bus_time}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Event Schedule Strip */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      October 9, 2026
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      10:00 AM – 5:00 PM
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold">✓ ENTRY FEE: FREE</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetForAnother}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    + Register Another Event
                  </button>

                  {onOpenProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenProfile(confirmedReg.roll_number || confirmedReg.registration_id || confirmedReg.email);
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 font-bold text-xs transition-colors"
                    >
                      View in My Profile →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={printPass}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
