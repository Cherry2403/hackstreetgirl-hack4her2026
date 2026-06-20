"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";
import type { Lang } from "@/lib/i18n/translate";

const OPTIONS: { value: Lang; label: string; flag: React.ReactNode }[] = [
  { value: "nl", label: "NL", flag: <NLFlag /> },
  { value: "en", label: "EN", flag: <GBFlag /> },
];

/** NL / EN language dropdown shown in the header. */
export default function LanguageSwitcher({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = OPTIONS.find((o) => o.value === lang) ?? OPTIONS[0];
  const textColor = variant === "dark" ? "text-white" : "text-zinc-700";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm font-medium ${textColor} hover:opacity-80`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="inline-flex h-4 w-6 overflow-hidden rounded-[2px] ring-1 ring-black/10">
          {current.flag}
        </span>
        {current.label}
        <ChevronIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-lg border border-bol-border bg-white py-1 text-sm text-bol-ink shadow-lg"
        >
          {OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                role="option"
                aria-selected={o.value === lang}
                onClick={() => {
                  setLang(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-bol-gray ${
                  o.value === lang ? "font-semibold" : ""
                }`}
              >
                <span className="inline-flex h-4 w-6 overflow-hidden rounded-[2px] ring-1 ring-black/10">
                  {o.flag}
                </span>
                {o.value === "nl" ? "Nederlands" : "English"}
                {o.value === lang && <CheckIcon className="ml-auto h-4 w-4 text-bol-blue" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NLFlag() {
  return (
    <svg viewBox="0 0 9 6" className="h-full w-full" preserveAspectRatio="none">
      <rect width="9" height="6" fill="#21468B" />
      <rect width="9" height="4" fill="#fff" />
      <rect width="9" height="2" fill="#AE1C28" />
    </svg>
  );
}
function GBFlag() {
  return (
    <svg viewBox="0 0 60 30" className="h-full w-full" preserveAspectRatio="none">
      <clipPath id="gb"><path d="M0 0v30h60V0z" /></clipPath>
      <g clipPath="url(#gb)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className={className}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className={className}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
