'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const START_DATE = new Date('2021-05-09T00:00:00');

export default function LoveCounter() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const diffMs = now.getTime() - START_DATE.getTime();
  
  // Totals
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  
  // Rough estimations for months and years for the "totals" display
  const totalMonths = (now.getFullYear() - START_DATE.getFullYear()) * 12 + (now.getMonth() - START_DATE.getMonth());
  const totalYears = (totalDays / 365.25).toFixed(2);

  const timeUnits = [
    { label: 'Years', value: totalYears },
    { label: 'Months', value: totalMonths.toLocaleString() },
    { label: 'Weeks', value: totalWeeks.toLocaleString() },
    { label: 'Days', value: totalDays.toLocaleString() },
    { label: 'Hours', value: totalHours.toLocaleString() },
    { label: 'Minutes', value: totalMinutes.toLocaleString() },
    { label: 'Seconds', value: totalSeconds.toLocaleString() },
  ];

  return (
    <section className="py-24 relative z-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-4">
            Our Time Together
          </h2>
          <p className="text-white/70 font-space tracking-widest uppercase text-sm">Since May 9, 2021</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {timeUnits.map((unit, index) => (
             <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors ${index === 6 ? 'col-span-2 md:col-span-2 lg:col-span-1 lg:col-start-4' : ''} ${index === 0 ? 'col-span-2 md:col-span-4 lg:col-span-1 lg:col-start-1 lg:row-span-2 flex-col justify-center' : ''}`}
             >
                <div className={`font-space font-bold text-pink-300 mb-2 ${index === 0 ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'}`}>
                  {unit.value}
                </div>
                <div className="text-white/60 font-inter text-xs md:text-sm uppercase tracking-wider">
                  {unit.label}
                </div>
             </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
