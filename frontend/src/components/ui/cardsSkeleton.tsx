import { Skeleton } from '@/components/ui/skeleton'

export function CardSkeleton() {
  return (
    <div className="space-y-5">
      {/* Card header skeleton */}
      <div className="flex gap-4 items-start">
        <Skeleton className="h-24 w-16 rounded-lg shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>

      {/* Price cards skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-32 flex-1 rounded-xl" />
        <Skeleton className="h-32 flex-1 rounded-xl" />
      </div>

      {/* Chart skeleton */}
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  )
}