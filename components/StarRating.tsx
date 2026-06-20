interface StarRatingProps {
  rating: number; // 0-5
  count?: number;
  size?: "sm" | "md";
  showCount?: boolean;
}

/** bol-style star rating (blue/yellow filled stars). */
export default function StarRating({
  rating,
  count,
  size = "sm",
  showCount = true,
}: StarRatingProps) {
  const px = size === "sm" ? 14 : 18;
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative inline-block leading-none" style={{ fontSize: px }}>
        <span className="text-bol-border">★★★★★</span>
        <span
          className="absolute left-0 top-0 overflow-hidden text-bol-yellow-dark"
          style={{ width: `${pct}%` }}
        >
          ★★★★★
        </span>
      </div>
      {showCount && count != null && (
        <span className="text-xs text-zinc-500">({count})</span>
      )}
    </div>
  );
}
