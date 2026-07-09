'use client';

import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

const reasons = [
  "Your smile that brightens my darkest days",
  "Your laugh that sounds like music",
  "Your endless kindness to everyone",
  "Your soft, comforting voice",
  "Your beautiful, expressive eyes",
  "Your unwavering support",
  "Your warm, tight hugs",
  "Your honesty and integrity",
  "Your pure, loving heart",
  "The way you look at me",
  "How you make me feel safe",
  "Your incredible patience",
  "Your cute little habits",
  "The way you hold my hand",
  "Your passion for what you do",
  "How we can talk for hours",
  "Your sense of humor",
  "The way you understand me",
  "Your brilliant mind",
  "Everything about you"
];

export default function ReasonsGrid() {
  return (
    <section className="py-24 relative z-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4"
          >
            20 Reasons I Love You
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-white/60 font-inter"
          >
            (Though there are infinite more)
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(255,182,193,0.3)"
              }}
              className="glass p-6 rounded-2xl relative group overflow-hidden cursor-default min-h-[160px] flex items-center justify-center text-center"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/20 group-hover:to-purple-500/20 transition-all duration-500" />
              
              <p className="font-playfair text-lg md:text-xl text-white/90 relative z-10">
                {reason}
              </p>

              {/* Decorative Icons on Hover */}
              <Sparkles className="absolute top-4 right-4 w-5 h-5 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0" />
              <Heart className="absolute bottom-4 left-4 w-4 h-4 text-pink-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-2 group-hover:translate-y-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
