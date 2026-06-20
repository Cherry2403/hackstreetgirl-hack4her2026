export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar skeleton */}
        <div className="hidden w-64 shrink-0 space-y-4 md:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border border-bol-border bg-white"
            />
          ))}
        </div>

        {/* List skeleton */}
        <div className="flex-1 border-t border-bol-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[180px_1fr_220px] gap-4 border-b border-bol-border py-6"
            >
              <div className="aspect-square animate-pulse rounded-lg bg-bol-gray" />
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-bol-gray" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-bol-gray" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-bol-gray" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-bol-gray" />
              </div>
              <div className="space-y-2">
                <div className="h-7 w-20 animate-pulse rounded bg-bol-gray" />
                <div className="h-9 w-full animate-pulse rounded-full bg-bol-gray" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
