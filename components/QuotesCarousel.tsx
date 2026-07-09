'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from 'lucide-react';

const quotes = [
  "I look at you and see the rest of my life in front of my eyes.",
  "I swear I couldn't love you more than I do right now, and yet I know I will tomorrow.",
  "You are my today and all of my tomorrows.",
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  "If I know what love is, it is because of you."
];

export default function QuotesCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 relative z-10 px-4">
      <div className="max-w-4xl mx-auto text-center relative h-48 md:h-64 flex flex-col items-center justify-center">
        <Quote className="w-12 h-12 md:w-16 md:h-16 text-pink-500/30 absolute top-0 -translate-y-1/2" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <p className="text-2xl md:text-4xl font-playfair italic text-white/90 leading-relaxed">
              "{quotes[index]}"
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-12 space-x-3">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-pink-400 w-8' : 'bg-white/20 hover:bg-white/40'}`}
              aria-label={`Go to quote ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
