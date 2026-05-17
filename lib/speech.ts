"use client";

import { Capacitor } from "@capacitor/core";

// ── Plugin singletons ─────────────────────────────────────────────────────────
// undefined = not yet resolved, null = not available, object = ready to use.
// We load each plugin once and cache it to avoid repeated dynamic imports.

type TTSPlugin = Awaited<ReturnType<typeof import("@capacitor-community/text-to-speech")["TextToSpeech"]["speak"]>> extends void
  ? { speak: (o: TTSSpeakOptions) => Promise<void>; stop: () => Promise<void> }
  : never;

interface TTSSpeakOptions {
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _tts: any | null | undefined = undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sr: any | null | undefined = undefined;

async function getTTS() {
  if (_tts !== undefined) return _tts;
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) {
    return (_tts = null);
  }
  try {
    const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
    _tts = TextToSpeech;
  } catch {
    _tts = null;
  }
  return _tts;
}

async function getSR() {
  if (_sr !== undefined) return _sr;
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) {
    return (_sr = null);
  }
  try {
    const { SpeechRecognition } = await import("@capacitor-community/speech-recognition");
    _sr = SpeechRecognition;
  } catch {
    _sr = null;
  }
  return _sr;
}

// ── Web voice helper ──────────────────────────────────────────────────────────

async function getWebVoices(): Promise<SpeechSynthesisVoice[]> {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return voices;
  return new Promise((resolve) => {
    const onChanged = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", onChanged, { once: true });
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 1500);
  });
}

// ── TTS ───────────────────────────────────────────────────────────────────────

export async function speakCzech(text: string, rate = 0.85): Promise<void> {
  if (typeof window === "undefined") return;

  const tts = await getTTS();
  if (tts) {
    // stop() throws if nothing is currently playing on some engines —
    // wrap it separately so it never prevents speak() from running.
    try { await tts.stop(); } catch { /* nothing was playing */ }
    try {
      await tts.speak({ text, lang: "cs-CZ", rate, pitch: 1.0, volume: 1.0 });
      return;
    } catch {
      // native speak failed — fall through to web
    }
  }

  // Web fallback (desktop / browser builds)
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const voices = await getWebVoices();
  await new Promise<void>((r) => setTimeout(r, 50));
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "cs-CZ";
  u.rate = rate;
  u.pitch = 1;
  u.voice = voices.find((v) => v.lang.startsWith("cs")) ?? null;
  window.speechSynthesis.speak(u);
}

export async function speakCzechSlow(text: string): Promise<void> {
  return speakCzech(text, 0.55);
}

export async function stopSpeaking(): Promise<void> {
  if (typeof window === "undefined") return;
  const tts = await getTTS();
  if (tts) {
    try { await tts.stop(); } catch { /* nothing was playing */ }
    return;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Capacitor.isNativePlatform() || "speechSynthesis" in window;
}

// ── Speech recognition ────────────────────────────────────────────────────────

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export async function startSpeechRecognition(
  onResult: (result: SpeechRecognitionResult) => void,
  onEnd: () => void,
  onError: (error: string) => void
): Promise<(() => void) | null> {
  if (typeof window === "undefined") return null;

  const sr = await getSR();
  if (sr) {
    try {
      // Request permission if not already granted
      const perms = await sr.checkPermissions();
      if (perms.speechRecognition !== "granted") {
        const req = await sr.requestPermissions();
        if (req.speechRecognition !== "granted") {
          onError("Microphone permission denied");
          onEnd();
          return null;
        }
      }

      // Register the result listener BEFORE start() so we don't miss the event
      const listener = await sr.addListener(
        "partialResults",
        (data: { matches?: string[] }) => {
          if (data.matches && data.matches.length > 0) {
            onResult({ transcript: data.matches[0], confidence: 1.0 });
            onEnd();
          }
        }
      );

      await sr.start({
        language: "cs-CZ",
        maxResults: 1,
        prompt: "",
        partialResults: false,
        popup: false,
      });

      return () => {
        sr.stop().catch(() => {});
        listener.remove();
      };
    } catch (e) {
      onError(String(e));
      onEnd();
      return null;
    }
  }

  // Web fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) {
    onError("Speech recognition not supported in this browser");
    return null;
  }
  const recognition = new SR();
  recognition.lang = "cs-CZ";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    const r = event.results[0][0];
    onResult({ transcript: r.transcript, confidence: r.confidence });
  };
  recognition.onend = onEnd;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => onError(event.error);
  recognition.start();
  return () => recognition.stop();
}

export function scorePronunciation(expected: string, spoken: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "").trim();
  const exp = norm(expected).split(" ");
  const got = new Set(norm(spoken).split(" "));
  const matches = exp.filter((w) => got.has(w)).length;
  return Math.round(Math.max(0, Math.min(100, (matches / exp.length) * 100)));
}
