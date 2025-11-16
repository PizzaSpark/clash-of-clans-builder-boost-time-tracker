"use client";

import { useEffect, useRef } from "react";

export function useAudioNotification(soundPath: string) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try to load the audio file
      audioRef.current = new Audio(soundPath);
      
      // Also prepare Web Audio API for fallback beep
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API not supported");
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [soundPath]);

  const playSound = async () => {
    // Try to play the audio file first
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        return;
      } catch (error) {
        console.warn("Could not play audio file, falling back to beep:", error);
      }
    }

    // Fallback: generate a beep sound using Web Audio API
    if (audioContextRef.current) {
      try {
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 800; // 800Hz
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      } catch (error) {
        console.error("Failed to play notification sound:", error);
      }
    }
  };

  return { playSound };
}
