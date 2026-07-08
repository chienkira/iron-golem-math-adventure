import { create } from 'zustand';
import type { GamePhase, Monster } from '../types/game';
import type { CombatQuestion, GameSubject } from '../types/reading';
import { COINS_PER_LEVEL, MONSTER_CONFIGS } from '../types/game';
import { generateQuestion } from '../utils/mathQuestion';
import { generateReadingQuestion } from '../utils/readingQuestion';
import {
  clearPlayerProgress,
  loadPlayerProgress,
  savePlayerProgress,
} from '../utils/playerProgress';
import { spawnInitialMonsters, spawnMonster } from '../utils/spawnMonsters';

interface GameState {
  phase: GamePhase;
  subject: GameSubject;
  playerPosition: [number, number, number];
  playerRotation: number;
  level: number;
  coinsInLevel: number;
  monsters: Monster[];
  activeMonster: Monster | null;
  question: CombatQuestion | null;
  userAnswer: string;
  mcqChoice: number | null;
  wordBankAnswer: string[];
  moveTarget: [number, number] | null;
  lastReward: number;
  mapZoom: 'normal' | 'overview';

  setSubject: (subject: GameSubject) => void;
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
  selectMcqChoice: (index: number) => void;
  appendWordBankWord: (word: string) => void;
  clearReadingAnswer: () => void;
  submitAnswer: () => boolean;
  finishRewardScreen: () => void;
  exitCombat: () => void;
}

const savedProgress = loadPlayerProgress();

function clearCombatAnswers() {
  return { userAnswer: '', mcqChoice: null as number | null, wordBankAnswer: [] as string[] };
}

function buildQuestion(subject: GameSubject, monsterType: Monster['type']): CombatQuestion {
  if (subject === 'math') {
    return { subject: 'math', data: generateQuestion(monsterType) };
  }
  return { subject: 'reading', data: generateReadingQuestion(monsterType) };
}

function isAnswerCorrect(
  question: CombatQuestion,
  userAnswer: string,
  mcqChoice: number | null,
  wordBankAnswer: string[],
): boolean {
  if (question.subject === 'math') {
    if (userAnswer === '') return false;
    return parseInt(userAnswer, 10) === question.data.answer;
  }

  if (question.data.kind === 'mcq') {
    if (mcqChoice === null) return false;
    return mcqChoice === question.data.answerIndex;
  }

  const expected = question.data.answer;
  if (wordBankAnswer.length === 0) return false;
  if (wordBankAnswer.length !== expected.length) return false;
  return wordBankAnswer.every((word, i) => word === expected[i]);
}

function hasAnyAnswer(
  question: CombatQuestion,
  userAnswer: string,
  mcqChoice: number | null,
  wordBankAnswer: string[],
): boolean {
  if (question.subject === 'math') return userAnswer !== '';
  if (question.data.kind === 'mcq') return mcqChoice !== null;
  return wordBankAnswer.length > 0;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  subject: savedProgress.subject ?? 'math',
  playerPosition: [0, 0, 0],
  playerRotation: 0,
  level: savedProgress.level,
  coinsInLevel: savedProgress.coinsInLevel,
  monsters: spawnInitialMonsters(),
  activeMonster: null,
  question: null,
  userAnswer: '',
  mcqChoice: null,
  wordBankAnswer: [],
  moveTarget: null,
  lastReward: 0,
  mapZoom: 'normal',

  setSubject: (subject) => {
    const { level, coinsInLevel } = get();
    savePlayerProgress({ level, coinsInLevel, subject });
    set({ subject });
  },

  setMoveTarget: (target) => set({ moveTarget: target }),

  startGame: () => set({ phase: 'explore', moveTarget: null }),

  exitToMenu: () => {
    const { level, coinsInLevel, subject } = get();
    savePlayerProgress({ level, coinsInLevel, subject });
    set({
      phase: 'menu',
      moveTarget: null,
      mapZoom: 'normal',
      activeMonster: null,
      question: null,
      ...clearCombatAnswers(),
    });
  },

  resetProgress: () => {
    const { subject } = get();
    clearPlayerProgress();
    savePlayerProgress({ level: 1, coinsInLevel: 0, subject });
    set({
      phase: 'menu',
      level: 1,
      coinsInLevel: 0,
      playerPosition: [0, 0, 0],
      playerRotation: 0,
      monsters: spawnInitialMonsters(),
      activeMonster: null,
      question: null,
      ...clearCombatAnswers(),
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
    const { subject } = get();
    set({
      phase: 'vs-intro',
      activeMonster: monster,
      question: buildQuestion(subject, monster.type),
      ...clearCombatAnswers(),
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

  selectMcqChoice: (index) => set({ mcqChoice: index }),

  appendWordBankWord: (word) => {
    const { question, wordBankAnswer } = get();
    if (!question || question.subject !== 'reading' || question.data.kind !== 'wordBank') return;

    const maxLen = question.data.answer.length;
    if (wordBankAnswer.length >= maxLen) return;
    if (wordBankAnswer.includes(word)) return;

    set({ wordBankAnswer: [...wordBankAnswer, word] });
  },

  clearReadingAnswer: () => set({ mcqChoice: null, wordBankAnswer: [] }),

  submitAnswer: () => {
    const {
      userAnswer,
      mcqChoice,
      wordBankAnswer,
      question,
      activeMonster,
      coinsInLevel,
      level,
      monsters,
      subject,
    } = get();
    if (!question || !activeMonster) return false;
    if (!hasAnyAnswer(question, userAnswer, mcqChoice, wordBankAnswer)) return false;

    const correct = isAnswerCorrect(question, userAnswer, mcqChoice, wordBankAnswer);
    if (!correct) {
      if (question.subject === 'math') {
        set({ userAnswer: '' });
      } else {
        set({ mcqChoice: null, wordBankAnswer: [] });
      }
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

    savePlayerProgress({ level: newLevel, coinsInLevel: newCoinsInLevel, subject });

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
      ...clearCombatAnswers(),
    }),

  exitCombat: () =>
    set({
      phase: 'explore',
      activeMonster: null,
      question: null,
      ...clearCombatAnswers(),
    }),
}));
