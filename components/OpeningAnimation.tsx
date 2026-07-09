'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

export default function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Black screen (1s)
    // Stage 1: Tiny glowing heart (2s)
    // Stage 2: "Every love story is beautiful..." (3s)
    // Stage 3: "...but ours is my favorite." (3s)
    // Stage 4: "Happy 62nd Monthsary ❤️" (3s)
    // Stage 5: Explosion (1.5s) -> complete

    const sequence = [
      { delay: 1000, nextStage: 1 },
      { delay: 2000, nextStage: 2 },
      { delay: 3500, nextStage: 3 },
      { delay: 3500, nextStage: 4 },
      { delay: 3500, nextStage: 5 },
      { delay: 2000, nextStage: 6 },
    ];

    let timeoutIds: NodeJS.Timeout[] = [];
    let cumulativeDelay = 0;

    sequence.forEach((step) => {
      cumulativeDelay += step.delay;
      const id = setTimeout(() => {
        setStage(step.nextStage);
        if (step.nextStage === 6) {
          onComplete();
        }
      }, cumulativeDelay);
      timeoutIds.push(id);
    });

    return () => timeoutIds.forEach(clearTimeout);
  }, [onComplete]);

  if (stage === 6) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div
            key="heart"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-pink-400"
          >
            <Heart className="w-12 h-12 fill-current heart-beat drop-shadow-[0_0_15px_rgba(255,182,193,0.8)]" />
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
            key="text1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="text-2xl md:text-4xl font-playfair text-white font-light text-center px-4 tracking-wide"
          >
            Every love story is beautiful...
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div
            key="text2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="text-2xl md:text-4xl font-playfair text-white font-light text-center px-4 tracking-wide"
          >
            ...but ours is my favorite.
          </motion.div>
        )}

        {stage === 4 && (
          <motion.div
            key="text3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-6xl font-playfair text-pink-300 font-bold text-center px-4 text-glow"
          >
            Happy 62nd Monthsary, Gem <span className="inline-block heart-beat">❤️</span>
          </motion.div>
        )}

        {stage === 5 && (
          <motion.div
            key="explosion"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 0.8, 50], opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-pink-500"
          >
            <Heart className="w-24 h-24 fill-current drop-shadow-[0_0_30px_rgba(255,182,193,1)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explosion particles */}
      {stage === 5 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: '50vw', 
                y: '50vh',
                scale: Math.random() * 0.5 + 0.2,
                opacity: 1
              }}
              animate={{
                x: `calc(50vw + ${(Math.random() - 0.5) * 100}vw)`,
                y: `calc(50vh + ${(Math.random() - 0.5) * 100}vh)`,
                opacity: 0,
                rotate: Math.random() * 360
              }}
              transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
              className="absolute text-pink-400"
            >
              <Heart className="w-8 h-8 fill-current" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
