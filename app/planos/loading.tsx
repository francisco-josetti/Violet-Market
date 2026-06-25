import { Skeleton } from '@/src/components/ui/Skeleton';

export default function PlansLoading() {
  return (
    <div className="flex-grow py-8 px-4 md:py-12 min-h-[80vh]">
      <div className="max-w-3xl mx-auto mb-8 text-center flex flex-col gap-3 items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex justify-center mb-10">
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-10 w-32" />
            <div className="flex flex-col gap-3 flex-1">
              {Array.from({ length: 4 + i * 2 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
