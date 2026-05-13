"use client";

import { useRouter } from "next/navigation";
import { AnimNum } from "./AnimNum";
import type { Lang } from "@/types";
import { L } from "@/lib/localization";

interface LessonCompleteProps {
  quizScore: number;
  quizTotal: number;
  wordsCount: number;
  xpEarned: number;
  lang: Lang;
  onContinue?: () => void;
}

export function LessonComplete({
  quizScore,
  quizTotal,
  wordsCount,
  xpEarned,
  lang,
  onContinue,
}: LessonCompleteProps) {
  const router = useRouter();
  const t = L[lang];
  const isPerfect = quizScore === quizTotal;

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.push("/learn");
    }
  };

  return (
    <div className="animate-pop" style={{ textAlign: "center", paddingTop: 40 }}>
      <div style={{ fontSize: 64 }}>🎉</div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          marginTop: 16,
          background: "var(--gradient)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {isPerfect ? t.perfectScore : t.great}
      </div>

      <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 8 }}>
        {t.keepGoing}
      </div>

      {/* Stats card */}
      <div
        className="app-card"
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {[
          {
            value: quizScore,
            label: t.correct.replace("!", ""),
            color: "var(--green)",
          },
          {
            value: xpEarned,
            label: "XP",
            color: "var(--accent)",
            prefix: "+",
          },
          {
            value: wordsCount,
            label: t.wordsLearned,
            color: "var(--blue)",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "12px 8px",
              borderRight: i < 2 ? "1px solid var(--card-border)" : "none",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: stat.color,
              }}
            >
              {stat.prefix || ""}
              <AnimNum value={stat.value} />
            </div>
            <div style={{ fontSize: 10, color: "var(--text2)", marginTop: 2 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Streak reminder */}
      <div
        className="app-card"
        style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}
      >
        <span style={{ fontSize: 24 }}>🔥</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            {lang === "ua" ? "Серія продовжується!" : "Серия продолжается!"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text2)" }}>
            {lang === "ua"
              ? "Повертайтесь завтра, щоб не втратити серію"
              : "Возвращайтесь завтра, чтобы не потерять серию"}
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={handleContinue}
        style={{ marginTop: 20 }}
      >
        {t.continueLesson} →
      </button>
    </div>
  );
}
