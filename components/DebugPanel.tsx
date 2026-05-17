"use client";

import { useEffect, useState } from "react";
import { getDebugLogs, subscribeDebugLogs } from "@/lib/debugLog";

export function DebugPanel() {
  const [logs, setLogs] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setLogs(getDebugLogs());
    const unsub = subscribeDebugLogs(() => setLogs(getDebugLogs()));
    return unsub;
  }, []);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        style={{
          position: "fixed",
          bottom: 80,
          right: 12,
          zIndex: 9999,
          background: "#1a1a2e",
          color: "#7c6af5",
          border: "1px solid #7c6af5",
          borderRadius: 8,
          padding: "4px 8px",
          fontSize: 11,
          fontFamily: "monospace",
          cursor: "pointer",
        }}
      >
        DBG
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        right: 12,
        left: 12,
        zIndex: 9999,
        background: "rgba(10,10,20,0.95)",
        border: "1px solid #7c6af5",
        borderRadius: 10,
        padding: "8px 10px",
        fontFamily: "monospace",
        fontSize: 10,
        color: "#c8c8ff",
        maxHeight: 160,
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "#7c6af5", fontWeight: "bold" }}>DEBUG LOG</span>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: "none",
            border: "none",
            color: "#7c6af5",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "monospace",
            padding: 0,
          }}
        >
          ✕
        </button>
      </div>
      {logs.length === 0 ? (
        <div style={{ color: "#555", fontStyle: "italic" }}>no logs yet — tap a button</div>
      ) : (
        logs.map((log, i) => (
          <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid #222", paddingTop: i === 0 ? 0 : 3, marginTop: i === 0 ? 0 : 3, wordBreak: "break-all" }}>
            {log}
          </div>
        ))
      )}
    </div>
  );
}
