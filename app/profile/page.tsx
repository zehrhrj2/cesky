"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, getLevel } from "@/lib/store";
import type { WordDifficulty } from "@/lib/store";
import { L } from "@/lib/localization";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AnimNum } from "@/components/AnimNum";
import { XPBar } from "@/components/XPBar";
import { getAchievements } from "@/lib/utils";
import { speakCzech } from "@/lib/speech";

type VocabDiffFilter = "all" | WordDifficulty;

const DIFF_CONFIG: { key: VocabDiffFilter; color: string; labelUa: string; labelRu: string }[] = [
  { key: "all",    color: "var(--text2)",  labelUa: "Всі",      labelRu: "Все"      },
  { key: "easy",   color: "var(--green)",  labelUa: "Легкі",    labelRu: "Лёгкие"  },
  { key: "medium", color: "var(--accent)", labelUa: "Середні",  labelRu: "Средние" },
  { key: "hard",   color: "var(--red)",    labelUa: "Важкі",    labelRu: "Сложные" },
];

const DIFF_LABEL: Record<WordDifficulty, { ua: string; ru: string; color: string }> = {
  easy:   { ua: "Легко",    ru: "Легко",   color: "var(--green)"  },
  medium: { ua: "Середньо", ru: "Средне",  color: "var(--accent)" },
  hard:   { ua: "Важко",    ru: "Сложно",  color: "var(--red)"    },
};

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [vocabOpen, setVocabOpen] = useState(true);
  const [vocabSearch, setVocabSearch] = useState("");
  const [vocabDiff, setVocabDiff] = useState<VocabDiffFilter>("all");

  const store = useStore();
  const {
    lang, setLang, dark, setDark, xp, streak, wordsLearned,
    lessonsCompleted, chatMessagesCount, completedUnits,
    learnedWords, wordDifficulty,
  } = store;
  const t = L[lang];
  const level = getLevel(xp);

  useEffect(() => setMounted(true), []);

  const achievements = getAchievements({
    xp, streak, wordsLearned, lessonsCompleted,
    chatMessagesCount: chatMessagesCount || 0,
    completedUnits,
  });

  const handleThemeToggle = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.setAttribute("data-theme", newDark ? "dark" : "light");
  };

  const unlockedCount = achievements.filter((a) => a.done).length;

  const filteredVocab = learnedWords.filter((w) => {
    const q = vocabSearch.toLowerCase();
    const matchSearch = !q || w.cz.toLowerCase().includes(q) || w.ua.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q);
    const matchDiff = vocabDiff === "all" || wordDifficulty[w.cz] === vocabDiff;
    return matchSearch && matchDiff;
  });

  const diffCounts: Record<VocabDiffFilter, number> = {
    all:    learnedWords.length,
    easy:   learnedWords.filter((w) => wordDifficulty[w.cz] === "easy").length,
    medium: learnedWords.filter((w) => wordDifficulty[w.cz] === "medium").length,
    hard:   learnedWords.filter((w) => wordDifficulty[w.cz] === "hard").length,
  };

  const handlePracticeFiltered = () => {
    if (vocabDiff !== "all") sessionStorage.setItem("practiceFilter", vocabDiff);
    router.push("/practice");
  };

  // ── Skeleton ───────────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <>
        <Header />
        <div style={{ padding: "0 20px 100px" }}>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <div className="skeleton" style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto" }} />
            <div className="skeleton" style={{ height: 24, width: 140, margin: "12px auto 4px" }} />
            <div className="skeleton" style={{ height: 14, width: 80, margin: "0 auto" }} />
          </div>
          <div className="skeleton" style={{ height: 80, marginTop: 20 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
            {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 90 }} />)}
          </div>
          <div className="skeleton" style={{ height: 200, marginTop: 20 }} />
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="animate-fade-in" style={{ padding: "0 20px 100px" }}>

        {/* Avatar + name */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <div
            style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "var(--gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto", fontSize: 36,
              boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
            }}
          >
            👤
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 12 }}>
            {lang === "ua" ? "Мій профіль" : "Мой профиль"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {t.level} {level}
          </div>
        </div>

        {/* XP bar */}
        <div className="app-card" style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 8 }}>
            {lang === "ua" ? "Досвід і рівень" : "Опыт и уровень"}
          </div>
          <XPBar xp={xp} />
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
          {[
            { icon: "🔥", value: streak, label: t.streak, color: "var(--accent)" },
            { icon: "📖", value: wordsLearned, label: t.vocabulary, color: "var(--green)" },
            { icon: "📚", value: lessonsCompleted, label: t.lessonsCompleted, color: "var(--blue)" },
          ].map((stat, i) => (
            <div key={i} className="app-card" style={{ textAlign: "center", padding: "14px 8px" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>
                <AnimNum value={stat.value} />
              </div>
              <div style={{ fontSize: 9, color: "var(--text2)", marginTop: 2, lineHeight: 1.3 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* My vocabulary */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setVocabOpen((v) => !v)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", background: "none", border: "none",
              cursor: "pointer", fontFamily: "inherit", marginBottom: 10, padding: 0,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>
              📖 {lang === "ua" ? "Мій словник" : "Мой словарь"}
            </div>
            <div
              style={{
                fontSize: 11, fontWeight: 700, color: "var(--accent)",
                background: "var(--accent-bg)", padding: "3px 10px",
                borderRadius: 20, display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {learnedWords.length} {lang === "ua" ? "слів" : "слов"} {vocabOpen ? "▲" : "▼"}
            </div>
          </button>

          {vocabOpen && (
            <>
              {learnedWords.length === 0 ? (
                <div className="app-card" style={{ textAlign: "center", padding: 24, color: "var(--text2)", fontSize: 13 }}>
                  {lang === "ua"
                    ? "Тут з'являться слова після першого уроку"
                    : "Здесь появятся слова после первого урока"}
                </div>
              ) : (
                <>
                  {/* Difficulty filter chips */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                    {DIFF_CONFIG.map(({ key, color, labelUa, labelRu }) => {
                      const active = vocabDiff === key;
                      const label = lang === "ua" ? labelUa : labelRu;
                      return (
                        <button
                          key={key}
                          onClick={() => setVocabDiff(key)}
                          style={{
                            padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                            border: `1.5px solid ${active ? color : "var(--card-border)"}`,
                            background: active ? `color-mix(in srgb, ${color} 15%, transparent)` : "var(--card)",
                            color: active ? color : "var(--text2)",
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                          }}
                        >
                          {label} ({diffCounts[key]})
                        </button>
                      );
                    })}
                  </div>

                  {/* Practice filtered button */}
                  <button
                    onClick={handlePracticeFiltered}
                    style={{
                      width: "100%", marginBottom: 10,
                      padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                      background: "var(--accent-bg)", color: "var(--accent)",
                      border: "1.5px solid var(--accent)", cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    🎯 {lang === "ua"
                      ? vocabDiff === "all" ? "Практикувати всі слова" : `Практикувати: ${DIFF_CONFIG.find(d => d.key === vocabDiff)?.labelUa}`
                      : vocabDiff === "all" ? "Практиковать все слова" : `Практиковать: ${DIFF_CONFIG.find(d => d.key === vocabDiff)?.labelRu}`
                    }
                  </button>

                  {/* Search */}
                  <input
                    type="text"
                    value={vocabSearch}
                    onChange={(e) => setVocabSearch(e.target.value)}
                    placeholder={lang === "ua" ? "Пошук слова..." : "Поиск слова..."}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 12,
                      border: "1.5px solid var(--card-border)", background: "var(--bg2)",
                      color: "var(--text)", fontFamily: "inherit", fontSize: 13,
                      marginBottom: 10, boxSizing: "border-box", outline: "none",
                    }}
                  />

                  {filteredVocab.length === 0 ? (
                    <div className="app-card" style={{ textAlign: "center", padding: 20, color: "var(--text2)", fontSize: 13 }}>
                      {lang === "ua" ? "Немає слів за фільтром" : "Нет слов по фильтру"}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {filteredVocab.map((word, i) => {
                        const diff = wordDifficulty[word.cz];
                        const diffInfo = diff ? DIFF_LABEL[diff] : null;
                        return (
                          <button
                            key={i}
                            onClick={() => speakCzech(word.cz)}
                            style={{
                              display: "flex", alignItems: "center", gap: 12,
                              background: "var(--card)", border: "1.5px solid var(--card-border)",
                              borderRadius: 12, padding: "10px 14px",
                              cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%",
                              transition: "border-color 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>
                                {word.cz}
                              </div>
                              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                                {lang === "ua" ? word.ua : word.ru}
                              </div>
                            </div>
                            {diffInfo && (
                              <span
                                style={{
                                  fontSize: 10, fontWeight: 700,
                                  color: diffInfo.color, padding: "2px 8px",
                                  borderRadius: 10, border: `1px solid ${diffInfo.color}`,
                                  opacity: 0.85, flexShrink: 0,
                                }}
                              >
                                {lang === "ua" ? diffInfo.ua : diffInfo.ru}
                              </span>
                            )}
                            <div style={{ fontSize: 18, opacity: 0.6 }}>🔊</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Progress overview */}
        <div className="app-card" style={{ marginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t.progress}</div>
          {[
            { label: "A0", total: 7, completed: completedUnits.filter(id => ["greetings","numbers","food","family","colors","transport","school","shopping"].includes(id)).length, color: "#f97316" },
            { label: "A1", total: 2, completed: completedUnits.filter(id => ["verbs_basic","body"].includes(id)).length, color: "#3b82f6" },
            { label: "A2", total: 1, completed: completedUnits.filter(id => ["weather"].includes(id)).length, color: "#a855f7" },
            { label: "B1", total: 1, completed: completedUnits.filter(id => ["work"].includes(id)).length, color: "#22c55e" },
          ].map((lvl) => {
            const pct = Math.min((lvl.completed / lvl.total) * 100, 100);
            return (
              <div key={lvl.label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: lvl.color }}>{lvl.label}</span>
                  <span style={{ fontSize: 11, color: "var(--text2)" }}>{lvl.completed}/{lvl.total}</span>
                </div>
                <div className="progress-bar-track">
                  <div style={{ height: "100%", width: `${pct}%`, background: lvl.color, borderRadius: 3, transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div style={{ marginTop: 24, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{t.achievements}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", background: "var(--accent-bg)", padding: "3px 10px", borderRadius: 20 }}>
              {unlockedCount}/{achievements.length}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {achievements.map((a) => (
            <div
              key={a.id}
              className="app-card"
              style={{ display: "flex", alignItems: "center", gap: 12, opacity: a.done ? 1 : 0.4 }}
            >
              <div
                style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: a.done ? "var(--accent-bg)" : "var(--card-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}
              >
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{lang === "ua" ? a.name_ua : a.name_ru}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{lang === "ua" ? a.desc_ua : a.desc_ru}</div>
              </div>
              {a.done && <span style={{ color: "var(--green)", fontWeight: 700, fontSize: 18 }}>✓</span>}
            </div>
          ))}
        </div>

        {/* Settings */}
        <div style={{ marginTop: 24, marginBottom: 12, fontSize: 16, fontWeight: 800 }}>{t.settings}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="app-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{t.language}</span>
            <button
              onClick={() => setLang(lang === "ua" ? "ru" : "ua")}
              style={{ padding: "6px 16px", background: "var(--accent-bg)", color: "var(--accent)", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              {lang === "ua" ? "🇺🇦 Українська" : "🇷🇺 Русский"}
            </button>
          </div>

          <div className="app-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{t.darkMode}</span>
            <button
              onClick={handleThemeToggle}
              style={{ padding: "6px 16px", background: "var(--accent-bg)", color: "var(--accent)", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              {dark ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>

          <div className="app-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{lang === "ua" ? "Скинути прогрес" : "Сбросить прогресс"}</div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>{lang === "ua" ? "Видалити всі дані" : "Удалить все данные"}</div>
            </div>
            <button
              onClick={() => {
                if (window.confirm(lang === "ua" ? "Скинути весь прогрес?" : "Сбросить весь прогресс?")) {
                  localStorage.removeItem("cesky-app-store");
                  window.location.reload();
                }
              }}
              style={{ padding: "6px 16px", background: "rgba(239,68,68,0.15)", color: "var(--red)", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "1.5px solid var(--red)", cursor: "pointer", fontFamily: "inherit" }}
            >
              {lang === "ua" ? "Скинути" : "Сбросить"}
            </button>
          </div>
        </div>

        {/* App info */}
        <div className="app-card" style={{ marginTop: 12, textAlign: "center", padding: "16px" }}>
          <div
            style={{
              fontFamily: "var(--font-space-mono), monospace", fontSize: 18, fontWeight: 700,
              background: "var(--gradient)", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            ČESKY
          </div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>
            {lang === "ua" ? "Версія 1.0 · Чеська для слов'ян" : "Версия 1.0 · Чешский для славян"}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
