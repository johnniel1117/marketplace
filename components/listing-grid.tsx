"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Listing } from "@/lib/types"

interface ListingGridProps {
  listings: Listing[]
  isLoading?: boolean
}

export function ListingGrid({ listings, isLoading }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse h-80"
          >
            <div className="aspect-[4/3] bg-gray-200 rounded-t-lg" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg font-medium">No items found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 font-sans">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listing/${listing.id}`}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex flex-col overflow-hidden">
            <div className="aspect-[4/3] bg-gray-100 relative">
              <img
                src={listing.images?.[0] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div className="flex-1 flex flex-col p-3">
              <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-2">{listing.title}</h3>
              <p className="text-lg font-bold mb-1" style={{ color: "#1877f2" }}>
                {listing.is_free ? "Free" : `$${listing.price?.toLocaleString()}`}
              </p>
              <p className="text-xs text-gray-500 mb-1">{listing.location}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                <span>By {listing.profiles?.display_name || "Anonymous"}</span>
                <span className="bg-gray-100 rounded px-2 py-0.5 text-gray-600 font-medium">{listing.condition}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
     
