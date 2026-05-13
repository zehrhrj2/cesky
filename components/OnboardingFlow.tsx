"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { LESSONS } from "@/lib/lessons";

// Allow returning users who already have lesson progress to skip onboarding


// ─── Placement test questions ───────────────────────────────────────────────

interface PlacementQ {
  level: "a0" | "a1" | "a2" | "b1";
  question_ua: string;
  question_ru: string;
  options_ua: string[];
  options_ru: string[];
  correct: number;
}

const PLACEMENT_QUESTIONS: PlacementQ[] = [
  // A0
  {
    level: "a0",
    question_ua: "Як сказати «Привіт» чеською?",
    question_ru: "Как сказать «Привет» по-чешски?",
    options_ua: ["Ahoj", "Děkuji", "Na shledanou", "Dobrý den"],
    options_ru: ["Ahoj", "Děkuji", "Na shledanou", "Dobrý den"],
    correct: 0,
  },
  {
    level: "a0",
    question_ua: "Що означає «Děkuji»?",
    question_ru: "Что означает «Děkuji»?",
    options_ua: ["Дякую", "Ні", "Так", "Привіт"],
    options_ru: ["Спасибо", "Нет", "Да", "Привет"],
    correct: 0,
  },
  {
    level: "a0",
    question_ua: "Як сказати «три» чеською?",
    question_ru: "Как сказать «три» по-чешски?",
    options_ua: ["Dva", "Tři", "Čtyři", "Pět"],
    options_ru: ["Dva", "Tři", "Čtyři", "Pět"],
    correct: 1,
  },
  {
    level: "a0",
    question_ua: "Що означає «Voda»?",
    question_ru: "Что означает «Voda»?",
    options_ua: ["Молоко", "Вода", "Кава", "Чай"],
    options_ru: ["Молоко", "Вода", "Кофе", "Чай"],
    correct: 1,
  },
  // A1
  {
    level: "a1",
    question_ua: "Як сказати «Мене звуть Анна»?",
    question_ru: "Как сказать «Меня зовут Анна»?",
    options_ua: ["Jmenuji se Anna", "Mám se dobře", "Bydlím v Praze", "Jsem student"],
    options_ru: ["Jmenuji se Anna", "Mám se dobře", "Bydlím v Praze", "Jsem student"],
    correct: 0,
  },
  {
    level: "a1",
    question_ua: "Що означає «Kde bydlíš?»",
    question_ru: "Что означает «Kde bydlíš?»",
    options_ua: ["Де ти живеш?", "Як тебе звуть?", "Що ти робиш?", "Скільки тобі років?"],
    options_ru: ["Где ты живёшь?", "Как тебя зовут?", "Что ты делаешь?", "Сколько тебе лет?"],
    correct: 0,
  },
  {
    level: "a1",
    question_ua: "Як сказати «У мене є сестра»?",
    question_ru: "Как сказать «У меня есть сестра»?",
    options_ua: ["Mám sestru", "Jsem sestra", "Mám sester", "Bydlím se sestrou"],
    options_ru: ["Mám sestru", "Jsem sestra", "Mám sester", "Bydlím se sestrou"],
    correct: 0,
  },
  // A2
  {
    level: "a2",
    question_ua: "Що означає «Byl jsem v Praze»?",
    question_ru: "Что означает «Byl jsem v Praze»?",
    options_ua: ["Я був у Празі", "Я йду до Праги", "Я живу в Празі", "Я хочу до Праги"],
    options_ru: ["Я был в Праге", "Я иду в Прагу", "Я живу в Праге", "Я хочу в Прагу"],
    correct: 0,
  },
  {
    level: "a2",
    question_ua: "Яка правильна форма? «Jdu do ___»",
    question_ru: "Какая правильная форма? «Jdu do ___»",
    options_ua: ["školy", "škola", "školu", "školou"],
    options_ru: ["školy", "škola", "školu", "školou"],
    correct: 0,
  },
  // B1
  {
    level: "b1",
    question_ua: "Що означає «Kdybych měl čas, šel bych do kina»?",
    question_ru: "Что означает «Kdybych měl čas, šel bych do kina»?",
    options_ua: [
      "Якби мав час, пішов би в кіно",
      "Якщо маю час, йду в кіно",
      "Коли мав час, ходив у кіно",
      "Я хочу піти в кіно",
    ],
    options_ru: [
      "Если бы было время, пошёл бы в кино",
      "Если есть время, иду в кино",
      "Когда было время, ходил в кино",
      "Я хочу пойти в кино",
    ],
    correct: 0,
  },
];

function scoreToLevel(score: number, total: number): "a0" | "a1" | "a2" | "b1" {
  const pct = score / total;
  if (pct >= 0.85) return "b1";
  if (pct >= 0.6) return "a2";
  if (pct >= 0.35) return "a1";
  return "a0";
}

// IDs to mark complete when placing above A0
function getLessonIdsUpTo(level: "a0" | "a1" | "a2" | "b1"): string[] {
  const order: Array<keyof typeof LESSONS> = ["a0", "a1", "a2", "b1"];
  const cutoff = order.indexOf(level);
  const ids: string[] = [];
  for (let i = 0; i < cutoff; i++) {
    const key = order[i];
    LESSONS[key].forEach((l) => { if (l.id) ids.push(l.id); });
  }
  return ids;
}

const LEVEL_LABELS: Record<string, { ua: string; ru: string; color: string; emoji: string }> = {
  a0: { ua: "A0 — Повний початківець", ru: "A0 — Полный новичок", color: "#f97316", emoji: "🌱" },
  a1: { ua: "A1 — Базовий рівень", ru: "A1 — Базовый уровень", color: "#3b82f6", emoji: "📖" },
  a2: { ua: "A2 — Передсередній", ru: "A2 — Предсредний", color: "#a855f7", emoji: "💬" },
  b1: { ua: "B1 — Середній", ru: "B1 — Средний", color: "#22c55e", emoji: "🎓" },
};

type Step = "lang" | "assess" | "test" | "result";

export function OnboardingFlow() {
  const { lang, setLang, completeOnboarding, bulkCompleteUnits, completedUnits, xp } = useStore();
  const isReturningUser = completedUnits.length > 0 || xp > 0;

  const [step, setStep] = useState<Step>("lang");
  const [testIdx, setTestIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [placedLevel, setPlacedLevel] = useState<"a0" | "a1" | "a2" | "b1">("a0");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const t = lang === "ua"
    ? {
        chooseLanguage: "Оберіть вашу мову",
        ua: "Українська 🇺🇦",
        ru: "Русский 🇷🇺",
        howMuch: "Скільки чеської ти знаєш?",
        lvl0: "Нічого — повний початківець",
        lvl0sub: "Починаємо з нуля разом!",
        lvl1: "Знаю кілька слів",
        lvl1sub: "Привіт, дякую, числа...",
        lvl2: "Знаю основні фрази",
        lvl2sub: "Можу представитись та зрозуміти просте",
        lvl3: "Маю непоганий рівень",
        lvl3sub: "Розумію та можу говорити базово",
        testTitle: "Швидкий тест розміщення",
        testSub: "Питань залишилось:",
        placing: "Визначаємо рівень...",
        resultTitle: "Ваш рівень визначено!",
        resultSub: "На основі вашого тесту ми розмістили вас на рівні:",
        startBtn: "Почати навчання →",
        skipTest: "Пропустити тест — почати з A0",
        question: "Питання",
        of: "з",
        nextQ: "Далі →",
        finishTest: "Завершити тест",
        beginner: "Ти починаєш з самого початку. Кожне слово — крок вперед!",
        welcome: "Ласкаво просимо до ČESKY!",
      }
    : {
        chooseLanguage: "Выберите ваш язык",
        ua: "Українська 🇺🇦",
        ru: "Русский 🇷🇺",
        howMuch: "Сколько чешского ты знаешь?",
        lvl0: "Ничего — полный новичок",
        lvl0sub: "Начинаем с нуля вместе!",
        lvl1: "Знаю несколько слов",
        lvl1sub: "Привет, спасибо, числа...",
        lvl2: "Знаю основные фразы",
        lvl2sub: "Могу представиться и понять простое",
        lvl3: "У меня неплохой уровень",
        lvl3sub: "Понимаю и могу говорить на базовом уровне",
        testTitle: "Быстрый тест размещения",
        testSub: "Вопросов осталось:",
        placing: "Определяем уровень...",
        resultTitle: "Ваш уровень определён!",
        resultSub: "По результатам теста мы определили ваш уровень:",
        startBtn: "Начать обучение →",
        skipTest: "Пропустить тест — начать с A0",
        question: "Вопрос",
        of: "из",
        nextQ: "Далее →",
        finishTest: "Завершить тест",
        beginner: "Вы начинаете с самого начала. Каждое слово — шаг вперёд!",
        welcome: "Добро пожаловать в ČESKY!",
      };

  const handleAssess = (level: 0 | 1 | 2 | 3) => {
    if (level === 0) {
      setPlacedLevel("a0");
      setStep("result");
    } else {
      setStep("test");
    }
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === PLACEMENT_QUESTIONS[testIdx].correct;
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (testIdx < PLACEMENT_QUESTIONS.length - 1) {
      setTestIdx((i) => i + 1);
    } else {
      const score = newAnswers.filter(Boolean).length;
      const level = scoreToLevel(score, PLACEMENT_QUESTIONS.length);
      setPlacedLevel(level);
      setStep("result");
    }
  };

  const handleStart = () => {
    const idsToComplete = getLessonIdsUpTo(placedLevel);
    if (idsToComplete.length > 0) bulkCompleteUnits(idsToComplete);
    completeOnboarding();
  };

  const currentQ = PLACEMENT_QUESTIONS[testIdx];
  const options = lang === "ua" ? currentQ?.options_ua : currentQ?.options_ru;

  // ── Renders ──────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        background: "var(--bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              background: "var(--gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
            }}
          >
            ČESKY
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
            {lang === "ua" ? "Чеська для слов'ян" : "Чешский для славян"}
          </div>
        </div>

        {/* ── Step 1: Language ─────────────────────────────────────────── */}
        {step === "lang" && (
          <div className="animate-fade-in">
            <div style={{ fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
              {t.chooseLanguage}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(["ua", "ru"] as const).map((l) => (
                <button
                  key={l}
                  className="app-card app-card-interactive"
                  onClick={() => {
                    setLang(l);
                    setStep("assess");
                  }}
                  style={{
                    padding: "18px 20px",
                    fontSize: 17,
                    fontWeight: 700,
                    textAlign: "center",
                    borderColor: lang === l ? "var(--accent)" : "var(--card-border)",
                    fontFamily: "inherit",
                  }}
                >
                  {l === "ua" ? "🇺🇦 Українська" : "🇷🇺 Русский"}
                </button>
              ))}
            </div>
            {isReturningUser && (
              <button
                onClick={completeOnboarding}
                style={{
                  marginTop: 20,
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "var(--text2)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textDecoration: "underline",
                }}
              >
                {lang === "ua" ? "← Повернутись до навчання" : "← Вернуться к обучению"}
              </button>
            )}
          </div>
        )}

        {/* ── Step 2: Self-assessment ──────────────────────────────────── */}
        {step === "assess" && (
          <div className="animate-fade-in">
            <div style={{ fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
              {t.howMuch}
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", textAlign: "center", marginBottom: 24 }}>
              {lang === "ua"
                ? "Ваша відповідь допоможе підібрати правильний рівень"
                : "Ваш ответ поможет подобрать правильный уровень"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: t.lvl0, sub: t.lvl0sub, emoji: "🌱", level: 0 as const },
                { label: t.lvl1, sub: t.lvl1sub, emoji: "📖", level: 1 as const },
                { label: t.lvl2, sub: t.lvl2sub, emoji: "💬", level: 2 as const },
                { label: t.lvl3, sub: t.lvl3sub, emoji: "🎓", level: 3 as const },
              ].map(({ label, sub, emoji, level }) => (
                <button
                  key={level}
                  className="app-card app-card-interactive"
                  onClick={() => handleAssess(level)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", textAlign: "left", fontFamily: "inherit" }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{label}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Placement test ───────────────────────────────────── */}
        {step === "test" && currentQ && (
          <div className="animate-fade-in">
            {/* Progress bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>
                <span>{t.testTitle}</span>
                <span>{testIdx + 1} {t.of} {PLACEMENT_QUESTIONS.length}</span>
              </div>
              <div style={{ height: 4, background: "var(--card-border)", borderRadius: 2, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${((testIdx + 1) / PLACEMENT_QUESTIONS.length) * 100}%`,
                    height: "100%",
                    background: "var(--gradient)",
                    borderRadius: 2,
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>

            <div className="app-card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, lineHeight: 1.5 }}>
                {lang === "ua" ? currentQ.question_ua : currentQ.question_ru}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {options?.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === currentQ.correct;
                  const showResult = selectedAnswer !== null;
                  let bg = "var(--card)";
                  let border = "var(--card-border)";
                  if (showResult) {
                    if (isCorrect) { bg = "rgba(34,197,94,0.15)"; border = "var(--green)"; }
                    else if (isSelected) { bg = "rgba(239,68,68,0.1)"; border = "var(--red)"; }
                  } else if (isSelected) {
                    border = "var(--accent)";
                    bg = "var(--accent-bg)";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: `2px solid ${border}`,
                        background: bg,
                        fontSize: 14,
                        fontWeight: 600,
                        textAlign: "left",
                        cursor: selectedAnswer !== null ? "default" : "pointer",
                        fontFamily: "inherit",
                        color: "var(--text)",
                        transition: "all 0.2s",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-primary"
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                style={{ flex: 1 }}
              >
                {testIdx < PLACEMENT_QUESTIONS.length - 1 ? t.nextQ : t.finishTest}
              </button>
            </div>

            <button
              onClick={() => { setPlacedLevel("a0"); setStep("result"); }}
              style={{
                marginTop: 12,
                width: "100%",
                background: "none",
                border: "none",
                color: "var(--text2)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t.skipTest}
            </button>
          </div>
        )}

        {/* ── Step 4: Result ───────────────────────────────────────────── */}
        {step === "result" && (
          <div className="animate-fade-in">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>
                {LEVEL_LABELS[placedLevel].emoji}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                {t.resultTitle}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
                {t.resultSub}
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "10px 28px",
                  borderRadius: 20,
                  background: LEVEL_LABELS[placedLevel].color + "22",
                  border: `2px solid ${LEVEL_LABELS[placedLevel].color}`,
                  fontSize: 18,
                  fontWeight: 900,
                  color: LEVEL_LABELS[placedLevel].color,
                }}
              >
                {lang === "ua" ? LEVEL_LABELS[placedLevel].ua : LEVEL_LABELS[placedLevel].ru}
              </div>
            </div>

            {/* What this means */}
            <div className="app-card" style={{ marginBottom: 20, borderLeft: "4px solid var(--accent)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 6 }}>
                💡 {lang === "ua" ? "Що це означає:" : "Что это означает:"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                {placedLevel === "a0" && (lang === "ua"
                  ? "Ти починаєш з нуля — і це чудово! Ми навчимо тебе кожному слову крок за кроком."
                  : "Ты начинаешь с нуля — и это замечательно! Мы научим каждому слову шаг за шагом.")}
                {placedLevel === "a1" && (lang === "ua"
                  ? "Ти вже знаєш основи! Рівень A0 відзначено завершеним. Починаємо з A1."
                  : "Ты уже знаешь основы! Уровень A0 отмечен завершённым. Начинаем с A1.")}
                {placedLevel === "a2" && (lang === "ua"
                  ? "Відмінний базовий рівень! Рівні A0–A1 відзначено завершеними. Починаємо з A2."
                  : "Отличный базовый уровень! Уровни A0–A1 отмечены завершёнными. Начинаем с A2.")}
                {placedLevel === "b1" && (lang === "ua"
                  ? "Ти вже добре знаєш чеську! Рівні A0–A2 відзначено завершеними. Продовжуємо з B1."
                  : "Ты уже хорошо знаешь чешский! Уровни A0–A2 отмечены завершёнными. Продолжаем с B1.")}
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleStart}
              style={{ width: "100%", fontSize: 16, padding: "14px" }}
            >
              {t.startBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
