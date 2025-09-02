"use client"

import { useState, useEffect, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Listing } from "@/lib/types"

interface ListingsGridProps {
  initialListings: Listing[]
}

export default function ListingsGrid({ initialListings }: ListingsGridProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Filter listings in real-time based on search term
  const filteredListings = useMemo(() => {
    if (!searchTerm.trim()) {
      return initialListings
    }

    const searchLower = searchTerm.toLowerCase()
    
    return initialListings.filter(listing => {
      const titleMatch = listing.title.toLowerCase().includes(searchLower)
      const descriptionMatch = listing.description?.toLowerCase().includes(searchLower)
      const locationMatch = listing.location?.toLowerCase().includes(searchLower)
      
      return titleMatch || descriptionMatch || locationMatch
    })
  }, [searchTerm, initialListings])

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchTerm ? `Search results for "${searchTerm}" (${filteredListings.length})` : "Today's picks"}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredListings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? "No listings found for your search." : "No listings available."}
              </p>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3]">
                  <img
                    src={listing.images?.[0] || "/placeholder.svg?height=300&width=300"}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-base font-semibold text-gray-500 truncate mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-bold text-gray-800 mb-1">
                    {listing.is_free ? "Free" : `$${listing.price}`}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{listing.location}</p>
                  <p className="text-xs text-gray-400 mt-1">Listed just now</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}