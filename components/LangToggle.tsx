"use client";

import { useState } from "react";

const LANGS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export function LangToggle() {
  const [active, setActive] = useState("es");

  return (
    <nav aria-label="Idioma" className="flex items-center gap-2">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setActive(lang.code)}
          className={`rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-[0.3em] transition ${
            active === lang.code ? "border-accent text-accent" : "border-white/10 text-slate-400 hover:border-accent hover:text-accent"
          }`}
          aria-pressed={active === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </nav>
  );
}
