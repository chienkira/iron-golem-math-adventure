import type { Messages } from './types';

export const vi: Messages = {
  gameTitle: 'Người Sắt',

  subjects: {
    math: 'Toán học',
    reading: 'Tiếng Việt',
  },

  subtitles: {
    math: 'Phiêu Lưu Toán Học',
    reading: 'Phiêu Lưu Tiếng Việt',
  },

  taglines: {
    math: 'Khám phá • Chiến đấu • Học toán!',
    reading: 'Khám phá • Chiến đấu • Tập đọc!',
  },

  start: {
    play: '▶ Bắt đầu',
    progress: (level, coins, max) => `Cấp ${level} (${coins}/${max} xu)`,
    reset: '↺ Chơi lại từ đầu',
  },

  hud: {
    level: (n) => `Cấp ${n}`,
    coinsProgress: (coins, max) => `${coins}/${max} xu`,
  },

  moveHint: 'Chạm bản đồ để di chuyển • Chạm quái vật để chiến đấu',

  common: {
    exit: 'Thoát',
  },

  zoom: {
    overview: '⊖ Bản đồ',
    normal: '⊕ Xem gần',
  },

  combat: {
    battle: '⚡ CHIẾN ĐẤU',
    levelUp: (level) => `⭐ LÊN CẤP ${level}! ⭐`,
    reward: (amount) => `+${amount} xu 💰`,
    clear: 'Xóa',
    submit: '✓',
    answerPlaceholder: '?',
    tapWordHint: 'Chạm từ để ghép câu',
  },

  vs: {
    vs: 'VS',
    playerName: 'Người Sắt',
  },

  monsters: {
    creeper: 'Creeper',
    bee: 'Ong Vàng',
    zombie: 'Thây Ma',
    enderman: 'Enderman',
    ghast: 'Ghast',
  },

  coinLabel: (amount) => `${amount} xu`,

  language: {
    label: 'Ngôn ngữ',
    vi: 'Tiếng Việt',
    en: 'English',
    ja: '日本語',
  },
};
