"use client";

// Module-level ring buffer — max 5 entries. Not persisted, resets on reload.
const MAX = 5;
const _logs: string[] = [];
const _listeners = new Set<() => void>();

export function addDebugLog(msg: string) {
  if (typeof window === "undefined") return;
  const ts = new Date().toLocaleTimeString("uk", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  _logs.push(`[${ts}] ${msg}`);
  if (_logs.length > MAX) _logs.shift();
  _listeners.forEach((fn) => fn());
}

export function getDebugLogs(): string[] {
  return [..._logs];
}

export function subscribeDebugLogs(cb: () => void): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}
