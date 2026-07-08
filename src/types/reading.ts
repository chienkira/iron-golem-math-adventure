import type { MathQuestion } from './game';

export type GameSubject = 'math' | 'reading';

export type McqReadingQuestion = {
  kind: 'mcq';
  prompt: string;
  choices: string[];
  answerIndex: number;
};

export type WordBankReadingQuestion = {
  kind: 'wordBank';
  prompt: string;
  words: string[];
  answer: string[];
};

export type ReadingQuestion = McqReadingQuestion | WordBankReadingQuestion;

export type CombatQuestion =
  | { subject: 'math'; data: MathQuestion }
  | { subject: 'reading'; data: ReadingQuestion };

export type ReadingContentPack = {
  tier: string;
  questions: Array<
    | {
        kind: 'mcq';
        prompt: string;
        choices: string[];
        answerIndex: number;
      }
    | {
        kind: 'wordBank';
        prompt: string;
        words: string[];
        answer: string[];
      }
  >;
};
