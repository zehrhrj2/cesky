"use client";

import { useStore } from "@/lib/store";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export function Header({ showBack, onBack, title }: HeaderProps) {
  const { lang, setLang, dark, setDark, streak } = useStore();

  const handleThemeToggle = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.setAttribute("data-theme", newDark ? "dark" : "light");
  };

  if (showBack && title) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px 8px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--nav-bg)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            fontSize: 20,
            color: "var(--text)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          ←
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, flex: 1 }}>{title}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px 8px",
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 22,
            fontWeight: 700,
            background: "var(--gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ČESKY
        </span>
        <span style={{ fontSize: 10, color: "var(--text2)", marginTop: 4 }}>
          {lang === "ua" ? "Чеська для слов'ян" : "Чешский для славян"}
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "ua" ? "ru" : "ua")}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--accent)",
            padding: "4px 10px",
            border: "1.5px solid var(--accent)",
            borderRadius: 8,
            background: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {lang === "ua" ? "УКР" : "РУС"}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={handleThemeToggle}
          style={{
            fontSize: 18,
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Streak */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            color: "var(--accent)",
          }}
        >
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 800 }}>{streak}</span>
        </div>
      </div>
    </div>
  );
}
