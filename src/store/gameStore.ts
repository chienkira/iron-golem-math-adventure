import { create } from 'zustand';
import type { GamePhase, MathQuestion, Monster } from '../types/game';
import { COINS_PER_LEVEL, MONSTER_CONFIGS } from '../types/game';
import { generateQuestion } from '../utils/mathQuestion';
import { spawnInitialMonsters, spawnMonster } from '../utils/spawnMonsters';

interface GameState {
  phase: GamePhase;
  playerPosition: [number, number, number];
  playerRotation: number;
  level: number;
  coins: number;
  coinsInLevel: number;
  monsters: Monster[];
  activeMonster: Monster | null;
  question: MathQuestion | null;
  userAnswer: string;
  floatingTexts: { id: string; text: string; x: number; y: number }[];
  moveTarget: [number, number] | null;
  lastReward: number;
  mapZoom: 'normal' | 'overview';

  startGame: () => void;
  setMoveTarget: (target: [number, number] | null) => void;
  toggleMapZoom: () => void;
  updatePlayerPosition: (pos: [number, number, number], rot: number) => void;
  startCombat: (monster: Monster) => void;
  finishVsIntro: () => void;
  appendDigit: (digit: string) => void;
  clearAnswer: () => void;
  submitAnswer: () => boolean;
  finishVictory: () => void;
  finishLevelUp: () => void;
  exitCombat: () => void;
  addFloatingText: (text: string, x?: number, y?: number) => void;
  removeFloatingText: (id: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  playerPosition: [0, 0, 0],
  playerRotation: 0,
  level: 1,
  coins: 0,
  coinsInLevel: 0,
  monsters: spawnInitialMonsters(),
  activeMonster: null,
  question: null,
  userAnswer: '',
  floatingTexts: [],
  moveTarget: null,
  lastReward: 0,
  mapZoom: 'normal',

  setMoveTarget: (target) => set({ moveTarget: target }),

  startGame: () => set({ phase: 'explore', moveTarget: null }),

  toggleMapZoom: () =>
    set((s) => ({ mapZoom: s.mapZoom === 'normal' ? 'overview' : 'normal' })),

  updatePlayerPosition: (pos, rot) =>
    set({ playerPosition: pos, playerRotation: rot }),

  startCombat: (monster) => {
    const question = generateQuestion(monster.type);
    set({
      phase: 'vs-intro',
      activeMonster: monster,
      question,
      userAnswer: '',
      moveTarget: null,
      mapZoom: 'normal',
    });
  },

  finishVsIntro: () => set({ phase: 'combat' }),

  appendDigit: (digit) => {
    const { userAnswer } = get();
    if (userAnswer.length < 4) {
      set({ userAnswer: userAnswer + digit });
    }
  },

  clearAnswer: () => set({ userAnswer: '' }),

  submitAnswer: () => {
    const { userAnswer, question, activeMonster, coins, coinsInLevel, level, monsters } = get();
    if (!question || !activeMonster || userAnswer === '') return false;

    const parsed = parseInt(userAnswer, 10);
    if (parsed !== question.answer) {
      set({ userAnswer: '' });
      return false;
    }

    const reward = MONSTER_CONFIGS[activeMonster.type].reward;
    const newCoins = coins + reward;
    let newCoinsInLevel = coinsInLevel + reward;
    let newLevel = level;
    let newPhase: GamePhase = 'victory';

    if (newCoinsInLevel >= COINS_PER_LEVEL) {
      newCoinsInLevel -= COINS_PER_LEVEL;
      newLevel = level + 1;
      newPhase = 'level-up';
    }

    const remainingMonsters = monsters.filter((m) => m.id !== activeMonster.id);
    const updatedMonsters =
      remainingMonsters.length < 14
        ? [...remainingMonsters, spawnMonster(remainingMonsters)]
        : remainingMonsters;

    set({
      phase: newPhase,
      coins: newCoins,
      coinsInLevel: newCoinsInLevel,
      level: newLevel,
      monsters: updatedMonsters,
      lastReward: reward,
    });
    return true;
  },

  finishVictory: () =>
    set({
      phase: 'explore',
      activeMonster: null,
      question: null,
      userAnswer: '',
    }),

  finishLevelUp: () =>
    set({
      phase: 'explore',
      activeMonster: null,
      question: null,
      userAnswer: '',
    }),

  exitCombat: () =>
    set({
      phase: 'explore',
      activeMonster: null,
      question: null,
      userAnswer: '',
    }),

  addFloatingText: (text, x = 50, y = 40) => {
    const id = `float-${Date.now()}`;
    set((s) => ({
      floatingTexts: [...s.floatingTexts, { id, text, x, y }],
    }));
    setTimeout(() => get().removeFloatingText(id), 2000);
  },

  removeFloatingText: (id) =>
    set((s) => ({
      floatingTexts: s.floatingTexts.filter((t) => t.id !== id),
    })),
}));
