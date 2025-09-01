import { Card, CardContent } from "@/components/ui/card"

export function ListingCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="aspect-[4/3] bg-muted rounded-t-lg"></div>
      <CardContent className="p-4">
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-5 bg-muted rounded w-20 mb-1"></div>
        <div className="h-3 bg-muted rounded w-32 mb-1"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-muted rounded w-16"></div>
          <div className="h-3 bg-muted rounded w-12"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6 text-center">
        <div className="w-8 h-8 bg-muted rounded mx-auto mb-2"></div>
        <div className="h-4 bg-muted rounded mb-1"></div>
        <div className="h-3 bg-muted rounded w-16 mx-auto"></div>
      </CardContent>
    </Card>
  )
}

export function ListingDetailSkeleton() {
  return (
    <div className="container px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-[4/3] bg-muted rounded-lg mb-4 animate-pulse"></div>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
              </div>
              <div className="h-10 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
