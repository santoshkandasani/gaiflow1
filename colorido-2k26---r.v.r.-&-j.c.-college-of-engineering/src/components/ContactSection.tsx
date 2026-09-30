import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccessMsg('Your inquiry has been received! Our organizing committee will contact you shortly.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit contact message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>GET IN TOUCH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Contact the <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Organizers</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Have questions regarding event guidelines, team contingent allowances, external bus pickup points, or festival schedules? Our student coordinators and faculty convenors are here to assist.
          </p>

          <div className="space-y-4 pt-2">
            {/* Address */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <h4 className="font-bold text-white">Campus Venue</h4>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  R.V.R. & J.C. College of Engineering (Autonomous)<br />
                  Chandramoulipuram, Chowdavaram,<br />
                  Guntur, Andhra Pradesh, India – 522019
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <h4 className="font-bold text-white">Festival Email</h4>
                <a
                  href="mailto:colorido@rvrjcce.ac.in"
                  className="text-amber-400 hover:underline block mt-0.5"
                >
                  colorido@rvrjcce.ac.in
                </a>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  General queries & sponsorship proposals
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <h4 className="font-bold text-white">Helpline Numbers</h4>
                <p className="text-slate-300 mt-0.5 font-mono">
                  +91 863 2288201 / 2288254
                </p>
                <p className="text-slate-400 text-xs font-mono mt-0.5">
                  Student Convener: +91 94401 23456
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Send us a Message
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Fill out the form below. Messages are recorded directly in our event coordinator database.
            </p>

            {successMsg && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bus Route or Event Rules"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you with COLORIDO 2K26 participation?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl hover:shadow-amber-500/25 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
