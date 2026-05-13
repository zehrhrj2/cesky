"use client";

export function speakCzech(text: string, rate = 0.85): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "cs-CZ";
  u.rate = rate;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

export function speakCzechSlow(text: string): void {
  speakCzech(text, 0.55);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
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
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError("Speech recognition not supported in this browser");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "cs-CZ";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    const result = event.results[0][0];
    onResult({
      transcript: result.transcript,
      confidence: result.confidence,
    });
  };

  recognition.onend = onEnd;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.start();

  return () => recognition.stop();
}

export function scorePronunciation(expected: string, spoken: string): number {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[.,!?]/g, "").trim();

  const exp = normalize(expected);
  const got = normalize(spoken);

  if (exp === got) return 100;

  const expWords = exp.split(" ");
  const gotWords = got.split(" ");
  let matches = 0;

  for (const word of expWords) {
    if (gotWords.includes(word)) matches++;
  }

  const similarity = (matches / expWords.length) * 100;
  return Math.round(Math.max(0, Math.min(100, similarity)));
}
