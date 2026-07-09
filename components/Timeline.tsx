'use client';

import { motion } from 'motion/react';
import { Heart, Star, CalendarHeart, Music, Sparkles, Quote, Camera } from 'lucide-react';

const milestones = [
  { date: 'May 9, 2021', title: 'We Met', description: 'The day my life changed forever.', icon: Star },
  { date: 'Spring 2021', title: 'First Conversation', description: 'We talked for hours and it felt like minutes.', icon: Quote },
  { date: 'Christmas 2022', title: 'Video Call', description: 'Video call for more than an hour at sister\'s home in Manila.', icon: CalendarHeart },
  { date: 'Throughout Years', title: 'Beautiful Memories', description: 'Trips, laughs, tears, and growing together.', icon: Camera },
  { date: 'July 9, 2026', title: 'Today — Our 62nd Monthsary', description: 'Still falling more in love with you every day.', icon: Sparkles },
];

export default function Timeline() {
  return (
    <section className="py-24 relative z-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">
            Our Journey
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Glowing Center Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-pink-500/20 via-purple-500/50 to-pink-500/20 md:-translate-x-1/2 shadow-[0_0_15px_rgba(236,72,153,0.5)]" />

          {milestones.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, type: "spring" }}
                className={`relative flex items-center mb-12 md:mb-24 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}
              >
                {/* Center Node */}
                <div className="absolute left-[20px] md:left-1/2 w-10 h-10 rounded-full glass-strong border-pink-400 flex items-center justify-center -translate-x-1/2 z-10 shadow-[0_0_20px_rgba(255,182,193,0.6)]">
                  <Icon className="w-5 h-5 text-pink-300" />
                </div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-[45%] ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <div className="glass p-6 md:p-8 rounded-2xl hover:bg-white/10 transition-colors group">
                    <span className="text-pink-300 font-space text-sm md:text-base tracking-widest uppercase block mb-2 group-hover:text-pink-200 transition-colors">
                      {item.date}
                    </span>
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/70 font-inter text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
