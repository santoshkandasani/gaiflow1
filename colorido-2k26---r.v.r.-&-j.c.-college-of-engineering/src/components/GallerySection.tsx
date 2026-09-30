import React, { useState } from 'react';
import { GalleryItem } from '../types/index.ts';
import { Image, X, ZoomIn, Sparkles, Filter } from 'lucide-react';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Opening Ceremony',
    'Cultural Events',
    'Sports Events',
    'Performances',
    'Campus',
    'Prize Distribution',
  ];

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-24 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Image className="w-3.5 h-3.5" />
            <span>FESTIVAL MEMORIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            COLORIDO <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Gallery</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            A glimpse into the energy, stage spectacles, athletic prowess, and celebrations at R.V.R. & J.C. College of Engineering.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-slate-950 border border-slate-800 hover:border-amber-400/60 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-slate-900/80 text-white">
                <ZoomIn className="w-4 h-4 text-amber-400" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 mt-1">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[70vh] bg-black flex items-center justify-center">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors border border-slate-700"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-slate-950">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  {selectedImage.category}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {selectedImage.title}
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  {selectedImage.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
