export const vi = {
  gameTitle: 'Người Sắt',
  gameSubtitle: 'Phiêu Lưu Toán Học',
  tagline: 'Khám phá • Chiến đấu • Học toán!',

  start: {
    play: '▶ Bắt đầu',
    mute: '🔇 Tắt tiếng',
    unmute: '🔊 Bật tiếng',
    featureExplore: 'Khám phá',
    featureCombat: 'Chiến đấu',
    featureMath: 'Học toán',
  },

  hud: {
    level: (n: number) => `Cấp ${n}`,
    coins: (n: number) => `${n} xu`,
  },

  moveHint: 'Chạm / bấm bản đồ để di chuyển • Chạm quái vật để chiến đấu',

  zoom: {
    overview: 'Bản đồ',
    normal: 'Gần',
    ariaOverview: 'Xem toàn bộ bản đồ',
    ariaNormal: 'Zoom gần',
  },

  combat: {
    playerName: 'Người Sắt',
    battle: '⚡ CHIẾN ĐẤU',
    exit: 'Thoát',
    levelUp: (level: number) => `⭐ LÊN CẤP ${level}! ⭐`,
    reward: (amount: number) => `+${amount} xu 🪙`,
    clear: 'Xóa',
    submit: '✓',
    answerPlaceholder: '?',
  },

  vs: {
    vs: 'VS',
    playerName: 'Người Sắt',
    difficulty: 'Độ khó',
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó',
    veryHard: 'Rất khó',
    difficultyLabel: (label: string) => `Độ khó: ${label}`,
  },

  monsters: {
    creeper: 'Creeper',
    bee: 'Ong Vàng',
    zombie: 'Thây Ma',
    enderman: 'Enderman',
  },

  coinLabel: (amount: number) => `🪙 ${amount} xu`,
} as const;

export function getDifficultyLabel(maxValue: number): string {
  if (maxValue < 50) return vi.vs.easy;
  if (maxValue < 150) return vi.vs.medium;
  if (maxValue < 500) return vi.vs.hard;
  return vi.vs.veryHard;
}
