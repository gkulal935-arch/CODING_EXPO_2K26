import { useState, useEffect } from 'react';

// Shared global state for audio
let isMutedGlobal = true;
const listeners = new Set<(muted: boolean) => void>();

const notifyListeners = (muted: boolean) => {
  listeners.forEach((listener) => listener(muted));
};

// Background Music Singleton
let bgMusic: HTMLAudioElement | null = null;
let fadeInterval: number | null = null;
const TARGET_VOLUME = 0.45; // Audibly pleasant volume level for background track

// Web Audio API singletons for Sound Effects
let audioCtx: AudioContext | null = null;
let mainGain: GainNode | null = null;

const initAudioContext = () => {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.3, audioCtx.currentTime); // Keep sound effects soft
    mainGain.connect(audioCtx.destination);
  } catch (error) {
    console.warn('Failed to initialize AudioContext for sound effects:', error);
  }
};

const initBgMusic = () => {
  if (typeof window === 'undefined') return null;
  if (!bgMusic) {
    bgMusic = new Audio('/audio/ambient_v1.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0; // Starts at 0 volume and fades in if unmuted
  }
  return bgMusic;
};

const fadeAudio = (toVolume: number, durationMs: number) => {
  const audio = initBgMusic();
  if (!audio) return;

  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }

  const startVolume = audio.volume;
  const steps = 20;
  const intervalTime = durationMs / steps;
  const stepAmount = (toVolume - startVolume) / steps;
  let currentStep = 0;

  // Play audio before fading in if it's paused
  if (toVolume > 0 && audio.paused) {
    audio.play().catch((err) => {
      console.log('Audio playback waiting for user interaction:', err);
    });
  }

  fadeInterval = window.setInterval(() => {
    if (!audio) {
      if (fadeInterval) clearInterval(fadeInterval);
      return;
    }
    currentStep++;
    let nextVolume = startVolume + stepAmount * currentStep;

    // Boundary check
    if (nextVolume < 0) nextVolume = 0;
    if (nextVolume > 1) nextVolume = 1;

    audio.volume = nextVolume;

    if (currentStep >= steps) {
      audio.volume = toVolume;
      if (toVolume === 0) {
        audio.pause();
      }
      if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }
  }, intervalTime);
};

// Autoplay after first user interaction (mobile/browser policy bypass)
const handleFirstInteraction = () => {
  const audio = initBgMusic();
  if (audio && !isMutedGlobal && audio.paused) {
    audio.play().catch((err) => {
      console.log('Autoplay interaction failed:', err);
    });
    fadeAudio(TARGET_VOLUME, 400);
  }

  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
  document.addEventListener('keydown', handleFirstInteraction);
}

// Procedural synthesizer helper for UI Sound Effects
const playSynthTone = (
  freqStart: number,
  freqEnd: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.05
) => {
  if (isMutedGlobal) return;
  
  try {
    initAudioContext();
    if (!audioCtx || !mainGain) return;
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
    
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    osc.connect(gain);
    gain.connect(mainGain);
    
    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    // Fail silently for SFX to avoid polluting console log
  }
};

export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(isMutedGlobal);

  useEffect(() => {
    const listener = (muted: boolean) => {
      setIsMuted(muted);
    };
    listeners.add(listener);
    
    // Auto initialize background music audio object on hook instantiation
    initBgMusic();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMutedGlobal;
    isMutedGlobal = nextMuted;
    notifyListeners(nextMuted);

    const audio = initBgMusic();
    if (audio) {
      if (nextMuted) {
        fadeAudio(0, 400); // Smooth fade out
      } else {
        fadeAudio(TARGET_VOLUME, 400); // Smooth fade in
      }
    }
  };

  // Micro Sound Effects
  const playHover = () => {
    playSynthTone(600, 1200, 0.06, 'sine', 0.015);
  };

  const playClick = () => {
    playSynthTone(1000, 150, 0.08, 'triangle', 0.04);
  };

  const playBoot = () => {
    if (isMutedGlobal) return;
    try {
      initAudioContext();
      if (!audioCtx || !mainGain) return;
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const now = audioCtx.currentTime;
      
      const playToneAt = (freq: number, startDelay: number, dur: number, vol: number) => {
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + startDelay);
        
        gain.gain.setValueAtTime(0.0001, now + startDelay);
        gain.gain.linearRampToValueAtTime(vol, now + startDelay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startDelay + dur);
        
        const filter = audioCtx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now + startDelay);
        
        osc.connect(gain);
        gain.connect(filter);
        filter.connect(mainGain!);
        
        osc.start(now + startDelay);
        osc.stop(now + startDelay + dur);
      };

      playToneAt(261.63, 0.0, 0.15, 0.03); // C4
      playToneAt(329.63, 0.12, 0.15, 0.03); // E4
      playToneAt(392.00, 0.24, 0.15, 0.03); // G4
      playToneAt(523.25, 0.36, 0.35, 0.05); // C5
    } catch (err) {
      // Fail silently
    }
  };

  const playSuccess = () => {
    if (isMutedGlobal) return;
    playSynthTone(587.33, 1174.66, 0.2, 'sine', 0.03); // D5 -> D6
    setTimeout(() => {
      playSynthTone(880.00, 1760.00, 0.25, 'sine', 0.03); // A5 -> A6
    }, 80);
  };

  return {
    isMuted,
    toggleMute,
    playHover,
    playClick,
    playBoot,
    playSuccess
  };
};
