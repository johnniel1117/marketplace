"use client"

import { useEffect, useState } from "react"
import { Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchBar } from "@/components/search-bar"
import { ListingGrid } from "@/components/listing-grid"
import { FiltersSidebar, type SearchFilters } from "@/components/filters-sidebar"
import Link from "next/link"
import type { Listing } from "@/lib/types"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState<SearchFilters>({ category: params.slug })

  const categoryName = params.slug.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams()

      // Add filters to search params
      if (filters.category) searchParams.set("category", filters.category)
      if (filters.location) searchParams.set("location", filters.location)
      if (filters.minPrice) searchParams.set("minPrice", filters.minPrice)
      if (filters.maxPrice) searchParams.set("maxPrice", filters.maxPrice)
      if (filters.condition) searchParams.set("condition", filters.condition)
      if (filters.isFree) searchParams.set("isFree", "true")

      // Add sort
      const sortMap: Record<string, string> = {
        newest: "created_at_desc",
        oldest: "created_at_asc",
        "price-low": "price_asc",
        "price-high": "price_desc",
      }
      if (sortMap[sortBy]) searchParams.set("sort", sortMap[sortBy])

      const response = await fetch(`/api/listings?${searchParams.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setListings(data)
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [filters, sortBy])

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters({ ...newFilters, category: params.slug })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-2xl font-bold text-primary">
              Marketplace
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search in this category..." />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Grid className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        {/* Breadcrumb and Category Header */}
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{categoryName}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground mt-1">{listings.length} items available</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-64">
            <FiltersSidebar onFiltersChange={handleFiltersChange} initialFilters={filters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters and Sort - Mobile/Tablet */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="ml-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <FiltersSidebar onFiltersChange={handleFiltersChange} initialFilters={filters} />
              </div>
            )}

            {/* Listings Grid */}
            <ListingGrid listings={listings} isLoading={isLoading} />

            {/* Load More */}
            {!isLoading && listings.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Items
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
