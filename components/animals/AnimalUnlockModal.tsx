"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Animal } from "@/lib/animals";
import { remainingLabel } from "@/lib/animals";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface Props {
  animal: Animal;
  onClose: () => void;
}

export default function AnimalUnlockModal({ animal, onClose }: Props) {
  const [revealed, setRevealed] = useState(false);
  const { t } = useLanguage();

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleReveal() {
    setRevealed(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header band */}
        <div className="bg-bol-blue px-6 py-4 text-center text-white">
          <p className="text-2xl font-semibold uppercase tracking-widest opacity-80">
            {t("unlock.new")}
          </p>
        </div>

        {/* Animal reveal area */}
        <div className="flex flex-col items-center px-6 pb-6 pt-5">
          {!revealed ? (
            /* Shaking mystery egg / silhouette — click to reveal */
            <button
              onClick={handleReveal}
              className="group flex flex-col items-center gap-3 focus:outline-none"
              aria-label={t("unlock.tap")}
            >
              <div className="animate-unlock-shake relative flex h-36 w-36 items-center justify-center rounded-full bg-bol-yellow shadow-lg">
                {/* silhouette */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={animal.realistic}
                  alt=""
                  className="h-28 w-28 object-contain brightness-0"
                />
                <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-bol-blue text-lg">
                  🎁
                </span>
              </div>
              <span className="text-sm font-bold text-bol-blue group-hover:underline">
                {t("unlock.tap")}
              </span>
            </button>
          ) : (
            /* Revealed animal */
            <div className="flex flex-col items-center gap-3 animate-unlock-pop">
              <div className="relative flex h-100 w-100 items-center justify-center rounded-full bg-bol-yellow shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={animal.realistic}
                  alt={animal.name}
                  className="h-80 w-auto object-contain"
                />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-bol-ink">{animal.name}</h2>
                <p className="mt-0.5 text-lg text-zinc-500">
                  <span className="font-semibold text-bol-blue">
                    {remainingLabel(animal.remaining)}
                  </span>{" "}
                  {t("unlock.inTheWild")}
                </p>
              </div>

              {/* Fun facts */}
              <div className="w-full rounded-xl border border-bol-border bg-bol-gray p-4">
                <p className="mb-2 text-md font-bold uppercase tracking-wider text-bol-blue">
                  {t("unlock.funFacts")}
                </p>
                <ul className="space-y-2">
                  {animal.facts.map((fact, i) => (
                    <li key={i} className="flex gap-2 text-sm text-bol-ink">
                      <span className="mt-0.5 shrink-0 text-bol-yellow">★</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <Link
                href="/account#animal-friends"
                onClick={onClose}
                className="block w-full rounded-full bg-bol-blue py-3 text-center font-bold text-white hover:bg-bol-blue-dark"
              >
                {t("unlock.display")}
              </Link>
              <button
                onClick={onClose}
                className="w-full rounded-full border border-bol-border py-2.5 text-sm font-medium text-zinc-600 hover:bg-bol-gray"
              >
                {t("unlock.close")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
