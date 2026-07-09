'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const notes = [
  "I miss you.",
  "You are my safe place.",
  "I'll always choose you.",
  "Forever starts every day.",
  "You're my favorite thought.",
  "I love your smile.",
];

export default function LoveNotes() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {notes.map((note, index) => {
        // Generate random positions that stay within reasonable bounds
        const top = 15 + Math.random() * 70; // 15% to 85%
        const left = 5 + Math.random() * 80; // 5% to 85%
        const rotate = (Math.random() - 0.5) * 30; // -15deg to 15deg
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.8, scale: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 1, delay: Math.random() * 2 }}
            className="absolute bg-yellow-100/90 backdrop-blur-sm p-4 shadow-lg shadow-black/10 max-w-[150px]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: `rotate(${rotate}deg)`,
              borderBottomRightRadius: '20px 5px',
            }}
          >
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-6 h-3 bg-red-400/30 rounded-full blur-[1px] -translate-y-1" /> {/* Tape effect */}
            <p className="font-playfair text-gray-800 text-sm italic">{note}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
