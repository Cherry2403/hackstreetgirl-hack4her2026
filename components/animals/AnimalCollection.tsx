"use client";

import { ANIMALS, remainingLabel } from "@/lib/animals";
import { useAnimals } from "./AnimalContext";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** "My animal collection" block shown at the bottom of My Sphere. */
export default function AnimalCollection() {
  const { isOwned, displayedId, setDisplayed } = useAnimals();
  const { t } = useLanguage();

  return (
    <section className="mt-10" id="animal-friends">
      <h2 className="text-xl font-bold text-bol-ink">{t("animals.title")}</h2>
      <p className="mt-1 text-sm text-zinc-600">{t("animals.subtitle")}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {ANIMALS.map((animal) => {
          const owned = isOwned(animal.id);
          const active = displayedId === animal.id;
          return (
            <div
              key={animal.id}
              className={`flex flex-col overflow-hidden rounded-lg border bg-white ${
                active ? "border-bol-blue" : "border-bol-border"
              } ${owned ? "" : "opacity-50"}`}
            >
              {/* Realistic photo */}
              <div className="aspect-square overflow-hidden bg-bol-gray">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={animal.realistic}
                  alt={animal.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* name + remaining number (kept short) */}
              <div className="p-2">
                <p className="truncate text-sm font-bold text-bol-ink">
                  {animal.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {remainingLabel(animal.remaining)} {t("animals.remaining")}
                </p>

                {/* display toggle — bol blue-pill style (matches compare buttons) */}
                <button
                  type="button"
                  disabled={!owned}
                  onClick={() => setDisplayed(animal.id)}
                  aria-pressed={active}
                  className={`mt-2 w-full rounded-full px-3 py-1.5 text-center text-xs font-bold transition-colors disabled:cursor-not-allowed ${
                    active
                      ? "bg-bol-blue text-white hover:bg-bol-blue-dark"
                      : "border border-bol-blue text-bol-blue hover:bg-bol-blue hover:text-white"
                  }`}
                >
                  {active ? t("animals.displaying") : t("animals.display")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
