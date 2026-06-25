import { SkeletonCard } from '@/src/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-y-24 pb-24 animate-fade-in">
      <section className="w-full h-[640px] md:h-[760px] bg-muted" />
      <section className="w-full max-w-7xl mx-auto px-6 md:px-16">
        <div className="h-8 w-48 bg-accent rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
