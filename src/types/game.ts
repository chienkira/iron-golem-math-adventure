export type MonsterType = 'creeper' | 'bee' | 'zombie' | 'enderman' | 'ghast';

export type GamePhase = 'menu' | 'explore' | 'vs-intro' | 'combat' | 'victory' | 'level-up';

export interface MonsterConfig {
  maxValue: number;
  reward: number;
  scale: number;
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
}

export const MONSTER_CONFIGS: Record<MonsterType, MonsterConfig> = {
  creeper: {
    maxValue: 30,
    reward: 20,
    scale: 1.0,
  },
  bee: {
    maxValue: 100,
    reward: 30,
    scale: 1.05,
  },
  zombie: {
    maxValue: 200,
    reward: 50,
    scale: 1.35,
  },
  enderman: {
    maxValue: 300,
    reward: 70,
    scale: 1.65,
  },
  ghast: {
    maxValue: 1000,
    reward: 100,
    scale: 1.65,
  },
};

export const MONSTER_TYPES: MonsterType[] = ['creeper', 'bee', 'zombie', 'enderman', 'ghast'];

export const COINS_PER_LEVEL = 100;
