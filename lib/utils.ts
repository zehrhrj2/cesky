import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getXpForLevel(level: number): number {
  return level * 100;
}

export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getProgressPercent(xp: number): number {
  const level = getLevelFromXp(xp);
  const xpInLevel = xp % (level * 100);
  return Math.min((xpInLevel / (level * 100)) * 100, 100);
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function formatStreakText(streak: number, lang: "ua" | "ru"): string {
  if (lang === "ua") {
    if (streak === 1) return "1 день";
    if (streak < 5) return `${streak} дні`;
    return `${streak} днів`;
  } else {
    if (streak === 1) return "1 день";
    if (streak < 5) return `${streak} дня`;
    return `${streak} дней`;
  }
}

export function getDailyTip(lang: "ua" | "ru", index?: number): string {
  const tips_ua = [
    "Чеське «děkuji» дуже схоже на «дякую». Слов'янські мови мають багато спільного!",
    "«Dobrý den» — просто «добрий день»! Запам'ятати легко.",
    "Числа «dva», «tři» — ті самі, що по-українськи. Математика не змінюється!",
    "«Voda» — однакова слов'янська «вода». Шукайте знайомі кореневі слова!",
    "Вчіть по 5-10 слів на день. Через місяць матимете солідний базовий словник!",
    "Чеські відмінки схожі на українські. Ваша основа вже є!",
    "Спробуйте слухати чеський YouTube або серіали — вухо звикне до звуків.",
  ];

  const tips_ru = [
    "Чешское «dobrý den» — просто «добрый день». Начало уже знакомо!",
    "«Dva», «tři» — те же «два», «три» по-русски. Числа почти одинаковые!",
    "«Voda» одинакова в обоих языках. Ищите знакомые корни слов!",
    "Чешское «děkuji» похоже на украинское «дякую» — и то и другое легко запомнить.",
    "Учите 5-10 слов в день. Через месяц у вас будет хороший базовый словарь!",
    "Чешские падежи похожи на русские. Ваша база уже есть!",
    "Попробуйте слушать чешский YouTube — ухо привыкнет к звукам.",
  ];

  const tips = lang === "ua" ? tips_ua : tips_ru;
  const i = index ?? Math.floor(Math.random() * tips.length);
  return tips[i % tips.length];
}

export function getAchievements(stats: {
  xp: number;
  streak: number;
  wordsLearned: number;
  lessonsCompleted: number;
  chatMessagesCount: number;
  completedUnits: string[];
}) {
  return [
    {
      id: "first_word",
      icon: "🌟",
      name_ua: "Перше слово",
      name_ru: "Первое слово",
      desc_ua: "Вивчити перше слово",
      desc_ru: "Выучить первое слово",
      done: stats.wordsLearned >= 1,
    },
    {
      id: "first_lesson",
      icon: "📚",
      name_ua: "Перший урок",
      name_ru: "Первый урок",
      desc_ua: "Завершити перший урок",
      desc_ru: "Завершить первый урок",
      done: stats.lessonsCompleted >= 1,
    },
    {
      id: "streak_3",
      icon: "🔥",
      name_ua: "Серія 3 дні",
      name_ru: "Серия 3 дня",
      desc_ua: "Вчитися 3 дні поспіль",
      desc_ru: "Учиться 3 дня подряд",
      done: stats.streak >= 3,
    },
    {
      id: "first_chat",
      icon: "💬",
      name_ua: "Перша розмова",
      name_ru: "Первый разговор",
      desc_ua: "Поговорити з AI чеською",
      desc_ru: "Поговорить с AI по-чешски",
      done: stats.chatMessagesCount >= 1,
    },
    {
      id: "words_10",
      icon: "📖",
      name_ua: "10 слів",
      name_ru: "10 слов",
      desc_ua: "Вивчити 10 слів",
      desc_ru: "Выучить 10 слов",
      done: stats.wordsLearned >= 10,
    },
    {
      id: "words_50",
      icon: "🏆",
      name_ua: "50 слів",
      name_ru: "50 слов",
      desc_ua: "Вивчити 50 слів",
      desc_ru: "Выучить 50 слов",
      done: stats.wordsLearned >= 50,
    },
    {
      id: "xp_500",
      icon: "⭐",
      name_ua: "500 XP",
      name_ru: "500 XP",
      desc_ua: "Зібрати 500 XP",
      desc_ru: "Набрать 500 XP",
      done: stats.xp >= 500,
    },
    {
      id: "lessons_5",
      icon: "🎓",
      name_ua: "5 уроків",
      name_ru: "5 уроков",
      desc_ua: "Завершити 5 уроків",
      desc_ru: "Завершить 5 уроков",
      done: stats.lessonsCompleted >= 5,
    },
    {
      id: "chat_10",
      icon: "🗣️",
      name_ua: "10 повідомлень",
      name_ru: "10 сообщений",
      desc_ua: "Написати 10 повідомлень AI",
      desc_ru: "Написать 10 сообщений AI",
      done: stats.chatMessagesCount >= 10,
    },
    {
      id: "streak_7",
      icon: "💎",
      name_ua: "Тижнева серія",
      name_ru: "Недельная серия",
      desc_ua: "Вчитися 7 днів поспіль",
      desc_ru: "Учиться 7 дней подряд",
      done: stats.streak >= 7,
    },
  ];
}
