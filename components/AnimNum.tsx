"use client";

import { useState, useEffect } from "react";

interface AnimNumProps {
  value: number;
  duration?: number;
}

export function AnimNum({ value, duration = 600 }: AnimNumProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let startVal = display;
    const diff = value - startVal;
    if (diff === 0) return;
    const steps = Math.max(10, Math.abs(diff));
    const stepTime = duration / steps;
    let step = 0;

    const iv = setInterval(() => {
      step++;
      setDisplay(Math.round(startVal + (diff * step) / steps));
      if (step >= steps) clearInterval(iv);
    }, stepTime);

    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{display}</span>;
}
