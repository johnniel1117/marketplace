"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchBar } from "@/components/search-bar"
import { ListingGrid } from "@/components/listing-grid"
import { FiltersSidebar, type SearchFilters } from "@/components/filters-sidebar"
import Link from "next/link"
import type { Listing } from "@/lib/types"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [filters, setFilters] = useState<SearchFilters>({})

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const searchParamsObj = new URLSearchParams()

      // Add search query
      if (query) searchParamsObj.set("search", query)

      // Add filters to search params
      if (filters.category) searchParamsObj.set("category", filters.category)
      if (filters.location) searchParamsObj.set("location", filters.location)
      if (filters.minPrice) searchParamsObj.set("minPrice", filters.minPrice)
      if (filters.maxPrice) searchParamsObj.set("maxPrice", filters.maxPrice)
      if (filters.condition) searchParamsObj.set("condition", filters.condition)
      if (filters.isFree) searchParamsObj.set("isFree", "true")

      // Add sort
      const sortMap: Record<string, string> = {
        relevance: "relevance",
        newest: "created_at_desc",
        oldest: "created_at_asc",
        "price-low": "price_asc",
        "price-high": "price_desc",
      }
      if (sortMap[sortBy]) searchParamsObj.set("sort", sortMap[sortBy])

      const response = await fetch(`/api/listings?${searchParamsObj.toString()}`)
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
  }, [query, filters, sortBy])

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
            <SearchBar defaultValue={query} />
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
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold mb-2">
            {query ? `Search results for "${query}"` : "Search Results"}
          </h1>
          <p className="text-muted-foreground">{listings.length} items found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-64">
            <FiltersSidebar onFiltersChange={setFilters} initialFilters={filters} />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <FiltersSidebar onFiltersChange={setFilters} initialFilters={filters} />
              </div>
            )}

            {/* Results Grid */}
            <ListingGrid listings={listings} isLoading={isLoading} />

            {/* Pagination */}
            {!isLoading && listings.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
