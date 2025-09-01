import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface ListingPageProps {
  params: {
    id: string
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = {
    id: params.id,
    title: "Orange Bike for sale",
    description: "Good condition. Pick up on campus!",
    price: 120,
    location: "Palo Alto, CA",
    images: ["/mountain-bike-trail.png"],
    seller: {
      name: "John D.",
      email: "gwientjes@gmail.com",
    },
    condition: "good",
    category: "Sporting Goods",
    created_at: "2024-01-15",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">Back to Marketplace</span>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Marketplace</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={listing.images[0] || "/placeholder.svg"}
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
              <p className="text-2xl font-bold text-gray-900 mb-4">${listing.price}</p>

              <div className="text-sm text-gray-600 mb-4">
                <p>Listed just now</p>
                <p>in {listing.location}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Category: {listing.category}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700">{listing.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h2>
                <p className="text-gray-700">{listing.seller.email}</p>
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
