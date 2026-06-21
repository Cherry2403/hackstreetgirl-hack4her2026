"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { ANIMALS } from "@/lib/animals";

interface AnimalContextValue {
  /** Ids the user owns (earned by buying sustainable products). */
  owned: string[];
  /** The animal currently set to walk in the header, or null. */
  displayedId: string | null;
  isOwned: (id: string) => boolean;
  /** Toggle which animal walks in the header (clicking the active one turns it off). */
  setDisplayed: (id: string | null) => void;
}

const AnimalContext = createContext<AnimalContextValue | null>(null);

const OWNED_KEY = "bol:animals:owned";
const DISPLAY_KEY = "bol:animals:displayed";

// Demo: everyone starts owning all five (frontend-only, no real purchase flow).
const DEFAULT_OWNED = ANIMALS.map((a) => a.id);

export function AnimalProvider({ children }: { children: React.ReactNode }) {
  const [owned, setOwned] = useState<string[]>(DEFAULT_OWNED);
  const [displayedId, setDisplayedId] = useState<string | null>(null);
  const hydrated = useRef(false);

  // hydrate from localStorage
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const rawOwned = localStorage.getItem(OWNED_KEY);
        if (rawOwned) setOwned(JSON.parse(rawOwned));
        const rawDisplay = localStorage.getItem(DISPLAY_KEY);
        if (rawDisplay) setDisplayedId(JSON.parse(rawDisplay));
      } catch {
        /* ignore */
      } finally {
        hydrated.current = true;
      }
    });
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(OWNED_KEY, JSON.stringify(owned));
      localStorage.setItem(DISPLAY_KEY, JSON.stringify(displayedId));
    } catch {
      /* ignore */
    }
  }, [owned, displayedId]);

  const isOwned = useCallback((id: string) => owned.includes(id), [owned]);

  const setDisplayed = useCallback((id: string | null) => {
    setDisplayedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <AnimalContext.Provider value={{ owned, displayedId, isOwned, setDisplayed }}>
      {children}
    </AnimalContext.Provider>
  );
}

export function useAnimals() {
  const ctx = useContext(AnimalContext);
  if (!ctx) throw new Error("useAnimals must be used within AnimalProvider");
  return ctx;
}
