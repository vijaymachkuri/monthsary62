'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  if (isTouch || !visible) return null;

  return (
    <>
      {/* Small trail hearts */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-3 h-3 pointer-events-none z-[99] text-pink-300 mix-blend-screen drop-shadow-[0_0_5px_rgba(255,182,193,0.8)]"
          animate={{
            x: position.x - 6,
            y: position.y - 6,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 200 - (i * 30), 
            damping: 15 + (i * 2), 
            mass: 0.8 
          }}
        >
          <Heart className="w-full h-full fill-current" />
        </motion.div>
      ))}

      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[100] text-pink-400 mix-blend-screen"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: clicked ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <Heart className="w-full h-full fill-current" />
      </motion.div>
      
      {/* Click Explosion */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            key="click-effect"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-12 h-12 rounded-full border-2 border-pink-300 pointer-events-none z-[99]"
            style={{
              x: position.x - 24,
              y: position.y - 24,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
