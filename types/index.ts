export type Lang = "ua" | "ru";

export interface Word {
  cz: string;
  en?: string;
  ua: string;
  ru: string;
  example: string;
  exampleUa: string;
  exampleRu: string;
  note_ua: string;
  note_ru: string;
  audio?: string;
}

export interface SentenceExercise {
  cz: string[];
  correctOrder: number[];
  hint_ua?: string;
  hint_ru?: string;
}

export interface QuizQuestion {
  question_cz?: string;
  question_ua?: string;
  question_ru?: string;
  options?: string[];
  options_ua?: string[];
  options_ru?: string[];
  correct: number;
  explanation_ua?: string;
  explanation_ru?: string;
}

export interface Lesson {
  id?: string;
  icon?: string;
  unitKey?: string;
  unit_key?: string;
  title_ua?: string;
  title_ru?: string;
  level: "a0" | "a1" | "a2" | "b1";
  words: Word[];
  sentences: SentenceExercise[];
  quiz: QuizQuestion[];
  xpReward?: number;
  xp?: number;
}

export interface GrammarTopic {
  title_ua: string;
  title_ru: string;
  content_ua: string;
  content_ru: string;
  icon: string;
  color: string;
  quiz?: QuizQuestion[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  correction?: string;
  timestamp?: number;
}

export interface ChatMode {
  key: string;
  icon: string;
  label_ua: string;
  label_ru: string;
  greeting_ua: string;
  greeting_ru: string;
}

export interface Achievement {
  id: string;
  icon: string;
  name_ua: string;
  name_ru: string;
  desc_ua: string;
  desc_ru: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  xp: number;
  streak: number;
  wordsLearned: number;
  lessonsCompleted: number;
  chatMessages: number;
  completedUnits: string[];
}

export interface DailyQuest {
  id: string;
  icon: string;
  desc_ua: string;
  desc_ru: string;
  target: number;
  current: number;
  xpReward: number;
}
