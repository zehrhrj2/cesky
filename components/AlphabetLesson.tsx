"use client";

import { useState, useRef } from "react";
import { speakCzech } from "@/lib/speech";
import { ALPHABET_LETTERS, ALPHABET_QUIZ } from "@/lib/data/alphabet-lesson";
import type { Lang } from "@/types";

type Phase = "intro" | "cards" | "quiz" | "complete";

interface AlphabetLessonProps {
  lang: Lang;
  onComplete: () => void;
}

export function AlphabetLesson({ lang, onComplete }: AlphabetLessonProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [cardIdx, setCardIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [seenCards, setSeenCards] = useState<Set<number>>(new Set());
  const touchStartX = useRef<number | null>(null);

  const letter = ALPHABET_LETTERS[cardIdx];
  const question = ALPHABET_QUIZ[quizIdx];

  const handleCardNext = () => {
    setSeenCards((s) => new Set([...s, cardIdx]));
    if (cardIdx < ALPHABET_LETTERS.length - 1) {
      setCardIdx((i) => i + 1);
    } else {
      setPhase("quiz");
    }
  };

  const handleCardPrev = () => {
    if (cardIdx > 0) setCardIdx((i) => i - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleCardNext();
    else if (diff < -50) handleCardPrev();
    touchStartX.current = null;
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === question.correct) setScore((s) => s + 1);
  };

  const handleNextQuestion = () => {
    setSelected(null);
    if (quizIdx < ALPHABET_QUIZ.length - 1) {
      setQuizIdx((i) => i + 1);
    } else {
      setPhase("complete");
    }
  };

  if (phase === "intro") {
    return (
      <div className="animate-slide-up" style={{ padding: "0 20px" }}>
        <div className="app-card" style={{ padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔤</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            {lang === "ua" ? "Чеський алфавіт" : "Чешский алфавит"}
          </div>
          <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: 24 }}>
            {lang === "ua"
              ? "Чеська мова використовує латиницю з особливими знаками. Ви вже знаєте більшість букв — давайте вивчимо ті, що звучать по-іншому!"
              : "Чешский язык использует латиницу с особыми знаками. Вы уже знаете большинство букв — давайте изучим те, что звучат иначе!"}
          </div>

          <div
            style={{
              background: "var(--accent-bg)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
              {lang === "ua" ? "Що ви вивчите:" : "Что вы изучите:"}
            </div>
            {[
              lang === "ua" ? "17 особливих чеських букв та звуків" : "17 особых чешских букв и звуков",
              lang === "ua" ? "Як вимовляти č, š, ž, ř та інші" : "Как произносить č, š, ž, ř и другие",
              lang === "ua" ? "Поради для україномовних" : "Советы для украиноязычных",
              lang === "ua" ? "10 питань для закріплення" : "10 вопросов для закрепления",
            ].map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>
                ✓ {item}
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={() => setPhase("cards")} style={{ width: "100%" }}>
            {lang === "ua" ? "Почати →" : "Начать →"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "cards") {
    return (
      <div className="animate-slide-up" style={{ padding: "0 20px" }}>
        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
          {ALPHABET_LETTERS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === cardIdx ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === cardIdx
                  ? "var(--accent)"
                  : seenCards.has(i)
                    ? "var(--green)"
                    : "var(--card-border)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Letter card */}
        <div
          className="app-card animate-pop"
          key={cardIdx}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ padding: 28, textAlign: "center", userSelect: "none" }}
        >
          {/* Letter display */}
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: "var(--accent)",
              lineHeight: 1,
              marginBottom: 4,
              fontFamily: "Space Mono, monospace",
            }}
          >
            {letter.letter}
          </div>
          <div style={{ fontSize: 18, color: "var(--text2)", marginBottom: 20, fontFamily: "Space Mono, monospace" }}>
            {letter.uppercase}
          </div>

          {/* Sound */}
          <div
            style={{
              background: "var(--accent-bg)",
              borderRadius: 10,
              padding: "10px 16px",
              marginBottom: 16,
              fontSize: 15,
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {lang === "ua" ? letter.sound_ua : letter.sound_ru}
          </div>

          {/* Example word */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => speakCzech(letter.example_cz.split("/")[0].trim())}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--card-border)",
                borderRadius: 10,
                padding: "10px 20px",
                cursor: "pointer",
                fontFamily: "inherit",
                width: "100%",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                🔊 {letter.example_cz}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>
                {lang === "ua" ? letter.example_ua : letter.example_ru}
              </div>
            </button>
          </div>

          {/* Tip */}
          {(lang === "ua" ? letter.tip_ua : letter.tip_ru) && (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "var(--green)",
                fontWeight: 600,
              }}
            >
              💡 {lang === "ua" ? letter.tip_ua : letter.tip_ru}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            className="btn-outline"
            onClick={handleCardPrev}
            disabled={cardIdx === 0}
            style={{ flex: 1, opacity: cardIdx === 0 ? 0.4 : 1 }}
          >
            ← {lang === "ua" ? "Назад" : "Назад"}
          </button>
          <button className="btn-primary" onClick={handleCardNext} style={{ flex: 2 }}>
            {cardIdx < ALPHABET_LETTERS.length - 1
              ? (lang === "ua" ? "Далі →" : "Далее →")
              : (lang === "ua" ? "До тесту →" : "К тесту →")}
          </button>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: "var(--text2)", marginTop: 10 }}>
          {lang === "ua" ? "Проведіть пальцем для навігації" : "Проведите пальцем для навигации"}
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const isAnswered = selected !== null;
    const isCorrect = selected === question.correct;

    return (
      <div className="animate-slide-up" style={{ padding: "0 20px" }}>
        {/* Progress */}
        <div style={{ textAlign: "center", marginBottom: 8, fontSize: 12, color: "var(--text2)" }}>
          {lang === "ua" ? "Питання" : "Вопрос"} {quizIdx + 1}/{ALPHABET_QUIZ.length}
        </div>
        <div style={{ height: 4, background: "var(--card-border)", borderRadius: 2, marginBottom: 16 }}>
          <div
            style={{
              height: "100%",
              width: `${((quizIdx + 1) / ALPHABET_QUIZ.length) * 100}%`,
              background: "var(--accent)",
              borderRadius: 2,
              transition: "width 0.3s",
            }}
          />
        </div>

        <div className="app-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, lineHeight: 1.4 }}>
            {lang === "ua" ? question.question_ua : question.question_ru}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map((opt, i) => {
              let bg = "var(--bg2)";
              let border = "var(--card-border)";
              let color = "var(--text)";

              if (isAnswered) {
                if (i === question.correct) {
                  bg = "rgba(34,197,94,0.15)";
                  border = "var(--green)";
                  color = "var(--green)";
                } else if (i === selected) {
                  bg = "rgba(239,68,68,0.15)";
                  border = "var(--red)";
                  color = "var(--red)";
                }
              } else if (selected === i) {
                bg = "var(--accent-bg)";
                border = "var(--accent)";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={isAnswered}
                  style={{
                    background: bg,
                    border: `2px solid ${border}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    fontSize: 15,
                    fontWeight: 600,
                    color,
                    cursor: isAnswered ? "default" : "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  {isAnswered && i === question.correct && "✅ "}
                  {isAnswered && i === selected && i !== question.correct && "❌ "}
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className="animate-pop"
              style={{
                marginTop: 16,
                padding: "10px 14px",
                borderRadius: 10,
                background: isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                fontSize: 13,
                fontWeight: 700,
                color: isCorrect ? "var(--green)" : "var(--red)",
              }}
            >
              {isCorrect
                ? (lang === "ua" ? "✅ Правильно!" : "✅ Правильно!")
                : (lang === "ua"
                  ? `❌ Правильна відповідь: ${question.options[question.correct]}`
                  : `❌ Правильный ответ: ${question.options[question.correct]}`)}
            </div>
          )}
        </div>

        {isAnswered && (
          <button className="btn-primary animate-pop" onClick={handleNextQuestion} style={{ marginTop: 16 }}>
            {quizIdx < ALPHABET_QUIZ.length - 1
              ? (lang === "ua" ? "Далі →" : "Далее →")
              : (lang === "ua" ? "Результат →" : "Результат →")}
          </button>
        )}
      </div>
    );
  }

  // phase === "complete"
  const passed = score >= 7;
  return (
    <div className="animate-slide-up" style={{ padding: "0 20px" }}>
      <div className="app-card animate-pop" style={{ padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {passed ? "🎉" : "📖"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          {passed
            ? (lang === "ua" ? "Відмінно!" : "Отлично!")
            : (lang === "ua" ? "Непогано!" : "Неплохо!")}
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: "var(--accent)", marginBottom: 4 }}>
          {score}/{ALPHABET_QUIZ.length}
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 24, lineHeight: 1.6 }}>
          {passed
            ? (lang === "ua"
              ? "Ви добре засвоїли чеський алфавіт. Час починати перший урок!"
              : "Вы хорошо усвоили чешский алфавит. Пора начинать первый урок!")
            : (lang === "ua"
              ? "Радимо повторити картки ще раз. Але можна рухатись далі — алфавіт засвоюється у процесі навчання!"
              : "Рекомендуем повторить карточки ещё раз. Но можно двигаться дальше — алфавит усваивается в процессе обучения!")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn-primary" onClick={onComplete}>
            {lang === "ua" ? "Перейти до уроків →" : "Перейти к урокам →"}
          </button>
          <button
            onClick={() => {
              setPhase("cards");
              setCardIdx(0);
              setQuizIdx(0);
              setSelected(null);
              setScore(0);
              setSeenCards(new Set());
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--text2)",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 8,
            }}
          >
            {lang === "ua" ? "🔄 Повторити алфавіт" : "🔄 Повторить алфавит"}
          </button>
        </div>
      </div>
    </div>
  );
}
