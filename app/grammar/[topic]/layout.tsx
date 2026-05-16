import { GRAMMAR_TOPICS } from "@/lib/grammar";

export function generateStaticParams() {
  return Object.keys(GRAMMAR_TOPICS).map((topic) => ({
    topic,
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}