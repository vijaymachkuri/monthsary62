'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Pause } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element only on client to avoid hydration issues
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8b7f70df0.mp3?filename=soft-romantic-piano-110029.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Attempt to play, catch promise error if browser blocks autoplay
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Music className="w-5 h-5 animate-pulse" />
        )}
      </button>
      
      {/* Decorative notes floating when playing */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          <Music className="absolute w-4 h-4 text-pink-300 opacity-0 animate-[floatUp_3s_ease-out_infinite] -top-4 -left-4" />
          <Music className="absolute w-3 h-3 text-purple-300 opacity-0 animate-[floatUp_2s_ease-out_infinite_0.5s] -top-8 left-4" />
        </div>
      )}
    </div>
  );
}
