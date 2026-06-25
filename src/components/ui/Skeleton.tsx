import React from 'react';

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-accent animate-pulse rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export { Skeleton, SkeletonCard, SkeletonLine };
