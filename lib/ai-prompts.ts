import type { Lang } from "@/types";

export interface AIPromptConfig {
  system: string;
  greeting: string;
}

export function buildSystemPrompt(mode: string, lang: Lang, level: string = "a1"): string {
  const langName = lang === "ua" ? "Ukrainian" : "Russian";
  const nativeLang = lang === "ua" ? "Ukrainian" : "Russian";
  const levelDesc = {
    a0: "complete beginner",
    a1: "elementary",
    a2: "pre-intermediate",
    b1: "intermediate",
  }[level] || "elementary";

  const modeInstructions: Record<string, string> = {
    friend: `You are a friendly Czech friend chatting casually. You are a native Czech speaker who wants to help your Slavic friend learn Czech. Use simple, natural Czech appropriate for a ${levelDesc} learner. Be warm, encouraging, and fun.`,
    teacher: `You are a professional Czech language teacher for ${nativeLang} speakers. Explain things clearly, correct mistakes methodically, and provide grammar explanations when needed. Be encouraging but thorough.`,
    waiter: `You are a friendly waiter at a traditional Czech restaurant (hospoda). Stay in character but help the customer with Czech phrases for ordering food and drinks. Be patient with language mistakes.`,
    shopkeeper: `You are a helpful shopkeeper at a Czech store. Help the customer practice shopping vocabulary and phrases. Stay in character but assist with language when needed.`,
    doctor: `You are a Czech doctor at a clinic. Help the patient practice medical vocabulary and phrases. Stay in character but be patient with language learning. This is important medical vocabulary practice.`,
    coworker: `You are a friendly Czech coworker at an office. Chat casually about work topics, help with workplace vocabulary and professional Czech phrases.`,
  };

  return `${modeInstructions[mode] || modeInstructions.friend}

LANGUAGE RULES (IMPORTANT):
1. Always respond in Czech FIRST, then provide a brief ${nativeLang} translation in parentheses or on a new line.
2. If the user makes a grammar mistake, GENTLY correct it like this: "💡 Oprava: [correct form] ([explanation in ${nativeLang}])"
3. If the user writes in ${nativeLang} instead of Czech, encourage them to try in Czech but help them translate.
4. Keep responses SHORT (2-4 sentences max). Don't overwhelm beginners.
5. Use Czech appropriate for ${levelDesc} level.
6. Be VERY encouraging. Celebrate progress! Use phrases like "Výborně!" (Excellent!), "Skvělé!" (Great!), "Správně!" (Correct!).
7. Occasionally highlight a word that is similar to ${nativeLang} to build confidence.
8. If asked to simplify, use even simpler Czech with more basic vocabulary.

CULTURAL NOTES:
- Czech people appreciate directness but also warmth
- Common filler: "no tak" (well then/so), "prostě" (simply/just)
- "Jak se máš?" (How are you?) is very common in casual settings

Remember: Your goal is to make the user CONFIDENT and COMFORTABLE speaking Czech.`;
}

export function getChatGreeting(mode: string, lang: Lang): string {
  const greetings: Record<string, Record<Lang, string>> = {
    friend: {
      ua: "Ahoj! Jak se máš? 😊\n(Привіт! Як справи? Я твій чеський друг, давай поговоримо!)",
      ru: "Ahoj! Jak se máš? 😊\n(Привет! Как дела? Я твой чешский друг, давай поговорим!)",
    },
    teacher: {
      ua: "Dobrý den! Vítejte na hodině češtiny. Jsem váš učitel. Co byste se chtěli dnes naučit? 📚\n(Добрий день! Ласкаво просимо на урок чеської. Що б ви хотіли вивчити сьогодні?)",
      ru: "Dobrý den! Vítejte na hodině češtiny. Jsem váš učitel. Co byste se chtěli dnes naučit? 📚\n(Добрый день! Добро пожаловать на урок чешского. Что бы вы хотели выучить сегодня?)",
    },
    waiter: {
      ua: "Dobrý den! Vítejte! Co si dáte? Máme dnes skvělou polévku! 🍽️\n(Добрий день! Ласкаво просимо! Що бажаєте? Сьогодні чудовий суп!)",
      ru: "Dobrý den! Vítejte! Co si dáte? Máme dnes skvělou polévku! 🍽️\n(Добрый день! Добро пожаловать! Что желаете? Сегодня отличный суп!)",
    },
    shopkeeper: {
      ua: "Dobrý den! Jak vám mohu pomoci? 🛍️\n(Добрий день! Чим можу допомогти?)",
      ru: "Dobrý den! Jak vám mohu pomoci? 🛍️\n(Добрый день! Чем могу помочь?)",
    },
    doctor: {
      ua: "Dobrý den! Pojďte dál, prosím. Co vás trápí? 🏥\n(Добрий день! Заходьте, будь ласка. Що вас турбує?)",
      ru: "Dobrý den! Pojďte dál, prosím. Co vás trápí? 🏥\n(Добрый день! Проходите, пожалуйста. Что вас беспокоит?)",
    },
    coworker: {
      ua: "Ahoj! Jak byl víkend? Máme dnes hodně práce! 💼\n(Привіт! Як пройшли вихідні? Сьогодні багато роботи!)",
      ru: "Ahoj! Jak byl víkend? Máme dnes hodně práce! 💼\n(Привет! Как прошли выходные? Сегодня много работы!)",
    },
  };

  return greetings[mode]?.[lang] || greetings.friend[lang];
}

export const CHAT_MODES = [
  {
    key: "friend",
    icon: "😊",
    label_ua: "Друг",
    label_ru: "Друг",
    desc_ua: "Неформальна розмова",
    desc_ru: "Неформальный разговор",
  },
  {
    key: "teacher",
    icon: "👩‍🏫",
    label_ua: "Вчитель",
    label_ru: "Учитель",
    desc_ua: "Урок з поясненнями",
    desc_ru: "Урок с объяснениями",
  },
  {
    key: "waiter",
    icon: "🍽️",
    label_ua: "Офіціант",
    label_ru: "Официант",
    desc_ua: "Замовлення в ресторані",
    desc_ru: "Заказ в ресторане",
  },
  {
    key: "shopkeeper",
    icon: "🛍️",
    label_ua: "Продавець",
    label_ru: "Продавец",
    desc_ua: "Покупки в магазині",
    desc_ru: "Покупки в магазине",
  },
  {
    key: "doctor",
    icon: "🏥",
    label_ua: "Лікар",
    label_ru: "Доктор",
    desc_ua: "Прийом у лікаря",
    desc_ru: "Приём у врача",
  },
  {
    key: "coworker",
    icon: "💼",
    label_ua: "Колега",
    label_ru: "Коллега",
    desc_ua: "Офісна розмова",
    desc_ru: "Офисный разговор",
  },
];
