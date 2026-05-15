"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { L } from "@/lib/localization";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { VocabCard } from "@/components/VocabCard";

const BATCH_SIZE = 15;

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ReviewPage() {
  const router = useRouter();
  const { lang, learnedWords, addXp } = useStore();
  const t = L[lang] as unknown as Record<string, string>;

  // Build a stable random batch for this session. Remounts on navigation = new batch.
  const batch = useMemo(
    () => fisherYates([...learnedWords]).slice(0, BATCH_SIZE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // intentionally empty: fix the batch for the duration of this session
  );

  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const handleNext = () => {
    if (idx < batch.length - 1) {
      setIdx((i) => i + 1);
    } else {
      const earned = batch.length * 5;
      addXp(earned);
      setXpEarned(earned);
      setDone(true);
    }
  };

  // Override the last-card button label: VocabCard shows `${t.quiz} →` on the last card,
  // but in review context we want "Завершити →".
  const reviewT = { ...t, quiz: t.finish };

  // Not enough words yet
  if (learnedWords.length < 5) {
    return (
      <>
        <Header />
        <div style={{ padding: "60px 20px 100px", textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>📚</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 16 }}>
            {lang === "ua" ? "Потрібно більше слів" : "Нужно больше слов"}
          </div>
          <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 8, lineHeight: 1.6 }}>
            {lang === "ua"
              ? "Завершіть хоча б один урок, щоб почати повторення."
              : "Завершите хотя бы один урок, чтобы начать повторение."}
          </div>
          <button
            className="btn-primary"
            onClick={() => router.push("/learn")}
            style={{ marginTop: 24 }}
          >
            → {t.learn}
          </button>
        </div>
        <BottomNav />
      </>
    );
  }

  // Session complete
  if (done) {
    return (
      <>
        <Header />
        <div style={{ padding: "60px 20px 100px", textAlign: "center" }}>
          <div style={{ fontSize: 64 }}>🎉</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 16 }}>
            {lang === "ua" ? "Повторення завершено!" : "Повторение завершено!"}
          </div>
          <div style={{ fontSize: 16, color: "var(--accent)", marginTop: 8, fontWeight: 700 }}>
            +{xpEarned} XP
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
            {lang === "ua"
              ? `${batch.length} слів повторено`
              : `${batch.length} слов повторено`}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            <button
              className="btn-primary"
              onClick={() => {
                setIdx(0);
                setDone(false);
              }}
              style={{ flex: 1 }}
            >
              {lang === "ua" ? "↺ Ще раз" : "↺ Ещё раз"}
            </button>
            <button
              className="app-card app-card-interactive"
              onClick={() => router.push("/")}
              style={{
                flex: 1,
                padding: 14,
                textAlign: "center",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {lang === "ua" ? "На головну" : "На главную"}
            </button>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ padding: "0 20px 100px" }}>
        {/* Page header */}
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              fontSize: 14,
              color: "var(--text2)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            ← {lang === "ua" ? "Назад" : "Назад"}
          </button>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>
            🔄 {lang === "ua" ? "Повторення слів" : "Повторение слов"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {idx + 1} {t.of} {batch.length} · +{batch.length * 5} XP {lang === "ua" ? "за сесію" : "за сессию"}
          </div>
        </div>

        <VocabCard
          key={idx}
          word={batch[idx]}
          lang={lang}
          index={idx}
          total={batch.length}
          onNext={handleNext}
          t={reviewT}
        />
      </div>
      <BottomNav />
    </>
  );
}
