"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      const { data: category, error: catErr } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single()
      if (catErr || !category) {
        setListings([])
        setLoading(false)
        return
      }

      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select("id,title,price,location,images,condition,is_free")
        .eq("category_id", category.id)
        .order("created_at", { ascending: false })

      if (listingsError) {
        console.error("Listings fetch error:", listingsError)
        setListings([])
      } else {
        setListings(listingsData || [])
      }
      setLoading(false)
    }
    if (slug) fetchListings()
  }, [slug])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 capitalize">
          {slug?.replace(/-/g, " ")}
        </h1>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
          {slug?.replace(/-/g, " ")} Listings
        </h2>

        {loading ? (
          <div>Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-gray-500">No listings found in this category.</div>
        ) : (
          // Grid like marketplace
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="w-full h-48">
                  <img
                    src={listing.images?.[0] || "/placeholder.svg?height=200&width=200"}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    {listing.is_free ? "Free" : `₱${listing.price}`}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{listing.location}</p>
                  <p className="text-sm text-gray-600">Condition: {listing.condition}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
