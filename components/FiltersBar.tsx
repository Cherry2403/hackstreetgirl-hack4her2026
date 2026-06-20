"use client";

import { useRouter, useSearchParams } from "next/navigation";

const GRADES = ["A", "B", "C", "D", "E"];

export default function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value == null || params.get(key) === value) params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  const activeGrade = searchParams.get("grade");
  const minScore = searchParams.get("minScore");
  const minLifespan = searchParams.get("minLifespan");
  const valuePerYear = searchParams.get("valuePerYear");

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-bol-border bg-white p-3">
      <span className="mr-1 text-sm font-bold text-bol-ink">Sustainability filters</span>
      {GRADES.map((grade) => (
        <button
          key={grade}
          type="button"
          onClick={() => setParam("grade", grade)}
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            activeGrade === grade
              ? "bg-bol-green text-white"
              : "bg-bol-green/10 text-bol-green hover:bg-bol-green/20"
          }`}
        >
          Grade {grade}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setParam("minScore", "75")}
        className={`rounded-full px-3 py-1 text-sm font-bold ${
          minScore === "75" ? "bg-bol-green text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
        }`}
      >
        75+ score
      </button>
      <button
        type="button"
        onClick={() => setParam("minLifespan", "3")}
        className={`rounded-full px-3 py-1 text-sm font-bold ${
          minLifespan === "3" ? "bg-bol-green text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
        }`}
      >
        3+ year lifespan
      </button>
      <button
        type="button"
        onClick={() => setParam("valuePerYear", "best")}
        className={`rounded-full px-3 py-1 text-sm font-bold ${
          valuePerYear === "best" ? "bg-bol-green text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
        }`}
      >
        Best price/year
      </button>
    </div>
  );
}
