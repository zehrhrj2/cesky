"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang, UserStats, Word } from "@/types";

interface AppStore extends UserStats {
  // UI state
  lang: Lang;
  dark: boolean;
  dailyLessonsToday: number;
  dailyGoal: number;
  chatMessagesCount: number;
  lastStreakDate: string | null;
  hasCompletedOnboarding: boolean;
  hasCompletedAlphabet: boolean;
  learnedWords: Word[];
  wordScores: Record<string, number>;

  // Actions
  setLang: (lang: Lang) => void;
  setDark: (dark: boolean) => void;
  addXp: (amount: number) => void;
  addWords: (count: number) => void;
  completeUnit: (unitId: string) => void;
  bulkCompleteUnits: (ids: string[]) => void;
  incrementChatMessages: () => void;
  checkAndUpdateStreak: () => void;
  resetDailyProgress: () => void;
  completeOnboarding: () => void;
  completeAlphabet: () => void;
  addLearnedWords: (words: Word[]) => void;
  updateWordScore: (cz: string, correct: boolean) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      lang: "ua",
      dark: true,
      xp: 0,
      streak: 0,
      wordsLearned: 0,
      lessonsCompleted: 0,
      completedUnits: [],
      chatMessages: 0,
      chatMessagesCount: 0,
      dailyLessonsToday: 0,
      dailyGoal: 3,
      lastStreakDate: null,
      hasCompletedOnboarding: false,
      hasCompletedAlphabet: false,
      learnedWords: [],
      wordScores: {},

      setLang: (lang) => set({ lang }),
      setDark: (dark) => set({ dark }),

      addXp: (amount) =>
        set((state) => ({ xp: state.xp + amount })),

      addWords: (count) =>
        set((state) => ({ wordsLearned: state.wordsLearned + count })),

      completeUnit: (unitId) =>
        set((state) => {
          if (state.completedUnits.includes(unitId)) return state;
          return {
            completedUnits: [...state.completedUnits, unitId],
            lessonsCompleted: state.lessonsCompleted + 1,
            dailyLessonsToday: state.dailyLessonsToday + 1,
          };
        }),

      bulkCompleteUnits: (ids: string[]) =>
        set((state) => ({
          completedUnits: [...new Set([...state.completedUnits, ...ids])],
        })),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      completeAlphabet: () =>
        set((state) => ({
          hasCompletedAlphabet: true,
          xp: state.hasCompletedAlphabet ? state.xp : state.xp + 20,
        })),

      addLearnedWords: (words: Word[]) =>
        set((state) => {
          const existing = new Set(state.learnedWords.map((w) => w.cz));
          const newWords = words.filter((w) => !existing.has(w.cz));
          return newWords.length ? { learnedWords: [...state.learnedWords, ...newWords] } : state;
        }),

      // Spaced repetition: correct answers reduce score (word shown less often),
      // incorrect answers increase score (word surfaces more often).
      updateWordScore: (cz, correct) =>
        set((state) => ({
          wordScores: {
            ...state.wordScores,
            [cz]: Math.max(0, (state.wordScores[cz] ?? 0) + (correct ? -1 : 2)),
          },
        })),

      incrementChatMessages: () =>
        set((state) => ({
          chatMessagesCount: state.chatMessagesCount + 1,
          chatMessages: (state.chatMessages || 0) + 1,
        })),

      checkAndUpdateStreak: () => {
        const today = new Date().toDateString();
        const state = get();
        if (state.lastStreakDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = state.lastStreakDate === yesterday.toDateString();

        set({
          streak: isConsecutive ? state.streak + 1 : 1,
          lastStreakDate: today,
          dailyLessonsToday: 0,
        });
      },

      resetDailyProgress: () =>
        set({ dailyLessonsToday: 0 }),
    }),
    {
      name: "cesky-app-store",
      partialize: (state) => ({
        lang: state.lang,
        dark: state.dark,
        xp: state.xp,
        streak: state.streak,
        wordsLearned: state.wordsLearned,
        lessonsCompleted: state.lessonsCompleted,
        completedUnits: state.completedUnits,
        chatMessagesCount: state.chatMessagesCount,
        chatMessages: state.chatMessages,
        dailyLessonsToday: state.dailyLessonsToday,
        lastStreakDate: state.lastStreakDate,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasCompletedAlphabet: state.hasCompletedAlphabet,
        learnedWords: state.learnedWords,
        wordScores: state.wordScores,
      }),
    }
  )
);

export function getLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXpForCurrentLevel(xp: number, level: number): number {
  return xp % (level * 100);
}

export function getXpNeededForLevel(level: number): number {
  return level * 100;
}
