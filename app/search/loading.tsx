import { ListingCardSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block lg:w-64">
          <div className="h-96 bg-muted rounded animate-pulse"></div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
