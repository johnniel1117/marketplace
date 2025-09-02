import { MessageCircle, User, Search } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import ListingsGrid from "./ListingGrid"
import { Listing } from "@/lib/types"

async function getFeaturedListings(): Promise<Listing[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("listings")
    .select("id,title,description,price,location,images,condition,is_free,status")
    .eq('status', 'active')
    .order("created_at", { ascending: false })
    .limit(8)
  
  if (error) {
    console.error("Error fetching featured listings:", error)
    return []
  }
  
  return data || []
}

export default async function HomePage() {
  const featuredListings: Listing[] = await getFeaturedListings()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Marketplace</h1>
          <div className="ml-auto flex items-center gap-4">
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
                  <span className="text-gray-700">Create new listing</span>
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
                  "All",
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
                ].map((category, index) => {
                  const isAll = category === "All"
                  const href = isAll
                    ? "/" // Homepage for "All"
                    : `/category/${category.toLowerCase().replace(/\s+/g, "-")}`

                  return (
                    <Link
                      key={category}
                      href={href}
                      className={`block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 ${
                        index === 0 ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {category}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </aside>

        <ListingsGrid initialListings={featuredListings} />
      </div>
    </div>
  )
}