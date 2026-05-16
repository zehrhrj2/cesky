import { LESSONS, getUnitId } from "@/lib/lessons";

export function generateStaticParams() {
  const allIds: { id: string }[] = [];
  Object.values(LESSONS).forEach((levelLessons) => {
    levelLessons.forEach((lesson) => {
      const id = getUnitId(lesson);
      if (id) allIds.push({ id });
    });
  });
  return allIds;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}