export const vi = {
  gameTitle: 'Người Sắt',
  gameSubtitle: 'Phiêu Lưu Toán Học',
  tagline: 'Khám phá • Chiến đấu • Học toán!',

  start: {
    play: '▶ Bắt đầu',
    progress: (level: number, coins: number, max: number) =>
      `Cấp ${level} (${coins}/${max} xu)`,
    reset: '↺ Chơi lại từ đầu',
  },

  hud: {
    level: (n: number) => `Cấp ${n}`,
  },

  moveHint: 'Chạm bản đồ để di chuyển • Chạm quái vật để chiến đấu',

  common: {
    exit: 'Thoát',
  },

  zoom: {
    overview: 'Bản đồ',
    normal: 'Xem gần',
  },

  combat: {
    battle: '⚡ CHIẾN ĐẤU',
    levelUp: (level: number) => `⭐ LÊN CẤP ${level}! ⭐`,
    reward: (amount: number) => `+${amount} xu 💰`,
    clear: 'Xóa',
    submit: '✓',
    answerPlaceholder: '?',
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
