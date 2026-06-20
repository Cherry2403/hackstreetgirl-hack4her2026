"use client";

import { useState } from "react";
import { productImage } from "@/lib/format";

/** Product image gallery — generates 4 deterministic placeholder views. */
export default function Gallery({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const images = [0, 1, 2, 3].map((i) => productImage(`${id}-${i}`, name));
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`h-14 w-14 overflow-hidden rounded border-2 ${
              active === i ? "border-bol-blue" : "border-bol-border"
            }`}
            aria-label={`Afbeelding ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 overflow-hidden rounded-lg border border-bol-border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={name}
          className="h-full max-h-[460px] w-full object-contain p-4"
        />
      </div>
    </div>
  );
}
