import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, Trophy, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface HeroCarouselProps {
  onOpenPortal: () => void;
}

interface Slide {
  id: number;
  badge: string;
  heading: string;
  subtitle: string;
  description: string;
  bgImage: string;
  highlightText: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onOpenPortal }) => {
  const slides: Slide[] = [
    {
      id: 1,
      badge: 'NATIONAL CULTURAL & SPORTS FEST',
      heading: 'COLORIDO 2K26',
      subtitle: 'National Cultural & Sports Fest',
      description:
        'Experience a celebration of creativity, talent, sportsmanship and culture at R.V.R. & J.C. College of Engineering. Bringing together collegiate champions from across the nation.',
      bgImage: '/campus.jpg',
      highlightText: 'October 9, 2026 • Chowdavaram, Guntur'
    },
    {
      id: 2,
      badge: 'CELEBRATE YOUR TALENT',
      heading: 'CULTURAL SPECTACLE',
      subtitle: 'Cultural Events',
      description:
        'Step onto grand stages: Music & Band, Solo & Group Dance, Choreoday, Dramatics, Fine Arts, Fashion Show, Tekraft, and Literary contests.',
      bgImage: '/colorido-poster.png',
      highlightText: '10+ Cultural Disciplines • Open Air Theatre'
    },
    {
      id: 3,
      badge: 'COMPETE. PERFORM. INSPIRE.',
      heading: 'CHAMPIONSHIP ARENA',
      subtitle: 'Sports & Cultural Events',
      description:
        'Feel the adrenaline in Basketball, Volleyball, Table Tennis, Throwball, and TenniKoit. Free bus facilities for external collegiate contingents.',
      bgImage: '/campus.jpg',
      highlightText: 'Boys & Girls Championships • Floodlit Grounds'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const activeSlide = slides[currentIndex];

  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Slides with Fade Transition */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img
            src={slide.bgImage}
            alt={slide.heading}
            className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-7000 ease-out"
          />
          {/* Deep modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/50 to-slate-950/90" />
          {/* Colorful subtle fest tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/30 via-transparent to-indigo-950/30 mix-blend-overlay" />
        </div>
      ))}

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-20 flex flex-col items-center">
        {/* Host Institution Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-400/40 shadow-xl mb-6 backdrop-blur-md animate-in fade-in zoom-in duration-500">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-amber-300 uppercase">
            R.V.R. & J.C. College of Engineering (Autonomous)
          </span>
        </div>

        {/* Small Fest Category Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{activeSlide.badge}</span>
        </div>

        {/* Big Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-2xl font-serif sm:font-sans">
          <span className="bg-gradient-to-r from-white via-amber-200 to-yellow-400 bg-clip-text text-transparent">
            {activeSlide.heading}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-lg sm:text-2xl md:text-3xl font-extrabold text-amber-400 tracking-wide drop-shadow-md">
          {activeSlide.subtitle}
        </p>

        {/* Description */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow">
          {activeSlide.description}
        </p>

        {/* Key Event Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 backdrop-blur-sm">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            October 9, 2026 • 10:00 AM – 5:00 PM
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            RVR&JC Campus, Guntur
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold backdrop-blur-sm">
            ✓ Registration: FREE
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Explore Events Button */}
          <a
            href="#featured-events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base border border-slate-700 hover:border-amber-400 shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </a>

          {/* Register Now Button (MUST take the user to the Sign In portal) */}
          <button
            onClick={onOpenPortal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105 active:scale-95 group"
          >
            <span>Register Now</span>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* Slider Controls: Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-slate-700/60 hover:border-amber-400 transition-all backdrop-blur-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-slate-700/60 hover:border-amber-400 transition-all backdrop-blur-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slider Controls: Bottom Indicator Dots & Pause/Play */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-slate-950/70 border border-slate-800/80 px-4 py-2 rounded-full backdrop-blur-md shadow-2xl">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-7 sm:w-8 h-2 bg-gradient-to-r from-amber-400 to-yellow-300'
                : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}

        <div className="h-3 w-px bg-slate-700 mx-1" />

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause Auto-slide' : 'Play Auto-slide'}
          className="text-slate-400 hover:text-amber-400 transition-colors p-1"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </section>
  );
};
