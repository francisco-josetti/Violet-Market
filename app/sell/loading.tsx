import { Skeleton } from '@/src/components/ui/Skeleton';

export default function SellLoading() {
  return (
    <div className="flex-grow py-8 px-4 md:py-12 min-h-[80vh]">
      <div className="max-w-3xl mx-auto mb-8 text-center flex flex-col gap-2 items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 md:px-6 md:py-5">
          <div className="flex items-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <Skeleton className="h-3 flex-1 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-12 w-full rounded-xl mb-4" />
          <Skeleton className="h-12 w-full rounded-xl mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
