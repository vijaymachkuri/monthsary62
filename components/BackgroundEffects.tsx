'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate deterministic but random-looking values to avoid hydration mismatch
  // Actually, since we only render after mount, we can use Math.random safely.
  
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 3 + 2}s`
  }));

  const floatingHearts = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 1.5 + 0.5,
    delay: `${Math.random() * 20}s`,
    duration: `${Math.random() * 15 + 10}s`,
    rot: `${Math.random() * 360}deg`,
    opacity: Math.random() * 0.4 + 0.1
  }));

  const clouds = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 60}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${Math.random() * 40 + 40}s`,
    opacity: Math.random() * 0.05 + 0.02,
    scale: Math.random() * 2 + 1
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute rounded-full bg-white twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--delay': star.delay,
            '--duration': star.duration,
          } as React.CSSProperties}
        />
      ))}

      {/* Floating Hearts */}
      {floatingHearts.map((heart) => (
        <div
          key={`fheart-${heart.id}`}
          className="absolute text-pink-400/40 float-up flex items-center justify-center"
          style={{
            left: heart.left,
            bottom: '-10%',
            '--delay': heart.delay,
            '--duration': heart.duration,
            '--scale': heart.size,
            '--rot': heart.rot,
            '--max-opacity': heart.opacity
          } as React.CSSProperties}
        >
          <Heart className="w-6 h-6 fill-current" />
        </div>
      ))}
      
      {/* Soft Clouds (Gradient Orbs) */}
      {clouds.map((cloud, index) => (
        <div
          key={`cloud-${cloud.id}`}
          className="absolute rounded-full blur-[100px] animate-[floatLeftRight_60s_ease-in-out_infinite_alternate]"
          style={{
            top: cloud.top,
            left: '-20%',
            width: '40vw',
            height: '40vw',
            background: index % 2 === 0 ? 'rgba(230, 230, 250, 0.8)' : 'rgba(255, 182, 193, 0.8)',
            opacity: cloud.opacity,
            transform: `scale(${cloud.scale})`,
            animationDelay: cloud.delay,
            animationDuration: cloud.duration
          }}
        />
      ))}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatLeftRight {
          0% { transform: translateX(-10vw) scale(var(--scale, 1)); }
          100% { transform: translateX(110vw) scale(var(--scale, 1)); }
        }
      `}} />
    </div>
  );
}
