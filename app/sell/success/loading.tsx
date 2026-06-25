import { Skeleton } from '@/src/components/ui/Skeleton';

export default function SellSuccessLoading() {
  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 min-h-[85vh]">
      <div className="bg-card border border-border rounded-2xl p-8 md:p-12 max-w-lg w-full text-center flex flex-col items-center gap-6">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex flex-col gap-2 items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="flex gap-3 w-full">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
