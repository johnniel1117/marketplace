"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, MoreHorizontal, Search, User, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

async function fetchListingsFromApi() {
  // Fetch all listings from your API
  const res = await fetch("/api/listings", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch listings")
  return res.json()
}

export default function MyListingsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const [activeListings, setActiveListings] = useState<any[]>([])
  const [soldListings, setSoldListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      try {
        const allListings = await fetchListingsFromApi()
        // Separate active and sold listings based on a property (e.g., sold_at)
        setActiveListings(allListings.filter((l: any) => !l.sold_at))
        setSoldListings(allListings.filter((l: any) => l.sold_at))
      } catch (err) {
        // Optionally handle error
        setActiveListings([])
        setSoldListings([])
      }
      setLoading(false)
    }
    fetchListings()
  }, [])

  const handleDelete = (listingId: string) => {
    setListingToDelete(listingId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting listing:", listingToDelete)
    setDeleteDialogOpen(false)
    setListingToDelete(null)
  }

  const ListingCard = ({ listing, showSoldDate = false }: { listing: any; showSoldDate?: boolean }) => (
    <Card className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={listing.images[0] || "/placeholder.svg?height=96&width=96"}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3 flex-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/listing/${listing.id}`} className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                {!showSoldDate && (
                  <DropdownMenuItem asChild>
                    <Link href={`/edit-listing/${listing.id}`} className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  )}
                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(listing.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-lg font-semibold text-blue-600 mb-1">
            {listing.is_free ? "Free" : `$${listing.price.toLocaleString()}`}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
              {listing.condition}
            </Badge>
            <span className="text-xs text-gray-500">{listing.location}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {showSoldDate
                ? `Sold ${new Date(listing.sold_at).toLocaleDateString()}`
                : `Listed ${new Date(listing.created_at).toLocaleDateString()}`}
            </span>
            {!showSoldDate && (
              <div className="flex gap-3">
                <span>{listing.views} views</span>
                <span>{listing.messages} messages</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
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
                <Link href="/my-listings" className="flex items-center gap-3 p-2 bg-blue-50 text-blue-600 rounded-lg">
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
                  <span className="text-blue-600 font-medium">Your listings</span>
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
            {/* Categories */}
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
          className={`block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 "bg-blue-50 text-gray-600 font-medium" : "text-gray-700"
          `}
        >
          {category}
        </Link>
      )
    })}
  </div>
</div>

          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Listings</h2>
              {/* <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your listings..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div> */}
            </div>

            <Tabs defaultValue="active" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-xs bg-transparent border-b">
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-700"
                >
                  Selling ({activeListings.length})
                </TabsTrigger>
                <TabsTrigger
                  value="sold"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-700"
                >
                  Sold ({soldListings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {loading ? (
                  <Card className="bg-white border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">Loading listings...</p>
                  </Card>
                ) : activeListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white border border-gray-200 p-8 text-center">
                    <p className="text-gray-500 mb-4">No active listings. Start selling now!</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      <Link href="/create-listing">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Listing
                      </Link>
                    </Button>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="sold" className="space-y-4">
                {loading ? (
                  <Card className="bg-white border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">Loading listings...</p>
                  </Card>
                ) : soldListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {soldListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} showSoldDate />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">No sold listings yet.</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-lg bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}