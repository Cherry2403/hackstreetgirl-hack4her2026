"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

export const MAX_COMPARE = 4;

/** Lightweight product summary kept in the compare tray (no need for full data). */
export interface CompareItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
}

interface CompareContextValue {
  items: CompareItem[];
  has: (id: string) => boolean;
  toggle: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const STORAGE_KEY = "bol:compare";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        /* ignore */
      } finally {
        hydrated.current = true;
      }
    });
  }, []);

  // persist + sync across tabs
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      }
      if (prev.length >= MAX_COMPARE) return prev; // capped
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <CompareContext.Provider
      value={{ items, has, toggle, remove, clear, isFull: items.length >= MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
