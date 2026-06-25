import { Skeleton } from '@/src/components/ui/Skeleton';

export default function ProductLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-16 py-8 animate-fade-in flex flex-col gap-12">
      <Skeleton className="h-4 w-64" />
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-7/12 flex flex-col gap-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
