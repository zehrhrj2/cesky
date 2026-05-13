"use client";

import type { ReactNode } from "react";
import type { GrammarTopic } from "@/types";
import type { Lang } from "@/types";

interface GrammarContentProps {
  topic: GrammarTopic;
  lang: Lang;
}

function parseMarkdown(text: string): ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("| ")) {
      return (
        <div
          key={i}
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            lineHeight: 1.8,
            color: "var(--text2)",
            whiteSpace: "pre",
            overflowX: "auto",
            padding: "2px 0",
          }}
        >
          {line}
        </div>
      );
    }

    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent)">$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:var(--card-border);padding:1px 6px;border-radius:4px;font-family:monospace">$1</code>');

    const isEmoji = line.match(/^[🟢🔵🟡🟠🔴🟣⚫⭐💡⚠️📍⏱️🔄✅👉🔥]/);
    const isEmpty = line === "";

    return (
      <p
        key={i}
        style={{
          fontSize: 14,
          lineHeight: 1.8,
          marginBottom: isEmpty ? 10 : isEmoji ? 6 : 4,
          color: line.startsWith("💡") || line.startsWith("⚠️")
            ? "var(--accent)"
            : isEmoji
              ? "var(--text)"
              : "var(--text)",
          paddingLeft: line.startsWith("✅") ? 4 : 0,
        }}
        dangerouslySetInnerHTML={{ __html: formatted || "&nbsp;" }}
      />
    );
  });
}

export function GrammarContent({ topic, lang }: GrammarContentProps) {
  const content = lang === "ua" ? topic.content_ua : topic.content_ru;

  return (
    <div style={{ lineHeight: 1.7 }}>
      {parseMarkdown(content)}
    </div>
  );
}
