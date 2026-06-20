import type { SpecGroup } from "@/lib/specs";

/** Grouped product specification tables (bol "Productspecificaties"). */
export default function SpecTable({ groups }: { groups: SpecGroup[] }) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-2 text-base font-bold text-bol-ink">{group.title}</h3>
          <dl className="overflow-hidden rounded-lg border border-bol-border">
            {group.rows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-2 gap-4 px-4 py-2.5 text-sm ${
                  i % 2 === 0 ? "bg-white" : "bg-bol-gray"
                }`}
              >
                <dt className="text-zinc-600">{row.label}</dt>
                <dd className="font-medium text-bol-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
