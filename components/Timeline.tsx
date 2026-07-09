'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Heart, Map, Sparkles, Star, ChevronDown, ImageIcon, Loader2 } from 'lucide-react';
import { getMonthsaryCount, getOrdinalSuffix } from '@/lib/utils';
import Image from 'next/image';

const ICON_MAP: Record<string, any> = {
  Heart: Heart,
  Star: Star,
  Camera: Camera,
  Map: Map,
  Sparkles: Sparkles
};

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  photoUrl: string | null;
};

function InteractiveEventCard({ item, isEven }: { item: TimelineEvent & { isInteractive: boolean }, isEven: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If there's no photoUrl, it shouldn't be clickable unless we specifically want it to be.
  const hasPhoto = !!item.photoUrl;

  return (
    <div 
      className={`glass p-6 md:p-8 rounded-2xl transition-all duration-300 group ${hasPhoto ? 'cursor-pointer hover:bg-white/10' : ''}`}
      onClick={() => hasPhoto && setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-pink-300 font-space text-sm md:text-base tracking-widest uppercase block mb-2 group-hover:text-pink-200 transition-colors">
            {item.date}
          </span>
          <h3 className="text-xl md:text-2xl font-playfair font-bold text-white mb-3 flex items-center gap-2">
            {item.title}
          </h3>
          <p className="text-white/70 font-inter text-sm md:text-base leading-relaxed">
            {item.description}
          </p>
        </div>
        {hasPhoto && (
          <ChevronDown className={`w-6 h-6 text-pink-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        )}
      </div>

      <AnimatePresence>
        {hasPhoto && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-4 border-t border-white/10">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
                <Image
                  src={item.photoUrl!}
                  alt="Timeline Memory"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch('/api/timeline');
        const data = await res.json();
        if (data.timeline) setEvents(data.timeline);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  // Always append the dynamic "Today" milestone at the end
  const todayMilestone = {
    id: 'today',
    date: 'Today',
    title: `Our ${getOrdinalSuffix(getMonthsaryCount())} Monthsary`,
    description: 'Still falling more in love with you every day.',
    icon: 'Sparkles',
    photoUrl: null,
    isInteractive: false
  };

  const allMilestones = [...events, todayMilestone];

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

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
          </div>
        ) : (
          <div className="relative">
            {/* Glowing Center Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-pink-500/20 via-purple-500/50 to-pink-500/20 md:-translate-x-1/2 shadow-[0_0_15px_rgba(236,72,153,0.5)]" />

            {allMilestones.map((item, index) => {
              const Icon = ICON_MAP[item.icon] || Heart;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={item.id}
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
                    <InteractiveEventCard item={{ ...item, isInteractive: !!item.photoUrl }} isEven={isEven} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
