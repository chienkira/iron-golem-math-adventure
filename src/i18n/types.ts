import type { GameSubject } from '../types/reading';

export type Locale = 'vi' | 'en' | 'ja';

export interface Messages {
  gameTitle: string;

  subjects: Record<GameSubject, string>;
  subtitles: Record<GameSubject, string>;
  taglines: Record<GameSubject, string>;

  start: {
    play: string;
    progress: (level: number, coins: number, max: number) => string;
    reset: string;
  };

  hud: {
    level: (n: number) => string;
    coinsProgress: (coins: number, max: number) => string;
  };

  moveHint: string;

  common: {
    exit: string;
  };

  zoom: {
    overview: string;
    normal: string;
  };

  combat: {
    battle: string;
    levelUp: (level: number) => string;
    reward: (amount: number) => string;
    clear: string;
    submit: string;
    answerPlaceholder: string;
    tapWordHint: string;
  };

  vs: {
    vs: string;
    playerName: string;
  };

  monsters: {
    creeper: string;
    bee: string;
    zombie: string;
    enderman: string;
    ghast: string;
  };

  coinLabel: (amount: number) => string;

  language: {
    label: string;
    vi: string;
    en: string;
    ja: string;
  };
}

export const LOCALE_META: Record<
  Locale,
  { flag: string; nativeName: string }
> = {
  vi: { flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  en: { flag: '🇺🇸', nativeName: 'English' },
  ja: { flag: '🇯🇵', nativeName: '日本語' },
};

export const LOCALES: Locale[] = ['vi', 'en', 'ja'];
