"use client";

import { useState, useEffect } from "react";
import { speakCzech } from "@/lib/speech";
import type { SentenceExercise, Word } from "@/types";
import type { Lang } from "@/types";

// Translations for common Czech grammar words not taught as vocabulary
const GRAMMAR_DICT: Record<string, { ua: string; ru: string }> = {
  a: { ua: "і", ru: "и" },
  je: { ua: "є", ru: "есть" },
  jsou: { ua: "є (вони)", ru: "есть (они)" },
  jsem: { ua: "я є", ru: "я есть" },
  jsi: { ua: "ти є", ru: "ты есть" },
  v: { ua: "в", ru: "в" },
  ve: { ua: "в", ru: "в" },
  do: { ua: "до", ru: "до" },
  na: { ua: "на", ru: "на" },
  z: { ua: "з", ru: "из" },
  ze: { ua: "з", ru: "из" },
  za: { ua: "за", ru: "за" },
  mi: { ua: "мені", ru: "мне" },
  mě: { ua: "мене", ru: "меня" },
  se: { ua: "себе", ru: "себя" },
  si: { ua: "собі", ru: "себе" },
  moje: { ua: "моя", ru: "моя" },
  můj: { ua: "мій", ru: "мой" },
  jak: { ua: "як", ru: "как" },
  kde: { ua: "де", ru: "где" },
  co: { ua: "що", ru: "что" },
  kdo: { ua: "хто", ru: "кто" },
  čerstvá: { ua: "свіжа", ru: "свежая" },
  zdravá: { ua: "корисна", ru: "полезная" },
  rychlé: { ua: "швидке", ru: "быстрое" },
  krásné: { ua: "прекрасне", ru: "прекрасное" },
  doma: { ua: "вдома", ru: "дома" },
  hezky: { ua: "гарно", ru: "хорошо" },
  rychle: { ua: "швидко", ru: "быстро" },
  mám: { ua: "маю", ru: "у меня есть" },
  máš: { ua: "маєш", ru: "у тебя есть" },
  jdu: { ua: "іду", ru: "иду" },
  jde: { ua: "іде", ru: "идёт" },
  jedu: { ua: "їду", ru: "еду" },
  jede: { ua: "їде", ru: "едет" },
  čtu: { ua: "читаю", ru: "читаю" },
  vaří: { ua: "варить", ru: "варит" },
  píše: { ua: "пише", ru: "пишет" },
  bije: { ua: "б'ється", ru: "бьётся" },
  bolí: { ua: "болить", ru: "болит" },
  podej: { ua: "подай", ru: "подай" },
  dáte: { ua: "дасте", ru: "дадите" },
  chtěl: { ua: "хотів", ru: "хотел" },
  bych: { ua: "би", ru: "бы" },
  bylo: { ua: "було", ru: "было" },
  lidi: { ua: "люди", ru: "люди" },
  kočky: { ua: "кішки", ru: "кошки" },
  korun: { ua: "крон", ru: "крон" },
  dní: { ua: "днів", ru: "дней" },
  týdnu: { ua: "тижень", ru: "неделю" },
  let: { ua: "років", ru: "лет" },
  školy: { ua: "школи", ru: "школы" },
  třídě: { ua: "в класі", ru: "в классе" },
  tabuli: { ua: "дошку", ru: "доску" },
  ruku: { ua: "руку", ru: "руку" },
  polévku: { ua: "суп", ru: "суп" },
  autobusem: { ua: "автобусом", ru: "автобусом" },
  prahy: { ua: "Праги", ru: "в Прагу" },
  nebe: { ua: "небо", ru: "небо" },
  student: { ua: "студент", ru: "студент" },
};

const PUNCT = new Set([",", ".", "!", "?", ":", ";"]);

function fisherYates(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWordHint(word: string, knownWords: Set<string>, lang: Lang): string | null {
  if (PUNCT.has(word)) return null;
  const lower = word.toLowerCase();
  if (knownWords.has(lower)) return null;
  const entry = GRAMMAR_DICT[lower];
  if (!entry) return null;
  return lang === "ua" ? entry.ua : entry.ru;
}

interface SentenceBuilderProps {
  exercise: SentenceExercise;
  exerciseIndex: number;
  total: number;
  lang: Lang;
  lessonWords?: Word[];
  onComplete: (isCorrect: boolean) => void;
  t: Record<string, string>;
}

export function SentenceBuilder({
  exercise,
  exerciseIndex,
  total,
  lang,
  lessonWords = [],
  onComplete,
  t,
}: SentenceBuilderProps) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [available, setAvailable] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const knownWords = new Set(lessonWords.map((w) => w.cz.toLowerCase()));

  useEffect(() => {
    const indices = exercise.cz.map((_, i) => i);
    const correctStr = exercise.correctOrder.join(",");
    let shuffled = fisherYates(indices);
    // Guard: if the shuffle accidentally produced the correct order, reshuffle.
    // Only possible on short sentences; loop terminates quickly.
    while (indices.length > 1 && shuffled.join(",") === correctStr) {
      shuffled = fisherYates(indices);
    }
    setAvailable(shuffled);
    setPlaced([]);
    setChecked(false);
  }, [exercise]);

  const handlePlace = (idx: number) => {
    if (checked) return;
    setAvailable((a) => a.filter((i) => i !== idx));
    setPlaced((p) => [...p, idx]);
  };

  const handleRemove = (idx: number) => {
    if (checked) return;
    setPlaced((p) => p.filter((i) => i !== idx));
    setAvailable((a) => [...a, idx]);
  };

  const handleCheck = () => {
    const correct = placed.join(",") === exercise.correctOrder.join(",");
    setIsCorrect(correct);
    setChecked(true);
    speakCzech(
      exercise.correctOrder
        .map((i) => exercise.cz[i])
        .join(" ")
        .replace(/\s+([,!?.])/g, "$1")
    );
  };

  const handleNext = () => {
    onComplete(isCorrect);
  };

  // Always reconstruct the sentence from correctOrder so the audio matches
  // what the user built, not the raw cz[] array order (which could differ)
  const sentence = exercise.correctOrder
    .map((i) => exercise.cz[i])
    .join(" ")
    .replace(/\s+([,!?.])/g, "$1");
  const hint = lang === "ua" ? exercise.hint_ua : exercise.hint_ru;

  return (
    <div className="animate-slide-up">
      {/* Progress */}
      <div style={{ textAlign: "center", marginBottom: 8, fontSize: 12, color: "var(--text2)" }}>
        {t.sentences} {exerciseIndex + 1}/{total}
      </div>

      <div className="app-card" style={{ padding: 20 }}>
        {/* Sentence target */}
        {hint && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              background: "var(--accent-bg)",
              borderRadius: 10,
              borderLeft: "3px solid var(--accent)",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 3 }}>
              {lang === "ua" ? "Складіть речення:" : "Составьте предложение:"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{hint}</div>
          </div>
        )}

        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--accent)" }}>
          🔀 {t.dragWords || "Складіть речення"}
        </div>

        {/* Drop zone */}
        <div
          style={{
            minHeight: 52,
            padding: "8px 12px",
            background: "var(--bg2)",
            borderRadius: 12,
            border: `2px dashed ${checked ? (isCorrect ? "var(--green)" : "var(--red)") : "var(--card-border)"}`,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
            marginBottom: 16,
            transition: "border-color 0.3s",
          }}
        >
          {placed.length === 0 ? (
            <span style={{ color: "var(--text2)", fontSize: 13 }}>
              {lang === "ua" ? "Натискайте слова нижче..." : "Нажимайте слова ниже..."}
            </span>
          ) : (
            placed.map((idx) => (
              <button
                key={idx}
                className="word-chip word-chip-placed"
                onClick={() => handleRemove(idx)}
                disabled={checked}
                style={{
                  fontFamily: "inherit",
                  background: checked
                    ? isCorrect
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(239,68,68,0.15)"
                    : "var(--card)",
                  borderColor: checked
                    ? isCorrect ? "var(--green)" : "var(--red)"
                    : "var(--card-border)",
                }}
              >
                {exercise.cz[idx]}
              </button>
            ))
          )}
        </div>

        {/* Available words with grammar hints */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {available.map((idx) => {
            const word = exercise.cz[idx];
            const hint = getWordHint(word, knownWords, lang);
            return (
              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <button
                  className="word-chip word-chip-available"
                  onClick={() => handlePlace(idx)}
                  disabled={checked}
                  style={{ fontFamily: "inherit" }}
                >
                  {word}
                </button>
                {hint && (
                  <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600, opacity: 0.85 }}>
                    {hint}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        {checked && (
          <div
            className="animate-pop"
            style={{
              marginTop: 16,
              padding: "10px 14px",
              borderRadius: 12,
              background: isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            }}
          >
            <div style={{ fontWeight: 700, color: isCorrect ? "var(--green)" : "var(--red)", fontSize: 15, marginBottom: 4 }}>
              {isCorrect ? `✅ ${t.correct}` : `❌ ${t.incorrect}`}
            </div>
            {!isCorrect && (
              <div style={{ fontSize: 13, color: "var(--text2)" }}>✓ {sentence}</div>
            )}
            {isCorrect && (
              <button
                onClick={() => speakCzech(sentence)}
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  marginTop: 4,
                }}
              >
                🔊 {t.listen}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        {!checked ? (
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={placed.length === 0}
          >
            {t.checkAnswer || "Перевірити"}
          </button>
        ) : (
          <button className="btn-primary" onClick={handleNext}>
            {exerciseIndex < total - 1 ? t.next : `${t.quiz} →`}
          </button>
        )}
      </div>
    </div>
  );
}
