/**
 * Web Audio API synthesizer for retro-neon sound effects & procedural background tracks.
 * Gracefully defaults to silent mode if blocked or unsupported.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: any = null;
  private currentBassNode: OscillatorNode | null = null;
  private currentGainNode: GainNode | null = null;

  constructor() {
    // Check if muted in storage
    try {
      const savedMute = localStorage.getItem('game_muted');
      this.isMuted = savedMute === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn("Web Audio API is not supported in this environment", e);
    }
  }

  getMuted() {
    return this.isMuted;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('game_muted', String(muted));
    } catch {}

    if (muted) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
  }

  private createOscillator(type: OscillatorType, freq: number, duration: number, gainStartValue: number = 0.1) {
    this.init();
    if (!this.ctx || this.isMuted) return null;

    // Direct resume check
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainStartValue, this.ctx.currentTime);
      // Exponential decay
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);

      return { osc, gain };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  playCorrect() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Beautiful retro chime (C5 then G5 quickly)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(783.99, now + 0.08); // G5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.50, now); // C6
      osc2.frequency.setValueAtTime(1567.98, now + 0.08); // G6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch {}
  }

  playWrong() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Disappointing buzzer slide
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  playLevelUp() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Arpeggio matching a glorious level-up
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major chord arpeggio
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.07, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch {}
  }

  playGameOver() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      // Mournful sliding chord
      const freqs = [150, 110, 80];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        osc.frequency.linearRampToValueAtTime(40, now + 0.8);

        gain.gain.setValueAtTime(0.1, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + 0.8);
      });
    } catch {}
  }

  startBackgroundMusic() {
    this.init();
    this.stopBackgroundMusic(); // Safeguard duplicates
    if (!this.ctx || this.isMuted) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      let beatCount = 0;
      // Retro synthesizer sequence loop (8-step hum)
      const bassNotes = [55.00, 55.00, 65.41, 65.41, 73.42, 73.42, 65.41, 61.74]; // A1 -> A1 -> C2 -> C2 -> D2 -> D2 -> C2 -> B1
      const tempo = 0.3; // Seconds per beat

      const playDrumAndBass = () => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const noteIndex = beatCount % bassNotes.length;
        const freq = bassNotes[noteIndex];

        // Bass Synth pulse
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(freq, now);

        bassGain.gain.setValueAtTime(0.08, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + tempo * 0.9);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + tempo * 0.9);

        // Subtly add high hats / noise effects on odd beats
        if (beatCount % 2 === 0) {
          const snareOsc = this.ctx.createOscillator();
          const snareGain = this.ctx.createGain();
          snareOsc.type = 'sine';
          snareOsc.frequency.setValueAtTime(1000, now);
          
          snareGain.gain.setValueAtTime(0.005, now);
          snareGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

          snareOsc.connect(snareGain);
          snareGain.connect(this.ctx.destination);
          snareOsc.start(now);
          snareOsc.stop(now + 0.07);
        }

        beatCount++;
      };

      // Play first beat instantly
      playDrumAndBass();

      this.musicInterval = setInterval(playDrumAndBass, tempo * 1000);
    } catch {}
  }

  stopBackgroundMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.currentBassNode) {
      try { this.currentBassNode.stop(); } catch {}
      this.currentBassNode = null;
    }
  }
}

export const audio = new SoundEngine();
