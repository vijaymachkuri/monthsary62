'use client';

import { useState, useEffect } from 'react';
import OpeningAnimation from '@/components/OpeningAnimation';
import BackgroundEffects from '@/components/BackgroundEffects';
import CustomCursor from '@/components/CustomCursor';
import Hero from '@/components/Hero';
import { getMonthsaryCount, getOrdinalSuffix } from '@/lib/utils';
import LoveCounter from '@/components/LoveCounter';
import Timeline from '@/components/Timeline';
import LoveLetter from '@/components/LoveLetter';
import ReasonsGrid from '@/components/ReasonsGrid';
import InteractiveButtons from '@/components/InteractiveButtons';
import PhotoGallery from '@/components/PhotoGallery';
import QuotesCarousel from '@/components/QuotesCarousel';
import SurpriseEnding from '@/components/SurpriseEnding';
import MusicPlayer from '@/components/MusicPlayer';
import LoveNotes from '@/components/LoveNotes';
import WelcomeScreen from '@/components/WelcomeScreen';

export default function Page() {
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    // Automatically apply the special theme if it's the 9th of any month!
    if (new Date().getDate() === 9) {
      document.body.classList.add('theme-anniversary');
    } else {
      document.body.classList.remove('theme-anniversary');
    }
  }, []);

  return (
    <WelcomeScreen>
      <main className="relative min-h-screen">
      {!showMain && <OpeningAnimation onComplete={() => setShowMain(true)} />}
      
      {showMain && (
        <div className="animate-in fade-in duration-[2000ms]">
          <CustomCursor />
          <BackgroundEffects />
          <MusicPlayer />
          
          <div className="relative">
            <Hero />
            
            <div className="relative">
              <LoveNotes />
              <LoveCounter />
              <Timeline />
              <LoveLetter />
              <ReasonsGrid />
              <InteractiveButtons />
              <PhotoGallery />
              <QuotesCarousel />
              <SurpriseEnding />
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-12 text-center border-t border-white/10 glass mt-20">
              <p className="font-playfair text-xl text-white/90 mb-2">Made with infinite love ❤️</p>
              <p className="font-space tracking-widest uppercase text-xs text-white/50 mb-4">Happy {getOrdinalSuffix(getMonthsaryCount())} Monthsary</p>
              <div className="flex justify-center text-pink-400">
                <svg width="100" height="30" viewBox="0 0 100 30" className="opacity-70">
                   <path d="M0,15 L30,15 L40,0 L50,30 L60,15 L100,15" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[dash_2s_linear_infinite]" strokeDasharray="100" />
                </svg>
              </div>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes dash {
                  to { stroke-dashoffset: -100; }
                }
              `}} />
            </footer>
          </div>
        </div>
      )}
      </main>
    </WelcomeScreen>
  );
}
