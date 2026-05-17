"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { L } from "@/lib/localization";
import { getLessonById } from "@/lib/lessons";
import { VocabCard } from "@/components/VocabCard";
import { QuizQuestion } from "@/components/QuizQuestion";
import { SentenceBuilder } from "@/components/SentenceBuilder";
import { LessonComplete } from "@/components/LessonComplete";

type LessonStep = "vocab" | "sentences" | "quiz" | "done";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { lang, addXp, addWords, completeUnit, addLearnedWords, checkAndUpdateStreak } = useStore();
  const t = L[lang] as unknown as Record<string, string>;

  const lesson = getLessonById(id);

  const [step, setStep] = useState<LessonStep>(
    lesson?.words.length ? "vocab" : lesson?.sentences.length ? "sentences" : "quiz"
  );
  const [vocabIdx, setVocabIdx] = useState(0);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);

  if (!lesson) {
    return (
      <div style={{ padding: 20, textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontSize: 40 }}>🔍</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>
          {lang === "ua" ? "Урок не знайдено" : "Урок не найден"}
        </div>
        <button
          className="btn-primary"
          onClick={() => router.push("/learn")}
          style={{ marginTop: 20 }}
        >
          ← {t.learn}
        </button>
      </div>
    );
  }

  const totalSteps =
    (lesson.words.length > 0 ? 1 : 0) +
    (lesson.sentences.length > 0 ? 1 : 0) +
    (lesson.quiz.length > 0 ? 1 : 0);

  const currentStepNum =
    step === "vocab" ? 1 :
    step === "sentences" ? (lesson.words.length > 0 ? 2 : 1) :
    step === "quiz" ? totalSteps :
    totalSteps + 1;

  const progressPercent = step === "vocab"
    ? ((vocabIdx + 1) / lesson.words.length) * (33 / totalSteps) * 100
    : step === "sentences"
      ? 33 + ((sentenceIdx + 1) / lesson.sentences.length) * (33 / totalSteps) * 100
      : step === "quiz"
        ? 66 + ((quizIdx + 1) / lesson.quiz.length) * 34
        : 100;

  const handleVocabNext = () => {
    if (vocabIdx < lesson.words.length - 1) {
      setVocabIdx((i) => i + 1);
    } else {
      addWords(lesson.words.length);
      addLearnedWords(lesson.words);
      if (lesson.sentences.length > 0) {
        setStep("sentences");
      } else if (lesson.quiz.length > 0) {
        setStep("quiz");
      } else {
        finishLesson();
      }
    }
  };

  const handleSentenceComplete = () => {
    if (sentenceIdx < lesson.sentences.length - 1) {
      setSentenceIdx((i) => i + 1);
    } else {
      if (lesson.quiz.length > 0) {
        setStep("quiz");
      } else {
        finishLesson();
      }
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setQuizScore((s) => s + 1);
      addXp(15);
    }
    setQuizAnswered(true);
  };

  const handleQuizNext = () => {
    if (quizIdx < lesson.quiz.length - 1) {
      setQuizIdx((i) => i + 1);
      setQuizAnswered(false);
    } else {
      finishLesson();
    }
  };

  const finishLesson = () => {
    const xpReward = (lesson.xpReward || 50) + quizScore * 5;
    addXp(xpReward - quizScore * 5);
    completeUnit(lesson.id ?? lesson.unitKey ?? lesson.unit_key ?? "");
    checkAndUpdateStreak();
    setStep("done");
  };

  return (
    <div style={{ padding: "0 20px 40px", minHeight: "100vh" }}>
      {/* Lesson header */}
      {step !== "done" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 0",
            position: "sticky",
            top: 0,
            background: "var(--bg)",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => router.push("/learn")}
            style={{
              fontSize: 20,
              color: "var(--text)",
              background: "none",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ←
          </button>

          {/* Progress bar */}
          <div style={{ flex: 1, height: 6, background: "var(--card-border)", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min(progressPercent, 100)}%`,
                height: "100%",
                background: "var(--gradient)",
                borderRadius: 3,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            {lesson.icon ?? ""} {t[lesson.unitKey as keyof typeof t] || lesson.title_ua || lesson.unitKey || ""}
          </span>
        </div>
      )}

      {/* Step indicator badges */}
      {step !== "done" && (
        <div style={{ display: "flex", gap: 6, marginBottom: 16, justifyContent: "center" }}>
          {lesson.words.length > 0 && (
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                background: step === "vocab" ? "var(--accent-bg)" : "var(--card-border)",
                color: step === "vocab" ? "var(--accent)" : "var(--text2)",
              }}
            >
              {t.vocabulary}
            </div>
          )}
          {lesson.sentences.length > 0 && (
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                background: step === "sentences" ? "var(--accent-bg)" : "var(--card-border)",
                color: step === "sentences" ? "var(--accent)" : "var(--text2)",
              }}
            >
              {t.sentences}
            </div>
          )}
          {lesson.quiz.length > 0 && (
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                background: step === "quiz" ? "var(--accent-bg)" : "var(--card-border)",
                color: step === "quiz" ? "var(--accent)" : "var(--text2)",
              }}
            >
              {t.quiz}
            </div>
          )}
        </div>
      )}

      {/* VOCAB STEP */}
      {step === "vocab" && lesson.words.length > 0 && (
        <VocabCard
          key={vocabIdx}
          word={lesson.words[vocabIdx]}
          lang={lang}
          index={vocabIdx}
          total={lesson.words.length}
          onNext={handleVocabNext}
          t={t}
        />
      )}

      {/* SENTENCE BUILDER STEP */}
      {step === "sentences" && lesson.sentences.length > 0 && (
        <SentenceBuilder
          key={sentenceIdx}
          exercise={lesson.sentences[sentenceIdx]}
          exerciseIndex={sentenceIdx}
          total={lesson.sentences.length}
          lang={lang}
          lessonWords={lesson.words}
          onComplete={handleSentenceComplete}
          t={t}
        />
      )}

      {/* QUIZ STEP */}
      {step === "quiz" && lesson.quiz.length > 0 && (
        <div key={quizIdx}>
          <QuizQuestion
            question={lesson.quiz[quizIdx]}
            lang={lang}
            index={quizIdx}
            total={lesson.quiz.length}
            onAnswer={handleQuizAnswer}
            t={t}
          />
          {quizAnswered && (
            <button
              className="btn-primary animate-fade-in"
              onClick={handleQuizNext}
              style={{ marginTop: 16 }}
            >
              {quizIdx < lesson.quiz.length - 1 ? t.next : t.finish}
            </button>
          )}
        </div>
      )}

      {/* LESSON COMPLETE */}
      {step === "done" && (
        <LessonComplete
          quizScore={quizScore}
          quizTotal={lesson.quiz.length}
          wordsCount={lesson.words.length}
          xpEarned={(lesson.xpReward || 50) + quizScore * 15}
          lang={lang}
          isReview={(lesson.unitKey ?? lesson.unit_key ?? "").startsWith("unitReview")}
        />
      )}
    </div>
  );
}
