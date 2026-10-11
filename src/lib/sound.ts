// src/lib/sound.ts

let audioContext: AudioContext | null = null;
let soundBuffer: AudioBuffer | null = null;
let rawArrayBuffer: ArrayBuffer | null = null;
let isFetching = false;
let lastRepeatTime = 0;

// Eagerly prefetch the audio array buffer on module evaluation
if (typeof window !== "undefined") {
  fetch("/key-press-sound-effect.mp3")
    .then((res) => {
      if (res.ok) return res.arrayBuffer();
      throw new Error(`HTTP ${res.status}`);
    })
    .then((data) => {
      rawArrayBuffer = data;
    })
    .catch((err) => {
      console.warn("Could not prefetch key press sound effect:", err);
    });
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }
  return audioContext;
}

async function ensureSoundBuffer(): Promise<AudioBuffer | null> {
  if (soundBuffer) return soundBuffer;
  const ctx = getAudioContext();
  if (!ctx) return null;

  try {
    if (!rawArrayBuffer && !isFetching) {
      isFetching = true;
      const res = await fetch("/key-press-sound-effect.mp3");
      rawArrayBuffer = await res.arrayBuffer();
      isFetching = false;
    }

    if (rawArrayBuffer && !soundBuffer) {
      // decodeAudioData consumes the ArrayBuffer, so we pass a slice
      soundBuffer = await ctx.decodeAudioData(rawArrayBuffer.slice(0));
    }
    return soundBuffer;
  } catch (err) {
    console.warn("Could not decode key press sound:", err);
    return null;
  }
}

// Fallback HTMLAudioElement pool
const audioPool: HTMLAudioElement[] = [];
function playWithFallback() {
  try {
    let audio = audioPool.find((a) => a.paused || a.ended);
    if (!audio) {
      audio = new Audio("/key-press-sound-effect.mp3");
      audio.volume = 0.65;
      if (audioPool.length < 8) {
        audioPool.push(audio);
      }
    } else {
      audio.currentTime = 0;
    }
    audio.play().catch(() => {});
  } catch {
    // Ignore audio autoplay restrictions if user hasn't interacted
  }
}

/**
 * Play key press mechanical sound effect with zero-latency Web Audio API
 * and fallback to Audio element if buffer is still decoding.
 */
export function playKeySound(isRepeat = false) {
  if (typeof window === "undefined") return;

  // Throttle repeated keys (when user holds down a key) to avoid distortion
  if (isRepeat) {
    const now = performance.now();
    if (now - lastRepeatTime < 80) {
      return;
    }
    lastRepeatTime = now;
  }

  const ctx = getAudioContext();
  if (ctx) {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (soundBuffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = soundBuffer;
        // Subtle pitch variance (±2%) for natural mechanical keyboard feel
        source.playbackRate.value = 0.98 + Math.random() * 0.04;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.65;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fall back
      }
    } else {
      // Decode asynchronously for next press
      ensureSoundBuffer();
    }
  }

  playWithFallback();
}
