import React, { useState, useEffect } from 'react';
import { EventItem, Announcement, ResultItem, GalleryItem, Registration } from './types/index.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroCarousel } from './components/HeroCarousel.tsx';
import { StatsBanner } from './components/StatsBanner.tsx';
import { FeaturedEvents } from './components/FeaturedEvents.tsx';
import { CulturalEvents } from './components/CulturalEvents.tsx';
import { SportsEvents } from './components/SportsEvents.tsx';
import { EventModal } from './components/EventModal.tsx';
import { PortalModal } from './components/PortalModal.tsx';
import { StudentProfileModal } from './components/StudentProfileModal.tsx';
import { AdminDashboardPage } from './components/AdminDashboardPage.tsx';
import { ScheduleSection } from './components/ScheduleSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { AnnouncementsSection } from './components/AnnouncementsSection.tsx';
import { ResultsSection } from './components/ResultsSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { CheckCircle2, Sparkles, AlertCircle, RefreshCw, Trophy } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'main' | 'admin'>('main');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalStudentType, setPortalStudentType] = useState<'internal' | 'external' | null>(null);
  const [preSelectedEvent, setPreSelectedEvent] = useState<EventItem | null>(null);
  const [detailsModalEvent, setDetailsModalEvent] = useState<EventItem | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileQuery, setProfileQuery] = useState('');

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const [eventsRes, annRes, resultsRes, galleryRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/announcements'),
        fetch('/api/results'),
        fetch('/api/gallery'),
      ]);

      if (!eventsRes.ok) throw new Error('Could not load events data');

      const eventsData = await eventsRes.json();
      const annData = await annRes.json();
      const resultsData = await resultsRes.json();
      const galleryData = await galleryRes.json();

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setAnnouncements(Array.isArray(annData) ? annData : []);
      setResults(Array.isArray(resultsData) ? resultsData : []);
      setGallery(Array.isArray(galleryData) ? galleryData : []);
    } catch (err: any) {
      console.error('Data loading error:', err);
      setFetchError(err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Check URL hash
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (currentView === 'admin' && window.location.hash !== '#admin') {
        setCurrentView('main');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter((ev) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ev.title.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q) ||
      (ev.subcategory && ev.subcategory.toLowerCase().includes(q)) ||
      ev.short_desc.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q)
    );
  });

  const handleOpenPortal = (event?: EventItem, type?: 'internal' | 'external') => {
    setPreSelectedEvent(event || null);
    setPortalStudentType(type || null);
    setPortalOpen(true);
  };

  const handleOpenProfile = (queryTerm?: string) => {
    setProfileQuery(queryTerm || '');
    setProfileModalOpen(true);
  };

  const handleViewDetails = (event: EventItem) => {
    setDetailsModalEvent(event);
  };

  const handleRegistrationSuccess = (reg: Registration) => {
    setToastMessage(`Registration ${reg.registration_id} recorded for ${reg.student_name}!`);
    setTimeout(() => setToastMessage(null), 5000);
    // Reload events to keep counts in sync
    fetchData();
  };

  // If in dedicated Admin Dashboard view
  if (currentView === 'admin') {
    return (
      <AdminDashboardPage
        onBackToSite={() => {
          setCurrentView('main');
          window.location.hash = '';
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-emerald-950/95 border border-emerald-400/50 shadow-2xl text-emerald-200 text-xs sm:text-sm flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-right duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white">Registration Recorded</p>
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Transparent / Glass Navbar */}
      <Navbar
        onOpenPortal={() => handleOpenPortal()}
        onOpenProfile={() => handleOpenProfile()}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = 'admin';
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            const el = document.getElementById('events');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <main className="flex-1">
        {/* Full-Screen Campus Hero Carousel */}
        <HeroCarousel onOpenPortal={() => handleOpenPortal()} />

        {/* Quick Highlights / Stats Strip */}
        <StatsBanner onOpenPortal={() => handleOpenPortal()} />

        {/* Error / Loading Indicators if any */}
        {fetchError && (
          <div className="max-w-4xl mx-auto my-8 p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{fetchError}. Backend API is re-syncing database.</span>
            </div>
            <button
              onClick={fetchData}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Search Results Notification Banner (if searching) */}
        {searchQuery.trim() && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between text-xs sm:text-sm">
              <p className="text-slate-300">
                Showing results matching "<strong className="text-amber-400">{searchQuery}</strong>" ({filteredEvents.length} competitions found)
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-amber-400 font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Section 7: Featured Events immediately below hero */}
        <FeaturedEvents
          events={filteredEvents}
          onViewDetails={handleViewDetails}
          onRegister={(ev) => handleOpenPortal(ev)}
          onExploreAll={() => {
            const el = document.getElementById('cultural-events');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <div id="events" />

        {/* Section 8: All Cultural Events */}
        <CulturalEvents
          events={filteredEvents}
          onViewDetails={handleViewDetails}
          onRegister={(ev) => handleOpenPortal(ev)}
        />

        {/* Section 9: DEDICATED SPORTS EVENTS (Boys & Girls Divisions) */}
        <SportsEvents
          events={filteredEvents}
          onViewDetails={handleViewDetails}
          onRegister={(ev) => handleOpenPortal(ev)}
        />

        {/* Section 22: About COLORIDO & R.V.R. & J.C. College */}
        <AboutSection />

        {/* Section 23: Schedule & Timeline */}
        <ScheduleSection />

        {/* Section 21: Gallery */}
        <GallerySection items={gallery} />

        {/* Section 19: Announcements */}
        <AnnouncementsSection announcements={announcements} />

        {/* Section 20: Results */}
        <ResultsSection results={results} />

        {/* Section 24: Contact Organizers with SQLite Form */}
        <ContactSection />
      </main>

      {/* Section 25: Official Footer */}
      <Footer
        onOpenPortal={() => handleOpenPortal()}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = 'admin';
        }}
      />

      {/* Event Details Modal */}
      <EventModal
        event={detailsModalEvent}
        onClose={() => setDetailsModalEvent(null)}
        onRegister={(ev) => {
          setDetailsModalEvent(null);
          handleOpenPortal(ev);
        }}
      />

      {/* Sign In & Participant Portal Modal (Sections 11, 12, 13, 14, 15) */}
      <PortalModal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
        events={events}
        preSelectedEvent={preSelectedEvent}
        initialStudentType={portalStudentType}
        onRegistrationSuccess={handleRegistrationSuccess}
        onOpenProfile={(query) => handleOpenProfile(query)}
      />

      {/* Dedicated Student Profile Modal (Track Registrations for Internal & External Students) */}
      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onRegisterMore={(studentType) => handleOpenPortal(undefined, studentType)}
        initialQuery={profileQuery}
      />
    </div>
  );
}
