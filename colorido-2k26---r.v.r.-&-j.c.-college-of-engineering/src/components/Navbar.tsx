import React, { useState, useEffect } from 'react';
import { Search, LogIn, Menu, X, Shield, Calendar, Sparkles, User, Trophy, BarChart3 } from 'lucide-react';

interface NavbarProps {
  onOpenPortal: (studentType?: 'internal' | 'external') => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPortal,
  onOpenProfile,
  onOpenAdmin,
  onSearchChange,
  searchQuery,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Featured', href: '#featured-events' },
    { name: 'Cultural', href: '#cultural-events' },
    { name: 'Sports Events', href: '#sports', highlight: true },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Results', href: '#results' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 py-2.5 shadow-2xl'
          : 'bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Left: College Logo & Brand */}
          <a href="#home" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 p-1 border border-amber-400/40 shadow-lg shadow-amber-500/10 group-hover:border-amber-400 transition-colors flex items-center justify-center overflow-hidden">
              <img
                src="/college-logo.png"
                alt="R.V.R. & J.C. College Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="sr-only">RVR&JC Logo</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xs sm:text-sm tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
                R.V.R. & J.C.
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-amber-400/90 uppercase">
                College of Engineering <span className="text-slate-400 font-normal hidden sm:inline">(Autonomous)</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium hidden md:inline leading-none mt-0.5">
                COLORIDO 2K26 • Chowdavaram, Guntur
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  link.highlight
                    ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 hover:bg-emerald-900/60'
                    : 'text-slate-200 hover:text-amber-400 hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Input / Icon */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-slate-900/90 border border-amber-500/40 rounded-full px-3 py-1 text-xs">
                  <Search className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search events, dance, basketball..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent text-white placeholder-slate-400 focus:outline-none w-32 sm:w-44 text-xs"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      onSearchChange('');
                    }}
                    className="text-slate-400 hover:text-white ml-1 text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-900/60 rounded-full transition-colors"
                  title="Search Events"
                  aria-label="Search Events"
                >
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              )}
            </div>

            {/* Student Profile Button (Track Registrations) */}
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-slate-200 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Track registrations for Internal & External students"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">My Profile</span>
            </button>

            {/* Admin Dashboard Button */}
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-slate-300 hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Admin Dashboard (Counts, Details & CSV extraction)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Admin</span>
            </button>

            {/* Sign In / Register Button */}
            <button
              onClick={() => onOpenPortal()}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-950" />
              <span>Sign In</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white xl:hidden rounded-lg bg-slate-900/60 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-amber-500/30 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs shadow"
              >
                <User className="w-4 h-4 text-amber-400" />
                My Profile / Track Registrations
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-amber-400 font-semibold text-xs"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Admin Dashboard (Counts, Details & CSV)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm shadow-md"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Participant Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
