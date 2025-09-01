import { ListingCardSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <div className="h-4 bg-muted rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-8 bg-muted rounded w-48 mb-1 animate-pulse"></div>
        <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
