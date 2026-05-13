"use client";

import { useState } from "react";
import type { QuizQuestion as QuizQuestionType } from "@/types";
import type { Lang } from "@/types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  lang: Lang;
  index: number;
  total: number;
  onAnswer: (isCorrect: boolean) => void;
  t: Record<string, string>;
}

export function QuizQuestion({
  question,
  lang,
  index,
  total,
  onAnswer,
  t,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const questionText = question.question_cz || (lang === "ua" ? question.question_ua : question.question_ru) || "";
  const options =
    question.options ||
    (lang === "ua" ? question.options_ua : question.options_ru) ||
    [];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    onAnswer(idx === question.correct);
  };

  const flashClass = answered
    ? selected === question.correct
      ? "animate-flash-green"
      : "animate-flash-red"
    : "";

  return (
    <div className={flashClass} key={`q${index}`} style={{ borderRadius: 16 }}>
      {/* Progress */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 12,
          fontSize: 12,
          color: "var(--text2)",
        }}
      >
        {t.quiz} {index + 1}/{total}
      </div>

      <div className="app-card animate-slide-up" style={{ padding: 24 }}>
        {/* Question */}
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 20,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {questionText}
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map((opt, idx) => {
            let extraClass = "";
            let bg = "var(--card)";
            let border = "var(--card-border)";

            if (answered) {
              if (idx === question.correct) {
                bg = "rgba(34,197,94,0.15)";
                border = "var(--green)";
                extraClass = idx === question.correct ? "animate-pop" : "";
              } else if (idx === selected && idx !== question.correct) {
                bg = "rgba(239,68,68,0.15)";
                border = "var(--red)";
                extraClass = "animate-shake";
              }
            }

            return (
              <button
                key={idx}
                className={extraClass}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                style={{
                  padding: "14px 18px",
                  background: bg,
                  border: `2px solid ${border}`,
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "left",
                  color: "var(--text)",
                  transition: "all 0.2s",
                  cursor: answered ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  width: "100%",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div className="animate-pop" style={{ marginTop: 16, textAlign: "center" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: selected === question.correct ? "var(--green)" : "var(--red)",
              }}
            >
              {selected === question.correct
                ? `✅ ${t.correct}`
                : `❌ ${t.incorrect}`}
            </div>
            {selected === question.correct && (
              <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 4 }}>
                +15 XP
              </div>
            )}
            {selected !== question.correct && question.explanation_ua && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text2)",
                  marginTop: 8,
                  lineHeight: 1.5,
                  padding: "8px 12px",
                  background: "var(--card-border)",
                  borderRadius: 10,
                }}
              >
                💡 {lang === "ua" ? question.explanation_ua : question.explanation_ru}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
