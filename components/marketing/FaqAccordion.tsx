"use client";

import * as React from "react";

export type FaqItem = { q: string; a: React.ReactNode };

export function FaqAccordion({ items }: { items: ReadonlyArray<FaqItem> }) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  return (
    <div className="divide-y divide-plenvo-gray-300 rounded-2xl border border-plenvo-gray-300 bg-white shadow-plenvo-sm overflow-hidden">
      {items.map((it, idx) => {
        const isOpen = openIdx === idx;
        const panelId = `faq-panel-${idx}`;
        const btnId = `faq-btn-${idx}`;
        return (
          <div key={it.q}>
            <h3>
              <button
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5 hover:bg-plenvo-gray-50 transition-colors"
              >
                <span className="text-base font-semibold text-plenvo-gray">
                  {it.q}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 w-8 h-8 rounded-full border border-plenvo-gray-300 flex items-center justify-center text-plenvo-gray transition-transform ${
                    isOpen ? "rotate-180 plenvo-gradient-bg text-white border-transparent" : ""
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="px-5 sm:px-6 pb-5 -mt-1 text-sm text-plenvo-gray-500 leading-relaxed"
            >
              {it.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
