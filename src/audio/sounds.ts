export type SoundId =
  | 'uiClick'
  | 'gameStart'
  | 'move'
  | 'vs'
  | 'combatStart'
  | 'digit'
  | 'wrong'
  | 'victory'
  | 'levelUp'
  | 'coin';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  play(id: SoundId) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.connect(this.ctx.destination);

    switch (id) {
      case 'uiClick':
        this.tone(520, 0.06, 'square', 0.08, g, t, 880);
        break;
      case 'gameStart':
        this.tone(392, 0.12, 'sine', 0.14, g, t, 523);
        this.tone(523, 0.12, 'sine', 0.14, g, t + 0.1, 659);
        this.tone(659, 0.2, 'sine', 0.16, g, t + 0.2, 784);
        break;
      case 'move':
        this.tone(180, 0.05, 'triangle', 0.05, g, t, 120);
        break;
      case 'vs':
        this.tone(110, 0.15, 'sawtooth', 0.12, g, t, 55);
        this.tone(220, 0.25, 'square', 0.1, g, t + 0.05, 110);
        break;
      case 'combatStart':
        this.tone(330, 0.08, 'square', 0.09, g, t, 165);
        this.tone(440, 0.15, 'sawtooth', 0.08, g, t + 0.06, 220);
        break;
      case 'digit':
        this.tone(640, 0.04, 'sine', 0.06, g, t, 900);
        break;
      case 'wrong':
        this.tone(200, 0.15, 'sawtooth', 0.12, g, t, 90);
        this.tone(150, 0.2, 'square', 0.1, g, t + 0.08, 70);
        break;
      case 'victory':
        [523, 659, 784, 1047].forEach((freq, i) => {
          this.tone(freq, 0.14, 'sine', 0.11, g, t + i * 0.1, freq * 1.5);
        });
        break;
      case 'levelUp':
        [392, 523, 659, 784, 988].forEach((freq, i) => {
          this.tone(freq, 0.16, 'triangle', 0.12, g, t + i * 0.09, freq * 1.2);
        });
        break;
      case 'coin':
        this.tone(880, 0.08, 'sine', 0.1, g, t, 1320);
        this.tone(1175, 0.12, 'sine', 0.08, g, t + 0.06, 1500);
        break;
      default:
        break;
    }
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    output: GainNode,
    start: number,
    endFreq = freq,
  ) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(output);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }
}

export const sounds = new SoundEngine();
