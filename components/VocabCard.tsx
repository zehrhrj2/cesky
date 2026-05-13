"use client";

import { useState } from "react";
import { speakCzech, speakCzechSlow } from "@/lib/speech";
import type { Word } from "@/types";
import type { Lang } from "@/types";

interface VocabCardProps {
  word: Word;
  lang: Lang;
  index: number;
  total: number;
  onNext: () => void;
  t: Record<string, string>;
}

export function VocabCard({ word, lang, index, total, onNext, t }: VocabCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    setFlipped(false);
    onNext();
  };

  return (
    <div className="animate-slide-up" key={word.cz}>
      {/* Progress indicator */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 8,
          fontSize: 12,
          color: "var(--text2)",
        }}
      >
        {t.vocabulary} {index + 1}/{total}
      </div>

      {/* Card */}
      <div
        className="app-card"
        onClick={() => setFlipped(!flipped)}
        style={{ minHeight: 220, cursor: "pointer", padding: 24 }}
      >
        {!flipped ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 172,
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                background: "var(--gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              {word.cz}
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>
              {t.tapToFlip || "Натисніть, щоб побачити переклад"}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakCzech(word.cz);
              }}
              style={{
                marginTop: 4,
                padding: "8px 20px",
                background: "var(--accent-bg)",
                color: "var(--accent)",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              🔊 {t.listen}
            </button>
          </div>
        ) : (
          <div className="animate-pop" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Czech + translation */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 26, fontWeight: 800 }}>{word.cz}</span>
              <span style={{ fontSize: 17, color: "var(--text2)" }}>
                = {lang === "ua" ? word.ua : word.ru}
              </span>
            </div>

            {/* English translation (when available) */}
            {word.en && (
              <div style={{ fontSize: 12, color: "var(--text2)", opacity: 0.7 }}>
                🇬🇧 {word.en}
              </div>
            )}

            {/* Example sentence */}
            <div
              style={{
                fontSize: 13,
                color: "var(--text2)",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              «{word.example}»
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>
              {lang === "ua" ? word.exampleUa : word.exampleRu}
            </div>

            {/* Slavic similarity note */}
            <div
              style={{
                marginTop: 4,
                padding: "8px 12px",
                background: "var(--accent-bg)",
                borderRadius: 10,
                fontSize: 12,
                color: "var(--accent)",
                lineHeight: 1.5,
              }}
            >
              💡 {lang === "ua" ? word.note_ua : word.note_ru}
            </div>

            {/* Audio buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakCzech(word.cz);
                }}
                style={{
                  padding: "6px 14px",
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 12,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                🔊 {t.listen}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakCzechSlow(word.cz);
                }}
                style={{
                  padding: "6px 14px",
                  background: "var(--card-border)",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 12,
                  color: "var(--text2)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                🐢 {t.listenSlow || "Повільно"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Difficulty rating (after flip) */}
      {flipped && (
        <div
          className="animate-fade-in"
          style={{ display: "flex", gap: 8, marginTop: 12 }}
        >
          {([t.easy, t.medium, t.hard] as string[]).map((label, i) => {
            const colors = ["var(--green)", "var(--accent)", "var(--red)"];
            return (
              <button
                key={i}
                onClick={handleNext}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  background: "var(--card)",
                  border: `2px solid ${colors[i]}`,
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  color: colors[i],
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Next button (before flip) */}
      {!flipped && (
        <button className="btn-primary" onClick={handleNext} style={{ marginTop: 16 }}>
          {index < total - 1 ? t.next : `${t.quiz} →`}
        </button>
      )}
    </div>
  );
}
