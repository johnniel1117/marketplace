import { Filter, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ListingGrid } from "@/components/listing-grid"
import { FiltersSidebar } from "@/components/filters-sidebar"
import Link from "next/link"
import type { Listing, SearchFilters } from "@/lib/types"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

async function fetchListings(filters: SearchFilters, sortBy: string) {
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

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings?${searchParams.toString()}`, {
      next: { revalidate: 60 }, // Optional: Cache for 60 seconds
    })
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    console.error("Failed to fetch listings:", error)
    return []
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params // Await params to access slug
  const sortBy = (searchParams.sort as string) || "newest"
  const filters: SearchFilters = {
    category: slug,
    location: searchParams.location as string,
    minPrice: searchParams.minPrice as string,
    maxPrice: searchParams.maxPrice as string,
    condition: searchParams.condition as string,
    isFree: searchParams.isFree === "true" ? true : undefined,
  }

  const listings: Listing[] = await fetchListings(filters, sortBy)
  const categoryName = slug.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Marketplace</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Input
                placeholder="Search Marketplace..."
                className="pl-10 pr-4 py-1.5 bg-white border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Create new listing</h2>
              <div className="space-y-2">
                <Link href="/create-listing" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Choose listing type</span>
                </Link>
                <Link href="/my-listings" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2V6a1 1 0 112 0v1a1 1 0 11-2 0zm3 0V6a1 1 0 112 0v1a1 1 0 11-2 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Your listings</span>
                </Link>
                <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg w-full text-left">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Seller help</span>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              <div className="space-y-1">
                {[
                  "Vehicles",
                  "Property Rentals",
                  "Apparel",
                  "Classifieds",
                  "Electronics",
                  "Entertainment",
                  "Family",
                  "Free Stuff",
                  "Garden & Outdoor",
                  "Hobbies",
                  "Home Goods",
                  "Home Improvement",
                  "Home Sales",
                  "Musical Instruments",
                  "Office Supplies",
                  "Pet Supplies",
                  "Sporting Goods",
                  "Toys & Games",
                  "Buy and sell groups",
                ].map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 ${
                      category.toLowerCase().replace(/\s+/g, "-") === slug
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Breadcrumb and Category Header */}
            <div className="mb-6">
              <nav className="text-sm text-gray-600 mb-2">
                <Link href="/" className="hover:text-gray-900">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{categoryName}</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
              <p className="text-gray-600 mt-1">{listings.length} items available</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters Sidebar - Desktop */}
              <div className="hidden lg:block lg:w-64">
                <FiltersSidebar
                  initialFilters={filters}
                  // Note: FiltersSidebar must be a Client Component to handle onFiltersChange
                />
              </div>

              {/* Listings and Controls */}
              <div className="flex-1">
                {/* Filters and Sort - Mobile/Tablet */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>

                  <div className="ml-auto">
                    <Select defaultValue={sortBy}>
                      <SelectTrigger className="w-[160px] border-gray-300 bg-white">
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

                {/* Listings Grid */}
                <ListingGrid listings={listings} isLoading={false} />

                {/* Load More */}
                {listings.length > 0 && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                    >
                      Load More Items
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}