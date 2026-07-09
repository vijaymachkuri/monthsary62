'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export default function Hero() {
  const [hearts, setHearts] = useState<{id: number, x: number, y: number}[]>([]);
  let heartCounter = 0;

  const handleHeartClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Generate burst of hearts
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y
    }));
    
    setHearts(prev => [...prev, ...newHearts]);

    // Clean up after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 1000);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 text-glow">
          To My Forever<br />Favorite Person, Gem <span className="inline-block text-pink-400">❤️</span>
        </h1>
        <p className="text-xl md:text-2xl font-space text-pink-200/80 max-w-2xl mx-auto tracking-wide">
          You make every ordinary day feel magical.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1, type: "spring" }}
        className="relative"
      >
        <div 
          className="glass-strong p-12 rounded-full cursor-pointer group relative overflow-hidden transition-transform hover:scale-105 active:scale-95"
          onClick={handleHeartClick}
        >
          {/* Subtle glow behind heart */}
          <div className="absolute inset-0 bg-pink-500/20 blur-xl group-hover:bg-pink-500/30 transition-colors" />
          
          <Heart className="w-24 h-24 md:w-32 md:h-32 text-pink-400 fill-current heart-beat relative z-10 drop-shadow-[0_0_15px_rgba(255,182,193,0.6)]" />
          
          <AnimatePresence>
            {hearts.map(h => (
              <motion.div
                key={h.id}
                initial={{ x: h.x - 12, y: h.y - 12, scale: 0.5, opacity: 1 }}
                animate={{ 
                  x: h.x - 12 + (Math.random() - 0.5) * 150, 
                  y: h.y - 12 - 100 - Math.random() * 100, 
                  scale: 1.5, 
                  opacity: 0,
                  rotate: (Math.random() - 0.5) * 90
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute z-20 pointer-events-none text-pink-300"
              >
                <Heart className="w-6 h-6 fill-current" />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Sparkles on hover */}
          <Sparkles className="absolute top-8 right-8 w-6 h-6 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin-slow" />
          <Sparkles className="absolute bottom-8 left-8 w-5 h-5 text-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 animate-spin-slow" />
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 animate-bounce text-white/50 text-sm font-space uppercase tracking-widest flex flex-col items-center"
      >
        <span>Scroll to continue</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent mt-2" />
      </motion.div>
    </section>
  );
}
