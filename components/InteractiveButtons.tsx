'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Smile, Gift } from 'lucide-react';

export default function InteractiveButtons() {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const triggerEffect = (effectType: string) => {
    setActiveEffect(effectType);
    setTimeout(() => setActiveEffect(null), 3000);
  };

  const buttons = [
    { id: 'hug', label: 'Hug Me', icon: Heart, color: 'bg-pink-500/20 hover:bg-pink-500/40 border-pink-400' },
    { id: 'kiss', label: 'Kiss Me', icon: Heart, color: 'bg-red-500/20 hover:bg-red-500/40 border-red-400' },
    { id: 'smile', label: 'Smile', icon: Smile, color: 'bg-yellow-500/20 hover:bg-yellow-500/40 border-yellow-400' },
    { id: 'surprise', label: 'Surprise Me', icon: Gift, color: 'bg-purple-500/20 hover:bg-purple-500/40 border-purple-400' },
  ];

  return (
    <section className="py-24 relative z-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-playfair font-bold text-white mb-12"
        >
          Just Because...
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {buttons.map((btn, i) => {
            const Icon = btn.icon;
            return (
              <motion.button
                key={btn.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => triggerEffect(btn.id)}
                className={`glass border px-8 py-4 rounded-full flex items-center space-x-3 transition-colors ${btn.color}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-space font-medium">{btn.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Global Effects Layer */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {activeEffect === 'hug' && (
             <motion.div 
               key="hug-overlay"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.1 }}
               className="absolute inset-0 flex items-center justify-center bg-pink-500/20 backdrop-blur-sm"
             >
               <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ repeat: Infinity, duration: 1 }}
               >
                  <Heart className="w-48 h-48 text-pink-400 fill-current drop-shadow-2xl" />
               </motion.div>
             </motion.div>
          )}

          {activeEffect === 'kiss' && (
             Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`kiss-${i}`}
                  initial={{ 
                    opacity: 1, 
                    x: '50vw', 
                    y: '100vh',
                    scale: Math.random() * 2 + 1 
                  }}
                  animate={{ 
                    y: '-20vh',
                    x: `calc(50vw + ${(Math.random() - 0.5) * 60}vw)`,
                    opacity: 0,
                    rotate: (Math.random() - 0.5) * 90
                  }}
                  transition={{ duration: 2 + Math.random() * 1.5, ease: "easeOut" }}
                  className="absolute text-red-500 text-6xl drop-shadow-lg"
                >
                  💋
                </motion.div>
             ))
          )}

          {activeEffect === 'smile' && (
             Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{ 
                    opacity: 1, 
                    x: `${Math.random() * 100}vw`, 
                    y: `${Math.random() * 100}vh`,
                    scale: 0
                  }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    rotate: 180
                  }}
                  transition={{ duration: 1 + Math.random(), repeat: 2 }}
                  className="absolute text-yellow-300"
                >
                  <Sparkles className="w-8 h-8 fill-current" />
                </motion.div>
             ))
          )}

          {activeEffect === 'surprise' && (
             <motion.div 
               key="surprise-bg"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 flex items-center justify-center"
             >
                <motion.div
                  initial={{ y: 200, opacity: 0, rotate: -20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 200, opacity: 0, rotate: 20 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="bg-white text-black p-8 rounded-3xl shadow-2xl rotate-3"
                >
                  <h3 className="text-3xl font-playfair font-bold text-pink-600">I Love You!</h3>
                  <p className="font-space mt-2 text-gray-600">You are my greatest surprise.</p>
                </motion.div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
