// Web Audio API sound effects - no external files needed
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
  if (!audioCtx) return;
  
  try {
    // Resume audio context if suspended (needed for mobile)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
  } catch {
    // Silently fail if audio is not supported
  }
}

export function playMoveSound() {
  playTone(600, 0.08, 'sine', 0.12);
  setTimeout(() => playTone(400, 0.06, 'sine', 0.08), 30);
}

export function playCaptureSound() {
  playTone(300, 0.12, 'square', 0.1);
  setTimeout(() => playTone(200, 0.08, 'square', 0.06), 40);
}

export function playCorrectSound() {
  playTone(523, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.1), 200);
}

export function playWrongSound() {
  playTone(200, 0.15, 'sawtooth', 0.08);
  setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.06), 100);
}

export function playPuzzleCompleteSound() {
  playTone(523, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 120);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.1), 240);
  setTimeout(() => playTone(1047, 0.2, 'sine', 0.08), 360);
}

export function playCheckSound() {
  playTone(800, 0.1, 'square', 0.1);
  setTimeout(() => playTone(600, 0.15, 'square', 0.08), 80);
}
