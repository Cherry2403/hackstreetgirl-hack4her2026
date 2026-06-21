"use client";

import { useEffect, useState } from "react";
import { getAnimal } from "@/lib/animals";
import { useAnimals } from "./AnimalContext";

/**
 * The displayed collectible animal walking in the header, confined to the lane
 * between the left edge and the bol logo. The lane width matches the left
 * gutter of the centered (max-w-7xl) container plus the logo offset, so the
 * animal never overlaps the logo. Sits ABOVE the blue background but BELOW the
 * logo/search (parent puts those at z-10, this layer at z-0). Pointer-events
 * disabled so it never blocks the UI.
 */
export default function HeaderAnimal() {
  const { displayedId } = useAnimals();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const animal = mounted && displayedId ? getAnimal(displayedId) : undefined;
  if (!animal) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* static position on the left */}
      <div className="absolute bottom-4 left-5 h-10 w-10">
        {/* faces right */}
        <div className="h-full w-full">
          {/* no bob */}
          <div className="h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={animal.cartoon}
              alt=""
              className="h-full w-full object-contain brightness-0 invert"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
