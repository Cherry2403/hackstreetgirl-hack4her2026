import type { SustainabilityScoreResult } from "@/lib/scoring";

export default function ScoreBreakdown({
  result,
}: {
  result: SustainabilityScoreResult;
}) {
  return (
    <div className="space-y-3">
      {result.calculationBreakdown.map((item) => (
        <div key={item.key}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-bol-ink">{item.label}</span>
            <span className="text-zinc-500">{item.score}/100</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-bol-green"
              style={{ width: `${item.score}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Weight {Math.round(item.weight * 100)}% · {item.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}
