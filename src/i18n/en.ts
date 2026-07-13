import type { Messages } from './types';

export const en: Messages = {
  gameTitle: 'Iron Golem',

  subjects: {
    math: 'Math',
    reading: 'Vietnamese',
  },

  subtitles: {
    math: 'Math Adventure',
    reading: 'Vietnamese Adventure',
  },

  taglines: {
    math: 'Explore • Fight • Learn math!',
    reading: 'Explore • Fight • Practice reading!',
  },

  start: {
    play: '▶ Start',
    progress: (level, coins, max) => `Level ${level} (${coins}/${max} coins)`,
    reset: '↺ Start over',
  },

  hud: {
    level: (n) => `Level ${n}`,
    coinsProgress: (coins, max) => `${coins}/${max} coins`,
  },

  moveHint: 'Tap the map to move • Tap monsters to fight',

  common: {
    exit: 'Exit',
  },

  zoom: {
    overview: '⊖ Map',
    normal: '⊕ Zoom in',
  },

  combat: {
    battle: '⚡ BATTLE',
    levelUp: (level) => `⭐ LEVEL UP ${level}! ⭐`,
    reward: (amount) => `+${amount} coins 💰`,
    clear: 'Clear',
    submit: '✓',
    answerPlaceholder: '?',
    tapWordHint: 'Tap words to build the sentence',
  },

  vs: {
    vs: 'VS',
    playerName: 'Iron Golem',
  },

  monsters: {
    creeper: 'Creeper',
    bee: 'Bee',
    zombie: 'Zombie',
    enderman: 'Enderman',
    ghast: 'Ghast',
  },

  coinLabel: (amount) => `${amount} coins`,

  language: {
    label: 'Language',
    vi: 'Tiếng Việt',
    en: 'English',
    ja: '日本語',
  },
};
