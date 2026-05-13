"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { L } from "@/lib/localization";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { LESSONS, LEVEL_INFO, getUnitId } from "@/lib/lessons";

export default function LearnPage() {
  const router = useRouter();
  const { lang, completedUnits, hasCompletedAlphabet } = useStore();
  const t = L[lang];

  const levels = Object.entries(LESSONS);

  return (
    <>
      <Header />
      <div className="animate-fade-in" style={{ padding: "0 20px 100px" }}>
        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.learn}</div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {lang === "ua" ? "Ваш шлях до чеської мови" : "Ваш путь к чешскому языку"}
          </div>
        </div>

        {/* Alphabet prerequisite section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: hasCompletedAlphabet ? "var(--green)" : "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🔤
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                {lang === "ua" ? "Алфавіт" : "Алфавит"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                {hasCompletedAlphabet
                  ? (lang === "ua" ? "Виконано ✓" : "Выполнено ✓")
                  : (lang === "ua" ? "Рекомендується перед A0" : "Рекомендуется перед A0")}
              </div>
            </div>
          </div>

          <button
            className="app-card"
            onClick={() => router.push("/alphabet")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderColor: hasCompletedAlphabet ? "var(--green)" : "var(--accent)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {hasCompletedAlphabet && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "var(--green)",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderBottomLeftRadius: 10,
                }}
              >
                ✓ {t.completed}
              </div>
            )}
            <div style={{ fontSize: 32, width: 48, textAlign: "center" }}>🔤</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {lang === "ua" ? "Чеський алфавіт" : "Чешский алфавит"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>
                {lang === "ua"
                  ? "17 особливих букв · картки + тест"
                  : "17 особых букв · карточки + тест"}
              </div>
              <div style={{ fontSize: 10, color: "var(--accent)", marginTop: 3, fontWeight: 700 }}>
                +20 XP
              </div>
            </div>
            <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: 18 }}>→</div>
          </button>
        </div>

        {levels.map(([levelKey, lessons], levelIndex) => {
          const levelInfo = LEVEL_INFO[levelKey as keyof typeof LEVEL_INFO];
          const isLevelLocked = levelIndex > 0 && lessons.every((l) => !completedUnits.includes(getUnitId(l))) && LESSONS[Object.keys(LESSONS)[levelIndex - 1]].every((l) => !completedUnits.includes(getUnitId(l)));

          return (
            <div key={levelKey} style={{ marginBottom: 24 }}>
              {/* Level header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: isLevelLocked ? "var(--card-border)" : levelInfo.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 14,
                  }}
                >
                  {levelInfo.label}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {lang === "ua" ? levelInfo.desc_ua : levelInfo.desc_ru}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>
                    {completedUnits.filter((id) =>
                      lessons.some((l) => getUnitId(l) === id)
                    ).length}/{lessons.length}{" "}
                    {lang === "ua" ? "уроків" : "уроков"}
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {lessons.map((unit, unitIndex) => {
                  const completed = completedUnits.includes(getUnitId(unit));
                  const prevCompleted =
                    unitIndex === 0
                      ? levelIndex === 0
                        ? true
                        : completedUnits.some((id) =>
                            LESSONS[Object.keys(LESSONS)[levelIndex - 1]].some(
                              (l) => getUnitId(l) === id
                            )
                          )
                      : completedUnits.includes(getUnitId(lessons[unitIndex - 1]));
                  const hasContent = unit.words.length > 0;
                  const unlocked = prevCompleted && hasContent;
                  const canStart = unlocked;

                  return (
                    <button
                      key={unit.id ?? unitIndex}
                      className="app-card"
                      onClick={() => canStart && router.push(`/lesson/${getUnitId(unit)}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        opacity: canStart ? 1 : 0.45,
                        borderColor: completed
                          ? "var(--green)"
                          : canStart
                            ? levelInfo.color
                            : "var(--card-border)",
                        position: "relative",
                        overflow: "hidden",
                        cursor: canStart ? "pointer" : "default",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {/* Completed badge */}
                      {completed && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "var(--green)",
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderBottomLeftRadius: 10,
                          }}
                        >
                          ✓ {t.completed}
                        </div>
                      )}

                      {/* Icon */}
                      <div style={{ fontSize: 32, width: 48, textAlign: "center" }}>
                        {unit.icon}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>
                          {(t[(unit.unitKey ?? unit.unit_key) as keyof typeof t] as string) ?? (unit.title_ua ?? unit.title_ru ?? unit.unitKey ?? unit.unit_key ?? "")}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>
                          {hasContent
                            ? `${unit.words.length} ${lang === "ua" ? "слів" : "слов"} · ${unit.quiz.length} ${lang === "ua" ? "питань" : "вопросов"}`
                            : `🔒 ${t.locked}`}
                        </div>
                        {/* XP reward */}
                        {canStart && (
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--accent)",
                              marginTop: 3,
                              fontWeight: 700,
                            }}
                          >
                            +{unit.xpReward || 50} XP
                          </div>
                        )}
                      </div>

                      {canStart && !completed && (
                        <div style={{ color: levelInfo.color, fontWeight: 700, fontSize: 18 }}>
                          →
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Motivation footer */}
        <div
          className="app-card"
          style={{ borderLeft: "4px solid var(--accent)", marginTop: 8 }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
            🚀 {lang === "ua" ? "Продовжуйте!" : "Продолжайте!"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
            {lang === "ua"
              ? "Завершіть A0 рівень, щоб відкрити AI-чат та розмовні вправи!"
              : "Завершите уровень A0, чтобы открыть AI-чат и разговорные упражнения!"}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
