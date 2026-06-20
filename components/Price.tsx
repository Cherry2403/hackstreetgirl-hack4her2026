import { formatEuro } from "@/lib/format";

interface PriceProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** bol-style price: large whole number, small superscript-ish fraction. */
export default function Price({ amount, size = "md", className = "" }: PriceProps) {
  const { whole, fraction } = formatEuro(amount);

  const wholeSize =
    size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-base";
  const fracSize = size === "lg" ? "text-base" : "text-xs";

  // Only apply the default ink color when the caller doesn't pass a text color.
  const color = /\btext-/.test(className) ? "" : "text-bol-ink";

  return (
    <span className={`inline-flex items-start font-bold ${color} ${className}`}>
      <span className={`leading-none ${wholeSize}`}>{whole}</span>
      <span className={`ml-0.5 mt-0.5 leading-none ${fracSize}`}>{fraction}</span>
    </span>
  );
}
