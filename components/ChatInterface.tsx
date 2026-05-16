"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { L } from "@/lib/localization";
import { buildSystemPrompt, getChatGreeting, CHAT_MODES } from "@/lib/ai-prompts";
import type { ChatMessage } from "@/types";

export function ChatInterface() {
  const { lang, incrementChatMessages } = useStore();
  const t = L[lang];

  const [mode, setMode] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [chatError, setChatError] = useState<"unavailable" | "transient" | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectMode = (modeKey: string) => {
    setMode(modeKey);
    setChatError(null);
    setMessages([
      { role: "assistant", text: getChatGreeting(modeKey, lang) },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !mode) return;
    const userText = input.trim();
    setInput("");
    setChatError(null);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    incrementChatMessages();

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      setChatError("unavailable");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: buildSystemPrompt(mode, lang) },
            ...messages.slice(-12).map((m) => ({
              role: m.role,
              content: m.text,
            })),
            { role: "user", content: userText },
          ],
          max_tokens: 350,
          temperature: 0.75,
          stream: false,
        }),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setChatError("unavailable");
        } else {
          setChatError("transient");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || (lang === "ua"
        ? "Promiňte, zkuste to znovu.\n(Вибачте, спробуйте ще раз.)"
        : "Promiňte, zkuste to znovu.\n(Извините, попробуйте ещё раз.)");

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setChatError("transient");
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  if (!mode) {
    return (
      <div className="animate-fade-in">
        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.chat}</div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {t.chatModes}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CHAT_MODES.map((chatMode) => {
            const label =
              lang === "ua" ? chatMode.label_ua : chatMode.label_ru;
            const desc =
              lang === "ua" ? chatMode.desc_ua : chatMode.desc_ru;
            return (
              <button
                key={chatMode.key}
                className="app-card app-card-interactive"
                onClick={() => selectMode(chatMode.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "var(--accent-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  {chatMode.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                    {desc}
                  </div>
                </div>
                <span style={{ color: "var(--text2)" }}>→</span>
              </button>
            );
          })}
        </div>

        {/* Chat hint */}
        <div
          className="app-card"
          style={{ marginTop: 20, borderLeft: "4px solid var(--accent)" }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
            💡 {lang === "ua" ? "Як це працює" : "Как это работает"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
            {lang === "ua"
              ? "Пишіть чеською — AI відповість, виправить помилки та пояснить все українською мовою. Починати можна з простих фраз!"
              : "Пишите по-чешски — AI ответит, исправит ошибки и объяснит всё по-русски. Можно начать с простых фраз!"}
          </div>
        </div>
      </div>
    );
  }

  const currentMode = CHAT_MODES.find((m) => m.key === mode);
  const modeLabel = currentMode
    ? lang === "ua" ? currentMode.label_ua : currentMode.label_ru
    : mode;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 140px)",
      }}
    >
      {/* Chat header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 0 12px",
          borderBottom: "1px solid var(--card-border)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setMode(null)}
          style={{
            fontSize: 18,
            color: "var(--text)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <span style={{ fontSize: 20 }}>{currentMode?.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{modeLabel}</div>
        </div>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          style={{
            fontSize: 11,
            color: showTranslation ? "var(--accent)" : "var(--text2)",
            background: showTranslation ? "var(--accent-bg)" : "var(--card)",
            border: "1.5px solid var(--card-border)",
            borderRadius: 8,
            padding: "3px 8px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        >
          {t.showTranslation}
        </button>
      </div>

      {/* Messages */}
      <div
        className="scrollbar-hide"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className="animate-slide-in"
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              className={`chat-bubble ${msg.role === "user" ? "chat-user" : "chat-ai"}`}
            >
              {msg.text.split("\n").map((line, j) => {
                const isTranslation = line.startsWith("(") && line.endsWith(")");
                if (isTranslation && !showTranslation) return null;
                return (
                  <div
                    key={j}
                    style={{
                      color: isTranslation
                        ? msg.role === "user"
                          ? "rgba(255,255,255,0.75)"
                          : "var(--text2)"
                        : undefined,
                      fontSize: isTranslation ? 12 : undefined,
                      marginTop: isTranslation ? 4 : undefined,
                    }}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div className="chat-bubble chat-ai" style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--text2)",
                    animation: `dotBounce 1.4s ease ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Error states — shown instead of / above the input */}
      {chatError === "unavailable" && (
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid var(--card-border)",
            background: "var(--card)",
            borderRadius: "0 0 14px 14px",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>
            💬 {lang === "ua" ? "AI чат наразі недоступний" : "AI чат сейчас недоступен"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            {lang === "ua"
              ? "Сервіс тимчасово не відповідає. Спробуйте пізніше."
              : "Сервис временно не отвечает. Попробуйте позже."}
          </div>
        </div>
      )}

      {chatError === "transient" && (
        <div
          style={{
            padding: "10px 0 4px",
            borderTop: "1px solid var(--card-border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--red)",
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {lang === "ua" ? "Помилка з'єднання. Спробуйте ще раз." : "Ошибка соединения. Попробуйте ещё раз."}
            </span>
            <button
              onClick={() => setChatError(null)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontWeight: 700, fontSize: 14, padding: "0 4px" }}
            >
              ×
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={t.chatPlaceholder}
              className="app-input"
              style={{ flex: 1 }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{ padding: "12px 20px", background: "var(--gradient)", color: "#fff", borderRadius: 14, fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading || !input.trim() ? 0.5 : 1, transition: "opacity 0.2s", fontFamily: "inherit", flexShrink: 0 }}
            >
              {t.send}
            </button>
          </div>
        </div>
      )}

      {/* Normal input area */}
      {!chatError && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 0 4px",
            borderTop: "1px solid var(--card-border)",
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={t.chatPlaceholder}
            className="app-input"
            style={{ flex: 1 }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 20px",
              background: "var(--gradient)",
              color: "#fff",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.5 : 1,
              transition: "opacity 0.2s",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            {t.send}
          </button>
        </div>
      )}
    </div>
  );
}
