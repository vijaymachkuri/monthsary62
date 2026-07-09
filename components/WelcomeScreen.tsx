'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Lock } from 'lucide-react';

export default function WelcomeScreen({ children }: { children: React.ReactNode }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '0905') {
      setIsUnlocked(true);
      setShowSplash(true);
      
      // Keep the splash screen for 3.5 seconds before fading out to the main content
      setTimeout(() => {
        setShowSplash(false);
      }, 3500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPasscode('');
    }
  };

  if (isUnlocked && !showSplash) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-inter aurora-bg overflow-hidden">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md px-4"
          >
            <div className="glass rounded-3xl p-8 md:p-10 border border-white/20 text-center shadow-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner border border-white/20">
                  <Lock className="w-8 h-8 text-pink-300" />
                </div>
                
                <h1 className="text-2xl font-playfair font-bold text-white mb-2">
                  Enter your monthsary date ddyy format
                </h1>
                <p className="text-white/60 text-sm mb-8">
                  This memory is locked for Jay and Gem only.
                </p>

                <form onSubmit={handleSubmit}>
                  <motion.div
                    animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="••••"
                      maxLength={4}
                      className="w-full text-center tracking-[1em] text-2xl font-bold bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all placeholder:text-white/20"
                      autoFocus
                    />
                  </motion.div>
                  
                  {error && (
                    <p className="text-red-300 text-sm mt-3 animate-pulse">
                      Incorrect passcode, please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
                  >
                    Unlock <Heart className="w-4 h-4 fill-current" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center text-center px-4"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-24 h-24 text-pink-400 fill-pink-400 drop-shadow-[0_0_30px_rgba(244,114,182,0.6)] mb-8" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-200 drop-shadow-sm mb-4">
              Hey Jay and Gem
            </h1>
            <p className="text-xl md:text-2xl text-pink-100/80 font-light tracking-wide">
              Welcome to your memories...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
