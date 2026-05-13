"use client";

import { getLevelFromXp, getProgressPercent, getXpForLevel } from "@/lib/utils";

interface XPBarProps {
  xp: number;
  showLabel?: boolean;
}

export function XPBar({ xp, showLabel = true }: XPBarProps) {
  const level = getLevelFromXp(xp);
  const pct = getProgressPercent(xp);
  const xpInLevel = xp % (level * 100);
  const needed = getXpForLevel(level);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      {showLabel && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
            minWidth: 42,
            whiteSpace: "nowrap",
          }}
        >
          LVL {level}
        </span>
      )}
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--card-border)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "var(--gradient)",
            borderRadius: 3,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: 10, color: "var(--text2)", minWidth: 40, textAlign: "right" }}>
          {xpInLevel}/{needed}
        </span>
      )}
    </div>
  );
}
