// Plays a short two-tone chime using the Web Audio API. No audio file needed,
// so it works the moment this code loads — nothing to upload or host.
export function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();

    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(880, now, 0.15); // first note
    playTone(1175, now + 0.15, 0.25); // second, higher note

    // Free the audio context shortly after the chime finishes.
    setTimeout(() => ctx.close(), 600);
  } catch {
    // Audio can fail silently (autoplay policy before any user interaction,
    // unsupported browser, etc.) — the toast notification still shows either way.
  }
}
