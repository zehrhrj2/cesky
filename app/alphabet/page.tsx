"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AlphabetLesson } from "@/components/AlphabetLesson";

export default function AlphabetPage() {
  const router = useRouter();
  const { lang, completeAlphabet } = useStore();

  const handleComplete = () => {
    completeAlphabet();
    router.push("/learn");
  };

  return (
    <>
      <Header />
      <div style={{ padding: "16px 0 100px" }}>
        <div style={{ padding: "0 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            {lang === "ua" ? "🔤 Алфавіт" : "🔤 Алфавит"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {lang === "ua"
              ? "Чеські букви та їх вимова"
              : "Чешские буквы и их произношение"}
          </div>
        </div>
        <AlphabetLesson lang={lang} onComplete={handleComplete} />
      </div>
      <BottomNav />
    </>
  );
}
