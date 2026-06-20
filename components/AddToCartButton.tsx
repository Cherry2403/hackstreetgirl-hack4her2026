"use client";

import { useState } from "react";

/** Compact yellow "add to cart" button used on result rows. */
export default function AddToCartButton({
  label = "In winkelwagen",
  addedLabel = "✓ Toegevoegd",
  full = false,
}: {
  label?: string;
  addedLabel?: string;
  full?: boolean;
}) {
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`flex items-center justify-center gap-2 rounded-full bg-bol-yellow font-bold text-bol-blue transition-colors hover:bg-bol-yellow-dark ${
        full ? "w-full px-5 py-3" : "px-4 py-2 text-sm"
      }`}
    >
      {added ? (
        addedLabel
      ) : (
        <>
          <CartPlusIcon className="h-5 w-5" />
          <span className={full ? "" : "hidden sm:inline"}>{label}</span>
        </>
      )}
    </button>
  );
}

function CartPlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M3 4h2l2 11h10l2-7H7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4h5M16.5 1.5v5" strokeLinecap="round" />
    </svg>
  );
}
