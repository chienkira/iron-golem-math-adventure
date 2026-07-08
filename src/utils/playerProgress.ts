import { COINS_PER_LEVEL } from '../types/game';
import type { GameSubject } from '../types/reading';

interface PlayerProgress {
  level: number;
  coinsInLevel: number;
  subject?: GameSubject;
}

const STORAGE_KEY = 'iron-golem-player-progress';

const DEFAULT_PROGRESS: PlayerProgress = { level: 1, coinsInLevel: 0, subject: 'math' };

function parseSubject(value: unknown): GameSubject {
  return value === 'reading' ? 'reading' : 'math';
}

export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;

    const data = JSON.parse(raw) as Partial<PlayerProgress>;
    const level = Math.max(1, Math.floor(Number(data.level) || 1));
    const coinsInLevel = Math.max(
      0,
      Math.min(COINS_PER_LEVEL, Math.floor(Number(data.coinsInLevel) || 0)),
    );

    return { level, coinsInLevel, subject: parseSubject(data.subject) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function savePlayerProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearPlayerProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
