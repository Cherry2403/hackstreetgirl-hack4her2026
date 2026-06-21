"use client";

import Link from "next/link";
import { useCompare, type CompareItem } from "./CompareContext";

export default function AddSuggestionToCompareLink({
  item,
  href,
  children,
}: {
  item: CompareItem;
  href: string;
  children: React.ReactNode;
}) {
  const { has, toggle, isFull } = useCompare();
  const alreadySelected = has(item.id);
  const disabled = !alreadySelected && isFull;

  return (
    <Link
      href={disabled ? "#" : href}
      aria-disabled={disabled}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        if (!alreadySelected) toggle(item);
      }}
      className={`mt-2 rounded-full border px-3 py-1.5 text-center text-xs font-bold ${
        disabled
          ? "cursor-not-allowed border-zinc-200 text-zinc-300"
          : "border-bol-blue text-bol-blue hover:bg-bol-blue hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
