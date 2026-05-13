import type { Lesson } from "@/types";
import { A0_LESSONS } from "@/lib/data/a0-lessons";
import { A1_LESSONS } from "@/lib/data/a1-lessons";
import { A1_EXTRA_1 } from "@/lib/data/a1-extra-1";
import { A1_EXTRA_2 } from "@/lib/data/a1-extra-2";
import { A1_EXTRA_3 } from "@/lib/data/a1-extra-3";
import { A2_LESSONS } from "@/lib/data/a2-lessons";
import { A2_EXTRA_1 } from "@/lib/data/a2-extra-1";
import { A2_EXTRA_2 } from "@/lib/data/a2-extra-2";
import { A2_EXTRA_3 } from "@/lib/data/a2-extra-3";
import { A2_EXTRA_4 } from "@/lib/data/a2-extra-4";
import { A2_EXTRA_5 } from "@/lib/data/a2-extra-5";
import { A2_EXTRA_6 } from "@/lib/data/a2-extra-6";
import { A2_EXTRA_7 } from "@/lib/data/a2-extra-7";
import { A2_EXTRA_8 } from "@/lib/data/a2-extra-8";
import { A2_EXTRA_9 } from "@/lib/data/a2-extra-9";
import { B1_LESSONS } from "@/lib/data/b1-lessons";

export const LESSONS: Record<string, Lesson[]> = {
  a0: A0_LESSONS,
  a1: [...A1_LESSONS, ...A1_EXTRA_1, ...A1_EXTRA_2, ...A1_EXTRA_3],
  a2: [...A2_LESSONS, ...A2_EXTRA_1, ...A2_EXTRA_2, ...A2_EXTRA_3, ...A2_EXTRA_4, ...A2_EXTRA_5, ...A2_EXTRA_6, ...A2_EXTRA_7, ...A2_EXTRA_8, ...A2_EXTRA_9],
  b1: B1_LESSONS,
};

export function getLessonById(id: string): Lesson | undefined {
  for (const level of Object.values(LESSONS)) {
    const found = level.find((l) => l.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getLevelLessons(level: string): Lesson[] {
  return LESSONS[level] || [];
}

export const LEVEL_INFO = {
  a0: { label: "A0", color: "#f97316", desc_ua: "Повний початківець", desc_ru: "Полный новичок" },
  a1: { label: "A1", color: "#3b82f6", desc_ua: "Елементарний", desc_ru: "Элементарный" },
  a2: { label: "A2", color: "#a855f7", desc_ua: "Передсередній", desc_ru: "Предсредний" },
  b1: { label: "B1", color: "#22c55e", desc_ua: "Середній", desc_ru: "Средний" },
};
