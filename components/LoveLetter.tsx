'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart } from 'lucide-react';
import { getMonthsaryCount, getOrdinalSuffix } from '@/lib/utils';

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [letterBody, setLetterBody] = useState<string>('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.settings && data.settings.letterBody) {
          setLetterBody(data.settings.letterBody);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

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
                <div className="space-y-4 text-base md:text-lg leading-relaxed opacity-90">
                  {letterBody ? (
                    letterBody.split('\n').map((paragraph, index) => {
                      if (!paragraph.trim()) return null;
                      
                      const parsedText = paragraph
                        .replace(/{MONTH_COUNT}/g, getOrdinalSuffix(getMonthsaryCount()).toString())
                        .replace(/{MONTHS}/g, getMonthsaryCount().toString());

                      // Custom styling for Greeting and Signoff
                      if (index === 0) {
                        return <p key={index} className="text-lg md:text-xl font-bold mb-6">{parsedText}</p>;
                      }
                      if (index === letterBody.split('\n').filter(p => p.trim()).length - 1) {
                        return (
                          <div key={index} className="mt-8 text-right font-bold text-lg">
                            <p>{parsedText}</p>
                          </div>
                        );
                      }

                      return <p key={index}>{parsedText}</p>;
                    })
                  ) : (
                    <p>Loading your beautiful letter...</p>
                  )}
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
