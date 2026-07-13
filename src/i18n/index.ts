import { create } from 'zustand';
import type { GameSubject } from '../types/reading';
import { en } from './en';
import { ja } from './ja';
import type { Locale, Messages } from './types';
import { LOCALES } from './types';
import { vi } from './vi';

export type { Locale, Messages };
export { LOCALES, LOCALE_META } from './types';

const MESSAGES: Record<Locale, Messages> = { vi, en, ja };

const STORAGE_KEY = 'iron-golem-locale';

function parseLocale(value: unknown): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : 'vi';
}

function loadLocale(): Locale {
  if (typeof window === 'undefined') return 'vi';
  try {
    return parseLocale(localStorage.getItem(STORAGE_KEY));
  } catch {
    return 'vi';
  }
}

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: loadLocale(),
  setLocale: (locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    set({ locale });
  },
}));

export function getMessages(locale?: Locale): Messages {
  const resolved = locale ?? useLocaleStore.getState().locale;
  return MESSAGES[resolved];
}

/** Reactive translations for React components. */
export function useT(): Messages {
  const locale = useLocaleStore((s) => s.locale);
  return MESSAGES[locale];
}

export function getSubtitle(subject: GameSubject, locale?: Locale): string {
  return getMessages(locale).subtitles[subject];
}

export function getTagline(subject: GameSubject, locale?: Locale): string {
  return getMessages(locale).taglines[subject];
}
