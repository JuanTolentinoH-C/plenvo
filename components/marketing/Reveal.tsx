"use client";

import * as React from "react";

type RevealProps = {
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number; // ms
  className?: string;
  children: React.ReactNode;
};

/**
 * Aplica una animación fade-up al entrar en viewport.
 * No-op si el usuario prefiere reduced motion.
 */
export function Reveal({ as = "div", delay = 0, className = "", children }: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return React.createElement(
    Tag,
    {
      ref,
      className: `${className} ${shown ? "reveal-in" : "reveal"}`,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children
  );
}
