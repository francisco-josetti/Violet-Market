import { Skeleton } from '@/src/components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-16 py-8 md:py-12 animate-fade-in flex flex-col gap-8">
      <Skeleton className="h-8 w-48" />
      <div className="bg-card border border-border rounded-2xl p-8 flex gap-6">
        <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
        <div className="flex-1 flex flex-col gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
