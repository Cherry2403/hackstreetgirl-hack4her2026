import type { ImpactAnalogy as ImpactAnalogyValue } from "@/lib/analogy";

export default function ImpactAnalogy({ analogy }: { analogy: ImpactAnalogyValue }) {
  return (
    <div className="rounded-lg border border-bol-green/30 bg-bol-green/5 p-4">
      <p className="text-xs font-bold uppercase text-bol-green">Impact analogy</p>
      <h3 className="mt-1 text-base font-bold text-bol-ink">{analogy.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-700">{analogy.text}</p>
      <p className="mt-2 text-xs text-zinc-500">
        Estimates are directional and depend on actual use, recycling and delivery behavior.
      </p>
    </div>
  );
}
