import { Skeleton, SkeletonCard } from '@/src/components/ui/Skeleton';

export default function CatalogLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 px-6 md:px-16 max-w-7xl mx-auto">
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      </aside>
      <main className="flex-1">
        <Skeleton className="h-10 w-full mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
