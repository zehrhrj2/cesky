"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, getLevel } from "@/lib/store";
import { L } from "@/lib/localization";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AnimNum } from "@/components/AnimNum";
import { XPBar } from "@/components/XPBar";
import { ProgressRing } from "@/components/ProgressRing";
import { getDailyTip, formatStreakText } from "@/lib/utils";
import { LESSONS, getUnitId } from "@/lib/lessons";
import { OnboardingFlow } from "@/components/OnboardingFlow";

export default function HomePage() {
  const router = useRouter();
  const {
    lang,
    dark,
    xp,
    streak,
    wordsLearned,
    lessonsCompleted,
    dailyLessonsToday,
    dailyGoal,
    checkAndUpdateStreak,
    hasCompletedOnboarding,
    learnedWords,
    completedUnits,
  } = useStore();

  const t = L[lang];
  const level = getLevel(xp);

  useEffect(() => {
    checkAndUpdateStreak();
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark, checkAndUpdateStreak]);

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  // Get next incomplete lesson
  const allLessons = Object.values(LESSONS).flat();
  const nextLesson = allLessons.find((l) => l.words.length > 0 && !completedUnits.includes(getUnitId(l)));
  const dailyPercent = Math.min((dailyLessonsToday / dailyGoal) * 100, 100);
  const dailyDone = dailyLessonsToday >= dailyGoal;

  const tip = getDailyTip(lang, new Date().getDay());

  return (
    <>
      <Header />
      <div style={{ padding: "0 20px 100px" }}>

        {/* Welcome card */}
        <div
          className="animate-fade-in"
          style={{
            marginTop: 16,
            background: "var(--gradient)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: 14, opacity: 0.9 }}>{t.greeting}! 👋</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
              {t.letsLearn}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 20 }}>
              {[
                { value: wordsLearned, label: t.wordsLearned },
                { value: lessonsCompleted, label: t.lessonsCompleted },
                { value: level, label: t.level, isLevel: true },
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>
                    {stat.isLevel ? stat.value : <AnimNum value={stat.value} />}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="app-card animate-fade-in" style={{ marginTop: 12 }}>
          <XPBar xp={xp} />
        </div>

        {/* Daily goal */}
        <div
          className="app-card animate-fade-in"
          style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}
        >
          <ProgressRing percent={dailyPercent} size={52}>
            <span style={{ fontSize: 18 }}>{dailyDone ? "✅" : "🎯"}</span>
          </ProgressRing>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {dailyDone ? t.dailyGoalComplete : t.daily}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
              {dailyLessonsToday}/{dailyGoal} {t.lessonsCompleted.toLowerCase()}
            </div>
            <div className="progress-bar-track" style={{ marginTop: 6 }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: "var(--accent)" }}>
              {streak}
            </span>
          </div>
        </div>

        {/* Continue / Start lesson */}
        {nextLesson && (
          <button
            className="btn-primary animate-fade-in"
            onClick={() => router.push(`/lesson/${getUnitId(nextLesson)}`)}
            style={{ marginTop: 16 }}
          >
            {completedUnits.length === 0 ? t.startLesson : t.continueLesson} →{" "}
            {nextLesson.icon} {t[nextLesson.unitKey as keyof typeof t] as string}
          </button>
        )}

        {/* Review card — appears once user has enough words to practice */}
        {learnedWords.length >= 10 && (
          <button
            className="app-card app-card-interactive animate-fade-in"
            onClick={() => router.push("/review")}
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
              textAlign: "left",
              borderColor: "var(--accent)",
            }}
          >
            <div style={{ fontSize: 32 }}>🔄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{t.reviewWords}</div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                {learnedWords.length}{" "}
                {lang === "ua" ? "слів у словнику" : "слов в словаре"}{" "}
                · +{Math.min(learnedWords.length, 15) * 5} XP
              </div>
            </div>
            <div style={{ color: "var(--accent)", fontSize: 18, fontWeight: 700 }}>→</div>
          </button>
        )}

        {/* Quick actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 16,
          }}
        >
          {[
            { icon: "📚", label: t.newLesson, path: "/learn" },
            { icon: "🧠", label: t.grammar, path: "/grammar" },
            { icon: "💬", label: t.chat, path: "/chat" },
            { icon: "👤", label: t.profile, path: "/profile" },
          ].map((item, i) => (
            <button
              key={i}
              className="app-card app-card-interactive animate-fade-in"
              onClick={() => router.push(item.path)}
              style={{ textAlign: "center", padding: 20 }}
            >
              <div style={{ fontSize: 28 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>
                {item.label}
              </div>
            </button>
          ))}
        </div>

        {/* Daily streak calendar */}
        <div className="app-card animate-fade-in" style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 10 }}>
            🔥 {t.streak}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: 7 }, (_, i) => {
              const active = i < Math.min(streak, 7);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 32,
                    borderRadius: 8,
                    background: active ? "var(--gradient)" : "var(--card-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    transition: "all 0.3s",
                  }}
                >
                  {active ? "🔥" : ""}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 8, textAlign: "center" }}>
            {formatStreakText(streak, lang)}
          </div>
        </div>

        {/* Tip of the day */}
        <div
          className="app-card animate-fade-in"
          style={{ marginTop: 12, borderLeft: "4px solid var(--accent)" }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: 6,
            }}
          >
            💡 {t.tipTitle}
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--text2)",
            }}
          >
            {tip}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
