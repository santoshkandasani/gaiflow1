import React from 'react';
import { Sparkles, MapPin, Mail, Phone, ExternalLink, Shield } from 'lucide-react';

interface FooterProps {
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPortal, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-amber-400/50 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/college-logo.png"
                  alt="R.V.R. & J.C. College Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-wider uppercase">
                  COLORIDO 2K26
                </h3>
                <p className="text-xs text-amber-400 font-bold uppercase">
                  National Cultural & Sports Fest
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              <strong className="text-white">R.V.R. & J.C. College of Engineering (Autonomous)</strong>
              <br />
              Sponsored by Nagarjuna Education Society
              <br />
              Affiliated to Acharya Nagarjuna University, Guntur, AP.
            </p>

            <div className="pt-2 text-[11px] text-slate-500 space-y-0.5">
              <p>• Accredited by NAAC with 'A+' Grade</p>
              <p>• NBA Accredited Programmes & NIRF Ranked Institution</p>
              <p>• Established in 1985 • Celebrating Academic Excellence</p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-amber-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#featured-events" className="hover:text-amber-400 transition-colors">
                  Featured Events
                </a>
              </li>
              <li>
                <a href="#cultural-events" className="hover:text-amber-400 transition-colors">
                  Cultural Competitions
                </a>
              </li>
              <li>
                <a href="#sports-events" className="hover:text-amber-400 transition-colors">
                  Sports Arena
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About COLORIDO
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-amber-400 transition-colors">
                  Festival Schedule
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-400 transition-colors">
                  Photo Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">
                  Contact Organizers
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Participation & Transport */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Registration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPortal}
                  className="text-left text-amber-400 hover:text-yellow-300 font-semibold"
                >
                  Sign In / Register Portal
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="text-left hover:text-white"
                >
                  Internal Student Portal (RVR&JC)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="text-left hover:text-white"
                >
                  External Student Portal
                </button>
              </li>
              <li>
                <a href="#schedule" className="hover:text-white">
                  Bus Routes (7:00 AM, 9:00 AM, 5:00 PM, 7:00 PM)
                </a>
              </li>
              <li>
                <a href="#announcements" className="hover:text-white">
                  Announcements & Notices
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-white">
                  Podium Results
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-left text-slate-500 hover:text-amber-400 flex items-center gap-1 mt-2"
                >
                  <Shield className="w-3 h-3" />
                  <span>Faculty / Admin Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Campus Coordinates */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Venue
            </h4>
            <p className="text-xs leading-relaxed text-slate-300">
              R.V.R. & J.C. College of Engineering<br />
              Chandramoulipuram, Chowdavaram,<br />
              Guntur - 522019, Andhra Pradesh
            </p>
            <div className="text-xs space-y-1 pt-1 text-slate-400">
              <p>Email: <a href="mailto:colorido@rvrjcce.ac.in" className="text-amber-400 hover:underline">colorido@rvrjcce.ac.in</a></p>
              <p>Tel: +91 863 2288201</p>
              <p className="text-emerald-400 font-semibold">Entry: FREE for all collegiate participants</p>
            </div>
          </div>
        </div>

        {/* Bottom Strip with Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            © 2026 COLORIDO 2K26. All rights reserved. R.V.R. & J.C. College of Engineering.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <a href="#home" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#home" className="hover:text-white transition-colors">Code of Conduct</a>
            <span>•</span>
            <button onClick={onOpenAdmin} className="text-amber-400 hover:underline">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
