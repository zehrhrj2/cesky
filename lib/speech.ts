"use client";

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
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const voices = await getWebVoices();

  // Android WebView bug: speak() silently fails when called in the same tick
  // as cancel(). A short pause lets the engine reset before the next utterance.
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
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export function startSpeechRecognition(
  onResult: (result: SpeechRecognitionResult) => void,
  onEnd: () => void,
  onError: (error: string) => void
): (() => void) | null {
  if (typeof window === "undefined") return null;

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
