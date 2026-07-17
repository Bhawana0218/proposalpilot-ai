"use client";

import { useEffect, useState } from "react";

export default function TypingEffect({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-cyan-400" />
      )}
    </span>
  );
}
