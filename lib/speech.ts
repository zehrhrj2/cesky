"use client";

import { Capacitor } from "@capacitor/core";

// ── TTS ───────────────────────────────────────────────────────────────────────

async function getNativeTTS() {
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) return null;
  try {
    const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
    return TextToSpeech;
  } catch {
    return null;
  }
}

// Android WebView returns an empty voices array until the voiceschanged event
// fires. Wait up to 1.5 s before giving up and using whatever is available.
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

export async function speakCzech(text: string, rate = 0.85): Promise<void> {
  if (typeof window === "undefined") return;

  // Native: Capacitor TTS plugin — reliable on Android/iOS without needing
  // Czech voices installed on the device's Web Speech engine.
  const tts = await getNativeTTS();
  if (tts) {
    try {
      await tts.stop(); // stop any current speech before starting new one
      await tts.speak({ text, lang: "cs-CZ", rate, pitch: 1.0, volume: 1.0 });
      return;
    } catch {
      // fall through to web fallback
    }
  }

  // Web: browser speechSynthesis (works on desktop and web builds)
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const voices = await getWebVoices();
  // Small delay after cancel prevents silent failure in some WebView builds
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
  const tts = await getNativeTTS();
  if (tts) {
    try { await tts.stop(); return; } catch {}
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Capacitor.isNativePlatform() || "speechSynthesis" in window;
}

// ── Speech Recognition ────────────────────────────────────────────────────────

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

async function getNativeSR() {
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) return null;
  try {
    const { SpeechRecognition } = await import("@capacitor-community/speech-recognition");
    return SpeechRecognition;
  } catch {
    return null;
  }
}

export async function startSpeechRecognition(
  onResult: (result: SpeechRecognitionResult) => void,
  onEnd: () => void,
  onError: (error: string) => void
): Promise<(() => void) | null> {
  if (typeof window === "undefined") return null;

  // Native path: Capacitor speech recognition plugin
  const sr = await getNativeSR();
  if (sr) {
    try {
      const perms = await sr.checkPermissions();
      if (perms.speechRecognition !== "granted") {
        const req = await sr.requestPermissions();
        if (req.speechRecognition !== "granted") {
          onError("Microphone permission denied");
          onEnd();
          return null;
        }
      }

      // Listen for results before calling start so we don't miss them
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

  // Web fallback: Web Speech API
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
