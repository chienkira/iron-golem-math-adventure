import exploreBgmSrc from './game-bgm.mp3';
import combatBgmSrc from './combat-bgm.mp3';
import vsIntroSrc from './vs-intro.mp3';
import answerCorrectSrc from './answer-correct.mp3';

export type SoundId = 'move' | 'vsIntro' | 'answerCorrect';

const EXPLORE_BGM_LOOP_FROM_SEC = 15;
const EXPLORE_BGM_VOLUME = 0.38;
const EXPLORE_BGM_COMBAT_VOLUME_RATIO = 0.5;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private exploreBgm: HTMLAudioElement | null = null;
  private combatBgm: HTMLAudioElement | null = null;
  private muted = false;
  private exploreBgmActive = false;
  private combatBgmActive = false;
  private exploreBgmDucked = false;

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
    this.syncPlayback();
    return this.muted;
  }

  startExploreBgm() {
    if (typeof window === 'undefined') return;
    this.exploreBgmActive = true;
    if (!this.exploreBgm) {
      this.exploreBgm = new Audio(exploreBgmSrc);
      this.exploreBgm.addEventListener('ended', () => {
        if (!this.exploreBgm || !this.exploreBgmActive || this.muted) return;
        this.exploreBgm.currentTime = EXPLORE_BGM_LOOP_FROM_SEC;
        void this.exploreBgm.play().catch(() => {});
      });
    }
    this.applyExploreBgmVolume();
    this.syncPlayback();
  }

  duckExploreBgm() {
    this.exploreBgmDucked = true;
    this.applyExploreBgmVolume();
    this.syncPlayback();
  }

  restoreExploreBgmVolume() {
    this.exploreBgmDucked = false;
    this.applyExploreBgmVolume();
    this.syncPlayback();
  }

  stopExploreBgm() {
    this.exploreBgmActive = false;
    this.exploreBgmDucked = false;
    if (this.exploreBgm) {
      this.exploreBgm.pause();
      this.exploreBgm.currentTime = 0;
    }
  }

  startCombatBgm() {
    if (typeof window === 'undefined') return;
    this.combatBgmActive = true;
    this.duckExploreBgm();
    if (!this.combatBgm) {
      this.combatBgm = new Audio(combatBgmSrc);
      this.combatBgm.loop = true;
      this.combatBgm.volume = 0.42;
    }
    this.syncPlayback();
  }

  stopCombatBgm() {
    this.combatBgmActive = false;
    if (this.combatBgm) {
      this.combatBgm.pause();
      this.combatBgm.currentTime = 0;
    }
    this.restoreExploreBgmVolume();
  }

  play(id: SoundId) {
    if (this.muted) return;

    if (id === 'vsIntro') {
      this.playClip(vsIntroSrc, 0.72);
      return;
    }

    if (id === 'answerCorrect') {
      this.playClip(answerCorrectSrc, 0.78);
      return;
    }

    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.value = 1.15;
    g.connect(this.ctx.destination);

    this.tone(420, 0.1, 'sine', 0.34, g, t, 680);
    this.tone(680, 0.12, 'triangle', 0.28, g, t + 0.05, 920);
  }

  private applyExploreBgmVolume() {
    if (!this.exploreBgm) return;
    this.exploreBgm.volume = this.exploreBgmDucked
      ? EXPLORE_BGM_VOLUME * EXPLORE_BGM_COMBAT_VOLUME_RATIO
      : EXPLORE_BGM_VOLUME;
  }

  private playClip(src: string, volume: number) {
    if (typeof window === 'undefined') return;
    const clip = new Audio(src);
    clip.volume = volume;
    void clip.play().catch(() => {});
  }

  private syncPlayback() {
    if (this.muted) {
      this.exploreBgm?.pause();
      this.combatBgm?.pause();
      return;
    }

    if (this.exploreBgmActive) {
      void this.exploreBgm?.play().catch(() => {});
    }

    if (this.combatBgmActive) {
      void this.combatBgm?.play().catch(() => {});
    } else {
      this.combatBgm?.pause();
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
