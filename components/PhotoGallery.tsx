'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Images are now fetched dynamically

export default function PhotoGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then(data => {
        if (data.photos) setImages(data.photos);
      })
      .catch(err => console.error('Failed to fetch photos', err));
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };
  
  const handleClose = () => setSelectedImage(null);

  return (
    <section className="py-24 relative z-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4"
          >
            Our Memories
          </motion.h2>
          <p className="text-white/60 font-inter">A glimpse into our beautiful journey.</p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden glass border-white/20 p-2 cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src={src}
                  alt={`Memory ${index + 1}`}
                  width={800}
                  height={800}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={handleClose}
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-10 h-10 md:w-16 md:h-16" />
            </button>

            <motion.div 
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden flex justify-center items-center"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage]}
                alt={`Memory ${selectedImage + 1}`}
                width={1200}
                height={1200}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <button 
              className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors"
              onClick={handleNext}
            >
              <ChevronRight className="w-10 h-10 md:w-16 md:h-16" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
