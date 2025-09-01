import { ArrowLeft, MapPin, Calendar, Star, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // In a real app, this would fetch from the API
  const profile = {
    id: params.id,
    display_name: "John D.",
    bio: "Longtime Bay Area resident selling quality items. I take great care of my belongings and provide honest descriptions. Fast communication and flexible with meetup times.",
    location: "San Francisco, CA",
    avatar: "/diverse-profile-avatars.png",
    member_since: "2022-03-15",
    rating: 4.8,
    total_sales: 23,
    total_reviews: 18,
  }

  const activeListings = [
    {
      id: "1",
      title: "iPhone 14 Pro Max - Excellent Condition",
      price: 899,
      location: "San Francisco, CA",
      image: "/iphone-14-pro-max.png",
      condition: "like-new",
      created_at: "2024-01-15",
      is_free: false,
    },
    {
      id: "2",
      title: "MacBook Air M2 - Perfect for Students",
      price: 1200,
      location: "San Francisco, CA",
      image: "/macbook-air-laptop.png",
      condition: "good",
      created_at: "2024-01-14",
      is_free: false,
    },
  ]

  const reviews = [
    {
      id: "1",
      reviewer: "Sarah M.",
      rating: 5,
      comment: "Great seller! Item was exactly as described and John was very responsive to messages.",
      date: "2024-01-10",
      item: "Gaming Headset",
    },
    {
      id: "2",
      reviewer: "Mike R.",
      rating: 5,
      comment: "Smooth transaction, met on time and item was in perfect condition. Highly recommend!",
      date: "2024-01-05",
      item: "Wireless Keyboard",
    },
    {
      id: "3",
      reviewer: "Lisa K.",
      rating: 4,
      comment: "Good communication and fair pricing. Would buy from again.",
      date: "2023-12-28",
      item: "Phone Case",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/" className="font-serif text-2xl font-bold text-primary">
              Marketplace
            </Link>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{profile.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button className="w-full md:w-auto">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="font-serif text-3xl font-bold mb-2">{profile.display_name}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Member since {new Date(profile.member_since).getFullYear()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(profile.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{profile.rating}</span>
                      <span className="text-sm text-muted-foreground">({profile.total_reviews} reviews)</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-bold">{profile.total_sales}</p>
                        <p className="text-muted-foreground">Sales</p>
                      </div>
                    </div>
                  </div>
                </div>

                {profile.bio && (
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">Active Listings ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeListings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      {listing.is_free && (
                        <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700">FREE</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm">{listing.title}</h3>
                      <p className="text-lg font-bold text-primary mb-1">
                        {listing.is_free ? "Free" : `$${listing.price.toLocaleString()}`}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">{listing.location}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Listed {new Date(listing.created_at).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {listing.condition}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-sm">{review.reviewer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{review.reviewer}</p>
                        <p className="text-xs text-muted-foreground">Purchased: {review.item}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
