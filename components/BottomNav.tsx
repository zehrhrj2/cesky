"use client";

import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { L } from "@/lib/localization";

const NAV_ITEMS = [
  { path: "/", key: "home", icon: "🏠" },
  { path: "/learn", key: "learn", icon: "📚" },
  { path: "/practice", key: "practice", icon: "🎯" },
  { path: "/chat", key: "chat", icon: "💬" },
  { path: "/profile", key: "profile", icon: "👤" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const lang = useStore((s) => s.lang);
  const t = L[lang];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        background: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--card-border)",
        padding: "6px 12px 10px",
        display: "flex",
        zIndex: 30,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        const label = t[item.key as keyof typeof t] as string;
        return (
          <button
            key={item.path}
            className={`nav-item ${active ? "active" : ""}`}
            onClick={() => !active && router.push(item.path)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
