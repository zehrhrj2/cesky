"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { L } from "@/lib/localization";
import { GRAMMAR_TOPICS } from "@/lib/grammar";
import { GrammarContent } from "@/components/GrammarContent";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export default function GrammarTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicKey } = use(params);
  const router = useRouter();
  const { lang, addXp } = useStore();
  const t = L[lang];

  const topic = GRAMMAR_TOPICS[topicKey];
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  if (!topic) {
    return (
      <div style={{ padding: 20, textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontSize: 40 }}>🔍</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>
          {lang === "ua" ? "Тему не знайдено" : "Тема не найдена"}
        </div>
        <button className="btn-primary" onClick={() => router.push("/grammar")} style={{ marginTop: 20 }}>
          ← {t.grammar}
        </button>
      </div>
    );
  }

  const title = lang === "ua" ? topic.title_ua : topic.title_ru;
  const quizQuestions = topic.quiz || [];

  const handleQuizAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === quizQuestions[quizIdx].correct) {
      setScore((s) => s + 1);
      addXp(10);
    }
  };

  const handleQuizNext = () => {
    if (quizIdx < quizQuestions.length - 1) {
      setQuizIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setQuizDone(true);
    }
  };

  return (
    <>
      <Header
        showBack
        title={title}
        onBack={() => router.push("/grammar")}
      />

      <div className="animate-fade-in" style={{ padding: "16px 20px 100px" }}>
        {!showQuiz ? (
          <>
            {/* Content */}
            <div className="app-card" style={{ padding: 20 }}>
              <GrammarContent topic={topic} lang={lang} />
            </div>

            {/* Quiz button */}
            {quizQuestions.length > 0 && (
              <button
                className="btn-primary"
                onClick={() => setShowQuiz(true)}
                style={{ marginTop: 16 }}
              >
                🎯 {lang === "ua" ? "Перевірити знання" : "Проверить знания"} ({quizQuestions.length}{" "}
                {lang === "ua" ? "питань" : "вопросов"})
              </button>
            )}

            {/* Back button */}
            <button
              className="btn-outline"
              onClick={() => router.push("/grammar")}
              style={{ marginTop: 10, width: "100%" }}
            >
              ← {t.back}
            </button>
          </>
        ) : quizDone ? (
          <div className="animate-pop" style={{ textAlign: "center", paddingTop: 20 }}>
            <div style={{ fontSize: 48 }}>
              {score === quizQuestions.length ? "🏆" : score > quizQuestions.length / 2 ? "⭐" : "📚"}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 12, background: "var(--gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {score === quizQuestions.length ? t.perfectScore : t.great}
            </div>
            <div className="app-card" style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 32 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--green)" }}>{score}/{quizQuestions.length}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{lang === "ua" ? "Правильно" : "Правильно"}</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)" }}>+{score * 10}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>XP</div>
              </div>
            </div>
            <button className="btn-primary" onClick={() => { setShowQuiz(false); setQuizIdx(0); setScore(0); setSelected(null); setAnswered(false); setQuizDone(false); }} style={{ marginTop: 20 }}>
              {lang === "ua" ? "Переглянути тему" : "Повторить тему"}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: "center", marginBottom: 12, fontSize: 12, color: "var(--text2)" }}>
              {t.quiz} {quizIdx + 1}/{quizQuestions.length}
            </div>

            <div className="app-card animate-slide-up" style={{ padding: 24 }}>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, textAlign: "center", lineHeight: 1.5 }}>
                {lang === "ua" ? quizQuestions[quizIdx].question_ua : quizQuestions[quizIdx].question_ru}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(quizQuestions[quizIdx].options ||
                  (lang === "ua" ? quizQuestions[quizIdx].options_ua : quizQuestions[quizIdx].options_ru) || []).map((opt, idx) => {
                  let bg = "var(--card)";
                  let border = "var(--card-border)";
                  if (answered) {
                    if (idx === quizQuestions[quizIdx].correct) { bg = "rgba(34,197,94,0.15)"; border = "var(--green)"; }
                    else if (idx === selected && idx !== quizQuestions[quizIdx].correct) { bg = "rgba(239,68,68,0.15)"; border = "var(--red)"; }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      disabled={answered}
                      className={answered && idx === quizQuestions[quizIdx].correct ? "animate-pop" : answered && idx === selected && idx !== quizQuestions[quizIdx].correct ? "animate-shake" : ""}
                      style={{ padding: "14px 18px", background: bg, border: `2px solid ${border}`, borderRadius: 14, fontSize: 15, fontWeight: 600, textAlign: "left", color: "var(--text)", cursor: answered ? "not-allowed" : "pointer", fontFamily: "inherit", width: "100%", transition: "all 0.2s" }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="animate-pop" style={{ marginTop: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: selected === quizQuestions[quizIdx].correct ? "var(--green)" : "var(--red)" }}>
                    {selected === quizQuestions[quizIdx].correct ? `✅ ${t.correct}` : `❌ ${t.incorrect}`}
                  </div>
                  {selected === quizQuestions[quizIdx].correct && <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 4 }}>+10 XP</div>}
                </div>
              )}
            </div>

            {answered && (
              <button className="btn-primary animate-fade-in" onClick={handleQuizNext} style={{ marginTop: 16 }}>
                {quizIdx < quizQuestions.length - 1 ? t.next : t.finish}
              </button>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
