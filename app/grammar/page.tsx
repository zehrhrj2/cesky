"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { L } from "@/lib/localization";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { GRAMMAR_TOPICS, GRAMMAR_CATEGORIES } from "@/lib/grammar";

export default function GrammarPage() {
  const router = useRouter();
  const lang = useStore((s) => s.lang);
  const t = L[lang];

  return (
    <>
      <Header />
      <div className="animate-fade-in" style={{ padding: "0 20px 100px" }}>
        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.grammar}</div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {t.grammarTopics}
          </div>
        </div>

        {/* Info card */}
        <div
          className="app-card"
          style={{ marginBottom: 16, background: "var(--accent-bg)", borderColor: "var(--accent)" }}
        >
          <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>
            💡{" "}
            {lang === "ua"
              ? "Граматика чеської схожа на українську! Використовуйте це для швидкого навчання."
              : "Грамматика чешского похожа на русскую! Используйте это для быстрого обучения."}
          </div>
        </div>

        {/* Grammar topics grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {GRAMMAR_CATEGORIES.map((cat) => {
            const topic = GRAMMAR_TOPICS[cat.key];
            if (!topic) return null;

            const title = lang === "ua" ? topic.title_ua : topic.title_ru;
            const hasQuiz = topic.quiz && topic.quiz.length > 0;

            return (
              <button
                key={cat.key}
                className="app-card app-card-interactive"
                onClick={() => router.push(`/grammar/${cat.key}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: cat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {cat.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
                  {hasQuiz && (
                    <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>
                      {topic.quiz!.length}{" "}
                      {lang === "ua" ? "питань для практики" : "вопросов для практики"}
                    </div>
                  )}
                </div>

                <span style={{ color: "var(--text2)", fontSize: 16 }}>→</span>
              </button>
            );
          })}
        </div>

        {/* Coming soon topics */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text2)",
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {lang === "ua" ? "Незабаром" : "Скоро"}
          </div>
          {[
            { icon: "📊", label: lang === "ua" ? "Множина" : "Множественное число" },
            { icon: "🔮", label: lang === "ua" ? "Майбутній час" : "Будущее время" },
            { icon: "🎯", label: lang === "ua" ? "Вид дієслова" : "Вид глагола" },
          ].map((item, i) => (
            <div
              key={i}
              className="app-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 8,
                opacity: 0.4,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "var(--card-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>
                  🔒 {t.locked}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
