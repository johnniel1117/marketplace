import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

interface ListingPageProps {
  params: {
    id: string
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  // Fetch listing from Supabase
  const { data: listing, error } = await supabase
    .from("listings")
    .select("id,title,description,price,location,images,condition,category_id,created_at,email")
    .eq("id", params.id)
    .single()

  // Optionally fetch category name if you want to display it
  let categoryName = ""
  if (listing?.category_id) {
    const { data: category } = await supabase
      .from("categories")
      .select("name")
      .eq("id", listing.category_id)
      .single()
    categoryName = category?.name || ""
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Listing not found.</div>
        <Link href="/">
          <Button className="ml-4">Back to Homepage</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          {/* Back button */}
        {/* Back button */}
        
        </Link>
        <span className="text-sm text-gray-600">
          <p >Back to Marketplace</p>
        </span>
      </header>

      {/* <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Marketplace</h1>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={listing.images?.[0] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details and Messaging */}
          <div className="space-y-6">
            {/* Listing Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                {listing.is_free ? "Free" : `$${listing.price}`}
              </p>
              <div className="text-sm text-gray-600 mb-4">
                <p>Listed just now</p>
                <p>in {listing.location}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Category: {categoryName}</p>
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700">{listing.description}</p>
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h2>
                <p className="text-gray-700">{listing.email}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Message Seller</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Your Email
                  </Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="mt-1 border-gray-300" />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="I'm interested in your item!"
                    className="mt-1 border-gray-300"
                    rows={4}
                    defaultValue="I'm interested in your item!"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
