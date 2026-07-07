import { vi } from '../i18n/vi';

export type MonsterType = 'creeper' | 'bee' | 'zombie' | 'enderman';

export type GamePhase = 'menu' | 'explore' | 'vs-intro' | 'combat' | 'victory' | 'level-up';

export interface MonsterConfig {
  type: MonsterType;
  name: string;
  maxValue: number;
  reward: number;
  scale: number;
  color: string;
  accentColor: string;
}

export interface Monster {
  id: string;
  type: MonsterType;
  position: [number, number, number];
}

export interface MathQuestion {
  a: number;
  b: number;
  operator: '+' | '-';
  answer: number;
  display: string;
}

export const MONSTER_CONFIGS: Record<MonsterType, MonsterConfig> = {
  creeper: {
    type: 'creeper',
    name: vi.monsters.creeper,
    maxValue: 30,
    reward: 20,
    scale: 1.0,
    color: '#6fa050',
    accentColor: '#3f6b30',
  },
  bee: {
    type: 'bee',
    name: vi.monsters.bee,
    maxValue: 100,
    reward: 50,
    scale: 1.05,
    color: '#f8c627',
    accentColor: '#1a1a1a',
  },
  zombie: {
    type: 'zombie',
    name: vi.monsters.zombie,
    maxValue: 200,
    reward: 70,
    scale: 1.35,
    color: '#71987a',
    accentColor: '#3a8eb2',
  },
  enderman: {
    type: 'enderman',
    name: vi.monsters.enderman,
    maxValue: 1000,
    reward: 100,
    scale: 1.65,
    color: '#161616',
    accentColor: '#e040fb',
  },
};

export const MONSTER_TYPES: MonsterType[] = ['creeper', 'bee', 'zombie', 'enderman'];

export const COINS_PER_LEVEL = 100;
