'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

export default function SurpriseEnding() {
  const [stage, setStage] = useState(0); // 0: initial, 1: dark with question, 2: celebration

  const handleReveal = () => setStage(1);
  const handleAccept = () => setStage(2);

  return (
    <section className="py-40 relative z-20 px-4 flex flex-col items-center justify-center min-h-screen">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="stage0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-4xl font-playfair text-white mb-8">
              I have one last question...
            </h2>
            <button
              onClick={handleReveal}
              className="glass border-pink-500/50 hover:bg-pink-500/20 text-white px-8 py-4 rounded-full font-space font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              Click Here ❤️
            </button>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020205] flex flex-col items-center justify-center px-4"
          >
            {/* Brighter background stars for this scene */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                      width: Math.random() * 4 + 1 + 'px',
                      height: Math.random() * 4 + 1 + 'px',
                      top: Math.random() * 100 + '%',
                      left: Math.random() * 100 + '%',
                      animationDuration: Math.random() * 2 + 1 + 's',
                      boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)'
                    }}
                  />
               ))}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="mb-12"
            >
              <Heart className="w-32 h-32 text-pink-500 fill-current heart-beat drop-shadow-[0_0_50px_rgba(236,72,153,1)]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-200 max-w-4xl leading-tight mb-16"
            >
              Will you continue making beautiful memories with me forever?
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <button
                onClick={handleAccept}
                className="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white px-12 py-4 rounded-full font-space font-bold tracking-widest text-xl transition-all hover:scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                YES ❤️
              </button>
              <button
                onClick={handleAccept}
                className="bg-pink-600 hover:bg-pink-500 text-white px-12 py-4 rounded-full font-space font-bold tracking-widest text-xl transition-all hover:scale-110 shadow-[0_0_30px_rgba(236,72,153,0.5)]"
              >
                ALWAYS ❤️
              </button>
            </motion.div>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Grand Celebration Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Confetti & Hearts */}
              {Array.from({ length: 150 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: '50vw', 
                    y: '100vh',
                    scale: Math.random() * 1.5 + 0.5,
                    opacity: 1
                  }}
                  animate={{ 
                    y: '-20vh',
                    x: `calc(50vw + ${(Math.random() - 0.5) * 100}vw)`,
                    opacity: 0,
                    rotate: Math.random() * 720
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 3, 
                    ease: "easeOut",
                    delay: Math.random() * 0.5 
                  }}
                  className={`absolute ${i % 3 === 0 ? 'text-pink-500' : i % 3 === 1 ? 'text-red-500' : 'text-yellow-400'}`}
                >
                  {i % 2 === 0 ? <Heart className="w-8 h-8 fill-current" /> : <div className="w-4 h-8 bg-current rotate-45" />}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, duration: 2 }}
              className="relative z-10 text-center bg-white/5 backdrop-blur-xl p-12 md:p-24 rounded-[3rem] border border-white/20 shadow-[0_0_100px_rgba(236,72,153,0.4)]"
            >
              <Heart className="w-24 h-24 text-pink-500 fill-current heart-beat mx-auto mb-8 drop-shadow-[0_0_30px_rgba(236,72,153,1)]" />
              <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
                I Love You.
              </h1>
              <p className="text-xl md:text-2xl font-space text-pink-200">
                To infinity and beyond.
              </p>
              
              <button 
                onClick={() => setStage(0)}
                className="mt-12 text-white/50 text-sm hover:text-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
