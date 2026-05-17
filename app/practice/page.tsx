"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import type { WordDifficulty } from "@/lib/store";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import type { Word } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExType = "flashcard" | "mc-cz" | "mc-native" | "context";
type DiffFilter = "all" | WordDifficulty;

interface Exercise {
  type: ExType;
  word: Word;
  options: string[];
  correctIdx: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);

function weightedSample(words: Word[], scores: Record<string, number>, n: number): Word[] {
  const pool = [...words];
  const out: Word[] = [];
  const target = Math.min(n, pool.length);

  while (out.length < target) {
    const weights = pool.map((w) => (scores[w.cz] ?? 0) + 1);
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let i = 0;
    while (i < pool.length - 1) {
      r -= weights[i];
      if (r <= 0) break;
      i++;
    }
    out.push(pool[i]);
    pool.splice(i, 1);
  }
  return out;
}

function randomType(canMC: boolean): ExType {
  if (!canMC) return "flashcard";
  const pool: ExType[] = ["flashcard", "mc-cz", "mc-cz", "mc-native", "context"];
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildExercise(word: Word, allWords: Word[], lang: "ua" | "ru", canMC: boolean): Exercise {
  const type = randomType(canMC);
  if (type === "flashcard") return { type, word, options: [], correctIdx: -1 };

  const distractors = shuffle(allWords.filter((w) => w.cz !== word.cz)).slice(0, 3);

  if (type === "mc-cz") {
    const correct = lang === "ua" ? word.ua : word.ru;
    const wrong = distractors.map((w) => (lang === "ua" ? w.ua : w.ru));
    const options = shuffle([correct, ...wrong]);
    return { type, word, options, correctIdx: options.indexOf(correct) };
  }

  const correct = word.cz;
  const wrong = distractors.map((w) => w.cz);
  const options = shuffle([correct, ...wrong]);
  return { type, word, options, correctIdx: options.indexOf(correct) };
}

function buildSession(
  practiceWords: Word[],
  allWords: Word[],
  scores: Record<string, number>,
  lang: "ua" | "ru"
): Exercise[] {
  const words = weightedSample(practiceWords, scores, 10);
  const canMC = allWords.length >= 4;
  return words.map((w) => buildExercise(w, allWords, lang, canMC));
}

// ─── UI Strings ───────────────────────────────────────────────────────────────

const S = {
  ua: {
    title: "Практика слів",
    subtitle: "Повторення вивчених слів",
    start: "Почати практику",
    again: "Ще раз",
    toHome: "На головну",
    empty: "Пройдіть хоча б один урок, щоб розпочати практику",
    emptyBtn: "Перейти до уроків",
    emptyFilter: "Немає слів з таким рівнем. Оцініть слова у словнику.",
    typesTitle: "Типи вправ у сесії:",
    types: [
      { icon: "🃏", label: "Картки — вивчення слів" },
      { icon: "🎯", label: "Чеське слово → переклад" },
      { icon: "🔄", label: "Переклад → чеське слово" },
      { icon: "📖", label: "Контекст речення" },
    ],
    filterAll: "Всі",
    filterEasy: "Легкі",
    filterMedium: "Середні",
    filterHard: "Важкі",
    reveal: "Показати переклад",
    easy: "Легко ✓",
    hard: "Важко ✗",
    qMcCz: "Що означає це слово?",
    qMcNative: "Як це сказати чеською?",
    qContext: "Яке чеське слово відповідає цьому прикладу?",
    correct: "Правильно!",
    wrong: "Неправильно",
    correctAnswer: "Правильна відповідь",
    xpPer: "+5 XP",
    next: "Далі →",
    doneTitle: "Практику завершено!",
    xpEarned: "XP зароблено",
    accuracy: "Точність",
    of: "з",
    cardLabel: "Картка",
    wordsReady: "слів готові для практики",
  },
  ru: {
    title: "Практика слов",
    subtitle: "Повторение изученных слов",
    start: "Начать практику",
    again: "Ещё раз",
    toHome: "На главную",
    empty: "Пройдите хотя бы один урок, чтобы начать практику",
    emptyBtn: "Перейти к урокам",
    emptyFilter: "Нет слов с таким уровнем. Оцените слова в словаре.",
    typesTitle: "Типы упражнений в сессии:",
    types: [
      { icon: "🃏", label: "Карточки — изучение слов" },
      { icon: "🎯", label: "Чешское слово → перевод" },
      { icon: "🔄", label: "Перевод → чешское слово" },
      { icon: "📖", label: "Контекст предложения" },
    ],
    filterAll: "Все",
    filterEasy: "Лёгкие",
    filterMedium: "Средние",
    filterHard: "Сложные",
    reveal: "Показать перевод",
    easy: "Легко ✓",
    hard: "Сложно ✗",
    qMcCz: "Что означает это слово?",
    qMcNative: "Как это сказать по-чешски?",
    qContext: "Какое чешское слово соответствует этому примеру?",
    correct: "Правильно!",
    wrong: "Неправильно",
    correctAnswer: "Правильный ответ",
    xpPer: "+5 XP",
    next: "Далее →",
    doneTitle: "Практика завершена!",
    xpEarned: "XP заработано",
    accuracy: "Точность",
    of: "из",
    cardLabel: "Карточка",
    wordsReady: "слов готовы для практики",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const router = useRouter();
  const lang = useStore((s) => s.lang);
  const learnedWords = useStore((s) => s.learnedWords);
  const wordScores = useStore((s) => s.wordScores);
  const wordDifficulty = useStore((s) => s.wordDifficulty);
  const updateWordScore = useStore((s) => s.updateWordScore);
  const setWordDifficulty = useStore((s) => s.setWordDifficulty);
  const addXp = useStore((s) => s.addXp);

  const t = S[lang];

  const [mounted, setMounted] = useState(false);
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");
  const [phase, setPhase] = useState<"ready" | "session" | "done">("ready");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [finalXP, setFinalXP] = useState(0);
  const [finalScore, setFinalScore] = useState({ correct: 0, total: 0 });
  const [displayXP, setDisplayXP] = useState(0);

  const xpRef = useRef(0);
  const correctRef = useRef(0);
  const mcTotalRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem("practiceFilter");
    if (saved === "easy" || saved === "medium" || saved === "hard") {
      setDiffFilter(saved);
      sessionStorage.removeItem("practiceFilter");
    }
  }, []);

  const filteredWords =
    diffFilter === "all"
      ? learnedWords
      : learnedWords.filter((w) => wordDifficulty[w.cz] === diffFilter);

  const hasEnough = learnedWords.length >= 4;

  const diffCounts: Record<DiffFilter, number> = {
    all: learnedWords.length,
    easy: learnedWords.filter((w) => wordDifficulty[w.cz] === "easy").length,
    medium: learnedWords.filter((w) => wordDifficulty[w.cz] === "medium").length,
    hard: learnedWords.filter((w) => wordDifficulty[w.cz] === "hard").length,
  };

  function startSession() {
    xpRef.current = 0;
    correctRef.current = 0;
    mcTotalRef.current = 0;
    const exs = buildSession(filteredWords, learnedWords, wordScores, lang);
    setExercises(exs);
    setIdx(0);
    setFlipped(false);
    setSelectedOpt(null);
    setDisplayXP(0);
    setPhase("session");
  }

  const current = exercises[idx];

  function handleSelectOption(optIdx: number) {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIdx);
    const isCorrect = optIdx === current.correctIdx;
    updateWordScore(current.word.cz, isCorrect);
    mcTotalRef.current++;
    if (isCorrect) {
      correctRef.current++;
      xpRef.current += 5;
      setDisplayXP((p) => p + 5);
    }
  }

  function handleFlashcardRate(easy: boolean) {
    updateWordScore(current.word.cz, easy);
    setWordDifficulty(current.word.cz, easy ? "easy" : "hard");
    const gain = easy ? 3 : 1;
    xpRef.current += gain;
    setDisplayXP((p) => p + gain);
    advanceOrFinish();
  }

  function advanceOrFinish() {
    if (idx + 1 >= exercises.length) {
      const bonus =
        mcTotalRef.current > 0 && correctRef.current / mcTotalRef.current >= 0.7 ? 20 : 0;
      const total = xpRef.current + bonus;
      addXp(total);
      setFinalXP(total);
      setFinalScore({ correct: correctRef.current, total: mcTotalRef.current });
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
      setSelectedOpt(null);
    }
  }

  // ── Skeleton ───────────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <>
        <Header />
        <main style={{ padding: "20px 20px 100px" }}>
          <div style={{ marginBottom: 24 }}>
            <div className="skeleton" style={{ height: 32, width: "60%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 16, width: "40%" }} />
          </div>
          <div className="skeleton" style={{ height: 90, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 160, marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 52 }} />
        </main>
        <BottomNav />
      </>
    );
  }

  // ── Ready ──────────────────────────────────────────────────────────────────

  const diffOptions: { key: DiffFilter; label: string; color: string }[] = [
    { key: "all", label: t.filterAll, color: "var(--text2)" },
    { key: "easy", label: t.filterEasy, color: "var(--green)" },
    { key: "medium", label: t.filterMedium, color: "var(--accent)" },
    { key: "hard", label: t.filterHard, color: "var(--red)" },
  ];

  if (phase === "ready") {
    return (
      <>
        <Header />
        <main className="animate-fade-in" style={{ padding: "20px 20px 100px" }}>
          <div style={{ marginBottom: 24 }}>
            <div className="gradient-text" style={{ fontSize: 26, fontWeight: 900 }}>
              {t.title}
            </div>
            <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 4 }}>
              {t.subtitle}
            </div>
          </div>

          {!hasEnough ? (
            <div className="app-card" style={{ textAlign: "center", padding: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{t.empty}</div>
              <button
                className="btn-primary"
                onClick={() => router.push("/learn")}
                style={{ marginTop: 16 }}
              >
                {t.emptyBtn}
              </button>
            </div>
          ) : (
            <>
              {/* Difficulty filter */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {diffOptions.map(({ key, label, color }) => {
                  const active = diffFilter === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setDiffFilter(key)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        border: `1.5px solid ${active ? color : "var(--card-border)"}`,
                        background: active ? `color-mix(in srgb, ${color} 15%, transparent)` : "var(--card)",
                        color: active ? color : "var(--text2)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                    >
                      {label} ({diffCounts[key]})
                    </button>
                  );
                })}
              </div>

              {filteredWords.length === 0 ? (
                <div className="app-card" style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🏷️</div>
                  <div style={{ fontSize: 14, color: "var(--text2)" }}>{t.emptyFilter}</div>
                </div>
              ) : (
                <>
                  <div className="app-card" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 48 }}>🎯</div>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "var(--accent)" }}>
                        {filteredWords.length}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text2)" }}>{t.wordsReady}</div>
                    </div>
                  </div>

                  <div className="app-card" style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 12 }}>
                      {t.typesTitle}
                    </div>
                    {t.types.map((item) => (
                      <div
                        key={item.icon}
                        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}
                      >
                        <span style={{ fontSize: 18 }}>{item.icon}</span>
                        <span style={{ fontSize: 13, color: "var(--text2)" }}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary" onClick={startSession}>
                    {t.start}
                  </button>
                </>
              )}
            </>
          )}
        </main>
        <BottomNav />
      </>
    );
  }

  // ── Done ───────────────────────────────────────────────────────────────────

  if (phase === "done") {
    const pct =
      finalScore.total > 0 ? Math.round((finalScore.correct / finalScore.total) * 100) : null;

    return (
      <>
        <Header />
        <main className="animate-pop" style={{ padding: "40px 20px 100px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>{t.doneTitle}</div>

          <div
            className="app-card"
            style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 32, overflow: "hidden" }}
          >
            <div style={{ flex: 1, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "var(--accent)" }}>{finalXP}</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>{t.xpEarned}</div>
            </div>
            {pct !== null && (
              <>
                <div style={{ width: 1, background: "var(--card-border)", alignSelf: "stretch" }} />
                <div style={{ flex: 1, padding: 20, textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: pct >= 70 ? "var(--green)" : pct >= 50 ? "var(--accent)" : "var(--red)",
                    }}
                  >
                    {pct}%
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>
                    {finalScore.correct} {t.of} {finalScore.total}
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn-primary" onClick={startSession}>
              {t.again}
            </button>
            <button className="btn-outline" onClick={() => router.push("/")}>
              {t.toHome}
            </button>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  // ── Session ────────────────────────────────────────────────────────────────

  if (!current) return null;
  const progress = (idx / exercises.length) * 100;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
          padding: "14px 20px 10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <button
            onClick={() => setPhase("ready")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text2)",
              fontSize: 18,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
          <div style={{ flex: 1, fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>
            {idx + 1} / {exercises.length}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
            {displayXP} XP
          </div>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main style={{ padding: "16px 20px 100px" }}>
        <ExerciseCard
          exercise={current}
          lang={lang}
          flipped={flipped}
          selectedOpt={selectedOpt}
          t={t}
          onFlip={() => setFlipped(true)}
          onRate={handleFlashcardRate}
          onSelect={handleSelectOption}
          onNext={advanceOrFinish}
        />
      </main>

      <BottomNav />
    </div>
  );
}

// ─── ExerciseCard ─────────────────────────────────────────────────────────────

interface CardProps {
  exercise: Exercise;
  lang: "ua" | "ru";
  flipped: boolean;
  selectedOpt: number | null;
  t: (typeof S)["ua"];
  onFlip: () => void;
  onRate: (easy: boolean) => void;
  onSelect: (idx: number) => void;
  onNext: () => void;
}

function ExerciseCard({ exercise, lang, flipped, selectedOpt, t, onFlip, onRate, onSelect, onNext }: CardProps) {
  const { type, word, options, correctIdx } = exercise;
  const native = lang === "ua" ? word.ua : word.ru;
  const exampleNative = lang === "ua" ? word.exampleUa : word.exampleRu;
  const noteNative = lang === "ua" ? word.note_ua : word.note_ru;
  const answered = selectedOpt !== null;

  if (type === "flashcard") {
    return (
      <div className="animate-slide-in">
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 16,
          }}
        >
          🃏 {t.cardLabel}
        </div>

        <div
          className="app-card"
          onClick={!flipped ? onFlip : undefined}
          style={{
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 14,
            cursor: flipped ? "default" : "pointer",
            userSelect: "none",
          }}
        >
          {!flipped ? (
            <>
              <div style={{ fontSize: 40, fontWeight: 900 }}>{word.cz}</div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text2)",
                  padding: "6px 14px",
                  border: "1px solid var(--card-border)",
                  borderRadius: 20,
                }}
              >
                {t.reveal}
              </div>
            </>
          ) : (
            <div className="animate-fade-in" style={{ width: "100%" }}>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6 }}>{word.cz}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)", marginBottom: 10 }}>
                {native}
              </div>
              {exampleNative && (
                <div style={{ fontSize: 13, color: "var(--text2)", fontStyle: "italic", marginBottom: 8 }}>
                  {exampleNative}
                </div>
              )}
              {noteNative && (
                <div
                  style={{
                    fontSize: 12,
                    padding: "6px 12px",
                    background: "var(--accent-bg)",
                    borderRadius: 10,
                    color: "var(--accent)",
                    display: "inline-block",
                  }}
                >
                  💡 {noteNative}
                </div>
              )}
            </div>
          )}
        </div>

        {flipped && (
          <div className="animate-fade-in" style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button
              onClick={() => onRate(false)}
              style={{
                flex: 1,
                padding: "14px",
                background: "rgba(239,68,68,0.1)",
                border: "2px solid var(--red)",
                borderRadius: 14,
                color: "var(--red)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t.hard}
            </button>
            <button className="btn-primary" onClick={() => onRate(true)} style={{ flex: 1 }}>
              {t.easy}
            </button>
          </div>
        )}
      </div>
    );
  }

  const questionLabel =
    type === "mc-cz" ? t.qMcCz : type === "mc-native" ? t.qMcNative : t.qContext;
  const questionDisplay =
    type === "mc-cz" ? word.cz : type === "mc-native" ? native : exampleNative || native;
  const typeEmoji = type === "mc-cz" ? "🎯" : type === "mc-native" ? "🔄" : "📖";

  return (
    <div className="animate-slide-in">
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 16,
        }}
      >
        {typeEmoji} {questionLabel}
      </div>

      <div
        className="app-card"
        style={{
          textAlign: "center",
          padding: "24px 20px",
          marginBottom: 20,
          fontSize: type === "context" ? 15 : 30,
          fontWeight: type === "context" ? 500 : 900,
          lineHeight: 1.4,
          color: type === "mc-cz" ? "var(--text)" : type === "mc-native" ? "var(--accent)" : "var(--text)",
        }}
      >
        {questionDisplay}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {options.map((opt, i) => {
          let cls = "quiz-option";
          if (answered) {
            if (i === correctIdx) cls += " correct";
            else if (i === selectedOpt) cls += " wrong";
          }
          return (
            <button key={i} className={cls} disabled={answered} onClick={() => onSelect(i)}>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="animate-fade-in">
          {selectedOpt === correctIdx ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid var(--green)",
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <span style={{ color: "var(--green)", fontWeight: 700 }}>✅ {t.correct}</span>
              <span style={{ color: "var(--green)", fontWeight: 700 }}>{t.xpPer}</span>
            </div>
          ) : (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid var(--red)",
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ color: "var(--red)", fontWeight: 700, marginBottom: 4 }}>❌ {t.wrong}</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>
                {t.correctAnswer}:{" "}
                <strong style={{ color: "var(--text)" }}>{options[correctIdx]}</strong>
              </div>
            </div>
          )}

          {noteNative && (selectedOpt !== correctIdx || type === "mc-cz") && (
            <div
              style={{
                fontSize: 12,
                padding: "8px 12px",
                background: "var(--accent-bg)",
                borderRadius: 10,
                color: "var(--text2)",
                marginBottom: 12,
              }}
            >
              💡 {noteNative}
            </div>
          )}

          <button className="btn-primary" onClick={onNext}>
            {t.next}
          </button>
        </div>
      )}
    </div>
  );
}
