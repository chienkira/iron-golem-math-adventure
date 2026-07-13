import type { Messages } from './types';

export const ja: Messages = {
  gameTitle: 'アイアンゴーレム',

  subjects: {
    math: '算数',
    reading: 'ベトナム語',
  },

  subtitles: {
    math: '算数アドベンチャー',
    reading: 'ベトナム語アドベンチャー',
  },

  taglines: {
    math: '探検 • 戦闘 • 算数を学ぼう！',
    reading: '探検 • 戦闘 • 読解を練習しよう！',
  },

  start: {
    play: '▶ スタート',
    progress: (level, coins, max) => `レベル ${level} (${coins}/${max} コイン)`,
    reset: '↺ 最初からやり直す',
  },

  hud: {
    level: (n) => `レベル ${n}`,
    coinsProgress: (coins, max) => `${coins}/${max} コイン`,
  },

  moveHint: 'マップをタップして移動 • モンスターをタップして戦闘',

  common: {
    exit: '終了',
  },

  zoom: {
    overview: '⊖ マップ',
    normal: '⊕ ズーム',
  },

  combat: {
    battle: '⚡ 戦闘',
    levelUp: (level) => `⭐ レベルアップ ${level}！ ⭐`,
    reward: (amount) => `+${amount} コイン 💰`,
    clear: 'クリア',
    submit: '✓',
    answerPlaceholder: '?',
    tapWordHint: '単語をタップして文を作ろう',
  },

  vs: {
    vs: 'VS',
    playerName: 'アイアンゴーレム',
  },

  monsters: {
    creeper: 'クリーパー',
    bee: 'ハチ',
    zombie: 'ゾンビ',
    enderman: 'エンダーマン',
    ghast: 'ガスト',
  },

  coinLabel: (amount) => `${amount} コイン`,

  language: {
    label: '言語',
    vi: 'Tiếng Việt',
    en: 'English',
    ja: '日本語',
  },
};
