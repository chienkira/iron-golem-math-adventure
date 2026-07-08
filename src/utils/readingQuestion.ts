import type { MonsterType } from '../types/game';
import type { McqReadingQuestion, ReadingContentPack, ReadingQuestion } from '../types/reading';
import creeperPack from '../content/reading/creeper.json';
import beePack from '../content/reading/bee.json';
import zombiePack from '../content/reading/zombie.json';
import endermanPack from '../content/reading/enderman.json';
import ghastPack from '../content/reading/ghast.json';

const PACKS: Record<MonsterType, ReadingContentPack> = {
  creeper: creeperPack as ReadingContentPack,
  bee: beePack as ReadingContentPack,
  zombie: zombiePack as ReadingContentPack,
  enderman: endermanPack as ReadingContentPack,
  ghast: ghastPack as ReadingContentPack,
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleMcq(raw: ReadingContentPack['questions'][number]): McqReadingQuestion {
  if (raw.kind !== 'mcq') {
    throw new Error('Expected mcq question');
  }
  const indexed = raw.choices.map((choice, index) => ({ choice, index }));
  const shuffled = shuffle(indexed);
  return {
    kind: 'mcq',
    prompt: raw.prompt,
    choices: shuffled.map((item) => item.choice),
    answerIndex: shuffled.findIndex((item) => item.index === raw.answerIndex),
  };
}

function shuffleWordBank(raw: ReadingContentPack['questions'][number]): ReadingQuestion {
  if (raw.kind !== 'wordBank') {
    throw new Error('Expected wordBank question');
  }
  return {
    kind: 'wordBank',
    prompt: raw.prompt,
    words: shuffle(raw.words),
    answer: [...raw.answer],
  };
}

export function generateReadingQuestion(type: MonsterType): ReadingQuestion {
  const pack = PACKS[type];
  const raw = pack.questions[Math.floor(Math.random() * pack.questions.length)];

  if (type === 'creeper' || type === 'bee') {
    return shuffleMcq(raw);
  }

  return shuffleWordBank(raw);
}
