'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart } from 'lucide-react';

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setShowText(true), 1000); // Wait for paper slide animation
    }
  };

  return (
    <section className="py-24 relative z-10 px-4 flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-2xl relative"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-2">A Letter For You</h2>
          <p className="text-white/60 font-inter">Click the envelope to open</p>
        </div>

        {/* Envelope Container */}
        <div 
          className="relative w-full max-w-md mx-auto h-64 md:h-80 cursor-pointer perspective-[1000px]"
          onClick={handleOpen}
        >
          {/* Back of envelope */}
          <div className="absolute inset-0 bg-[#e0d5c1] rounded-lg shadow-xl" />
          
          {/* Letter inside */}
          <motion.div 
            className="absolute left-4 right-4 bottom-4 bg-[#fdfbf7] rounded shadow-sm p-6 md:p-8 flex flex-col z-10 overflow-hidden"
            initial={{ top: '20px' }}
            animate={{ 
              top: isOpen ? '-250px' : '20px',
              height: isOpen ? '500px' : 'auto',
              zIndex: isOpen ? 30 : 10
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ minHeight: '200px' }}
          >
            {showText && (
              <div className="font-playfair text-gray-800 h-full overflow-y-auto">
                <p className="text-lg md:text-xl font-bold mb-6">My Dearest Gem,</p>
                <div className="space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  <p>
                    Happy 62nd Monthsary! Looking back at the past 62 months, I am filled with so much gratitude and love for everything we have shared together.
                  </p>
                  <p>
                    You are my safe place, my greatest adventure, and my favorite part of every single day. 
                    I promise to always choose you, to hold your hand through the highs and lows, and to keep making you smile no matter what.
                  </p>
                  <p>
                    Thank you for being you, and thank you for being mine. I love you more than words can ever say.
                  </p>
                </div>
                <div className="mt-8 text-right font-bold text-lg">
                  <p>Forever Yours, Vijay ❤️</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Envelope Flap (Top) */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#f4ebd8] origin-top z-20"
            style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* Envelope Front (Bottom/Sides) */}
          <div 
            className="absolute inset-0 bg-[#ebdcc2] z-20 pointer-events-none rounded-lg"
            style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 50%)' }}
          />
          
          {/* Wax Seal */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div 
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-800 rounded-full z-30 flex items-center justify-center shadow-lg border-2 border-red-900"
              >
                <Heart className="w-6 h-6 text-red-300 fill-current" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt Icon */}
          {!isOpen && (
             <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -top-12 left-1/2 -translate-x-1/2 text-white/80"
             >
               <Mail className="w-8 h-8 drop-shadow-md" />
             </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
