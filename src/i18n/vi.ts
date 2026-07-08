import type { GameSubject } from '../types/reading';

export const vi = {
  gameTitle: 'Người Sắt',

  subjects: {
    math: 'Toán học',
    reading: 'Tiếng Việt',
  } as const satisfies Record<GameSubject, string>,

  subtitles: {
    math: 'Phiêu Lưu Toán Học',
    reading: 'Phiêu Lưu Tiếng Việt',
  } as const satisfies Record<GameSubject, string>,

  taglines: {
    math: 'Khám phá • Chiến đấu • Học toán!',
    reading: 'Khám phá • Chiến đấu • Tập đọc!',
  } as const satisfies Record<GameSubject, string>,

  start: {
    play: '▶ Bắt đầu',
    progress: (level: number, coins: number, max: number) =>
      `Cấp ${level} (${coins}/${max} xu)`,
    reset: '↺ Chơi lại từ đầu',
  },

  hud: {
    level: (n: number) => `Cấp ${n}`,
    coinsProgress: (coins: number, max: number) => `${coins}/${max} xu`,
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
    levelUp: (level: number) => `⭐ LÊN CẤP ${level}! ⭐`,
    reward: (amount: number) => `+${amount} xu 💰`,
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

  coinLabel: (amount: number) => `${amount} xu`,
} as const;

export function getSubtitle(subject: GameSubject): string {
  return vi.subtitles[subject];
}

export function getTagline(subject: GameSubject): string {
  return vi.taglines[subject];
}
