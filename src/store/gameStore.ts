import { create } from 'zustand';
import type { GamePhase, MathQuestion, Monster } from '../types/game';
import { COINS_PER_LEVEL, MONSTER_CONFIGS } from '../types/game';
import { generateQuestion } from '../utils/mathQuestion';
import {
  clearPlayerProgress,
  loadPlayerProgress,
  savePlayerProgress,
} from '../utils/playerProgress';
import { spawnInitialMonsters, spawnMonster } from '../utils/spawnMonsters';

interface GameState {
  phase: GamePhase;
  playerPosition: [number, number, number];
  playerRotation: number;
  level: number;
  coinsInLevel: number;
  monsters: Monster[];
  activeMonster: Monster | null;
  question: MathQuestion | null;
  userAnswer: string;
  moveTarget: [number, number] | null;
  lastReward: number;
  mapZoom: 'normal' | 'overview';

  startGame: () => void;
  exitToMenu: () => void;
  resetProgress: () => void;
  setMoveTarget: (target: [number, number] | null) => void;
  toggleMapZoom: () => void;
  updatePlayerPosition: (pos: [number, number, number], rot: number) => void;
  startCombat: (monster: Monster) => void;
  finishVsIntro: () => void;
  appendDigit: (digit: string) => void;
  clearAnswer: () => void;
  submitAnswer: () => boolean;
  finishRewardScreen: () => void;
  exitCombat: () => void;
}

const savedProgress = loadPlayerProgress();

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  playerPosition: [0, 0, 0],
  playerRotation: 0,
  level: savedProgress.level,
  coinsInLevel: savedProgress.coinsInLevel,
  monsters: spawnInitialMonsters(),
  activeMonster: null,
  question: null,
  userAnswer: '',
  moveTarget: null,
  lastReward: 0,
  mapZoom: 'normal',

  setMoveTarget: (target) => set({ moveTarget: target }),

  startGame: () => set({ phase: 'explore', moveTarget: null }),

  exitToMenu: () => {
    const { level, coinsInLevel } = get();
    savePlayerProgress({ level, coinsInLevel });
    set({
      phase: 'menu',
      moveTarget: null,
      mapZoom: 'normal',
      activeMonster: null,
      question: null,
      userAnswer: '',
    });
  },

  resetProgress: () => {
    clearPlayerProgress();
    set({
      phase: 'menu',
      level: 1,
      coinsInLevel: 0,
      playerPosition: [0, 0, 0],
      playerRotation: 0,
      monsters: spawnInitialMonsters(),
      activeMonster: null,
      question: null,
      userAnswer: '',
      moveTarget: null,
      lastReward: 0,
      mapZoom: 'normal',
    });
  },

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
    const { userAnswer, question, activeMonster, coinsInLevel, level, monsters } = get();
    if (!question || !activeMonster || userAnswer === '') return false;

    const parsed = parseInt(userAnswer, 10);
    if (parsed !== question.answer) {
      set({ userAnswer: '' });
      return false;
    }

    const reward = MONSTER_CONFIGS[activeMonster.type].reward;
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

    savePlayerProgress({ level: newLevel, coinsInLevel: newCoinsInLevel });

    set({
      phase: newPhase,
      coinsInLevel: newCoinsInLevel,
      level: newLevel,
      monsters: updatedMonsters,
      lastReward: reward,
    });
    return true;
  },

  finishRewardScreen: () =>
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
}));
