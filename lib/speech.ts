"use client";

import { Capacitor } from "@capacitor/core";
import { addDebugLog } from "@/lib/debugLog";

// ── Plugin singletons ─────────────────────────────────────────────────────────
// undefined = not yet resolved, null = not available, object = ready to use.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _tts: any | null | undefined = undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sr: any | null | undefined = undefined;

async function getTTS() {
  if (_tts !== undefined) return _tts;
  const isNative = Capacitor.isNativePlatform();
  addDebugLog(`getTTS: isNative=${isNative}`);
  if (typeof window === "undefined" || !isNative) {
    addDebugLog("getTTS: not native → null");
    return (_tts = null);
  }
  try {
    const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
    _tts = TextToSpeech;
    addDebugLog("getTTS: plugin loaded OK");
  } catch (e) {
    _tts = null;
    addDebugLog(`getTTS: import failed → ${e}`);
  }
  return _tts;
}

async function getSR() {
  if (_sr !== undefined) return _sr;
  const isNative = Capacitor.isNativePlatform();
  addDebugLog(`getSR: isNative=${isNative}`);
  if (typeof window === "undefined" || !isNative) {
    return (_sr = null);
  }
  try {
    const { SpeechRecognition } = await import("@capacitor-community/speech-recognition");
    _sr = SpeechRecognition;
    addDebugLog("getSR: plugin loaded OK");
  } catch (e) {
    _sr = null;
    addDebugLog(`getSR: import failed → ${e}`);
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
  addDebugLog(`speakCzech: "${text.slice(0, 20)}"`);

  const tts = await getTTS();
  if (tts) {
    addDebugLog("speakCzech: stop()");
    try { await tts.stop(); addDebugLog("stop(): ok"); } catch (e) { addDebugLog(`stop(): ignored ${e}`); }

    // Fire-and-forget — speak() Promise may never resolve on some Android engines
    const params = { text, lang: "cs-CZ", rate, pitch: 1.0, volume: 1.0 };
    addDebugLog(`BEFORE speak: ${JSON.stringify(params).slice(0, 50)}`);
    (tts.speak(params) as Promise<void>)
      .then(() => addDebugLog("speak(): RESOLVED ok"))
      .catch((e: unknown) => addDebugLog(`speak(): REJECTED → ${e}`));
    addDebugLog("AFTER speak() called");
    return;
  } else {
    addDebugLog("speakCzech: no native TTS");
  }

  // Web fallback (desktop / browser builds)
  if (!("speechSynthesis" in window)) {
    addDebugLog("speakCzech: speechSynthesis not in window");
    return;
  }
  addDebugLog("speakCzech: using window.speechSynthesis");
  window.speechSynthesis.cancel();
  const voices = await getWebVoices();
  await new Promise<void>((r) => setTimeout(r, 50));
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "cs-CZ";
  u.rate = rate;
  u.pitch = 1;
  u.voice = voices.find((v) => v.lang.startsWith("cs")) ?? null;
  addDebugLog(`web TTS: voice=${u.voice?.name ?? "null"}, voices=${voices.length}`);
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
  addDebugLog("startSR: begin");

  const sr = await getSR();
  if (sr) {
    try {
      addDebugLog("startSR: checkPermissions");
      const perms = await sr.checkPermissions();
      addDebugLog(`startSR: perm=${perms.speechRecognition}`);
      if (perms.speechRecognition !== "granted") {
        const req = await sr.requestPermissions();
        addDebugLog(`startSR: requestPerm=${req.speechRecognition}`);
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
          addDebugLog(`startSR: got result matches=${data.matches?.length ?? 0}`);
          if (data.matches && data.matches.length > 0) {
            onResult({ transcript: data.matches[0], confidence: 1.0 });
            onEnd();
          }
        }
      );

      addDebugLog("startSR: calling sr.start()");
      await sr.start({
        language: "cs-CZ",
        maxResults: 1,
        prompt: "",
        partialResults: false,
        popup: false,
      });
      addDebugLog("startSR: sr.start() OK, listening...");

      return () => {
        sr.stop().catch(() => {});
        listener.remove();
      };
    } catch (e) {
      addDebugLog(`startSR: FAILED → ${e}`);
      onError(String(e));
      onEnd();
      return null;
    }
  }

  // Web fallback
  addDebugLog("startSR: using web SpeechRecognition");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) {
    addDebugLog("startSR: web SR not supported");
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
    addDebugLog(`startSR: web result="${r.transcript}"`);
    onResult({ transcript: r.transcript, confidence: r.confidence });
  };
  recognition.onend = onEnd;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    addDebugLog(`startSR: web error=${event.error}`);
    onError(event.error);
  };
  recognition.start();
  addDebugLog("startSR: web SR started");
  return () => recognition.stop();
}

export function scorePronunciation(expected: string, spoken: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "").trim();
  const exp = norm(expected).split(" ");
  const got = new Set(norm(spoken).split(" "));
  const matches = exp.filter((w) => got.has(w)).length;
  return Math.round(Math.max(0, Math.min(100, (matches / exp.length) * 100)));
}
