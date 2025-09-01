"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export default function MyListingsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)

  const activeListings = [
    {
      id: "1",
      title: "iPhone 14 Pro Max - Excellent Condition",
      price: 899,
      location: "San Francisco, CA",
      image: "/iphone-14-pro-max.png",
      condition: "like-new",
      created_at: "2024-01-15",
      views: 45,
      messages: 3,
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
      views: 23,
      messages: 1,
      is_free: false,
    },
  ]

  const soldListings = [
    {
      id: "3",
      title: "Gaming Headset - Excellent Sound",
      price: 75,
      location: "San Francisco, CA",
      image: "/gaming-headset-audio.png",
      condition: "good",
      created_at: "2024-01-10",
      sold_at: "2024-01-12",
      is_free: false,
    },
  ]

  const handleDelete = (listingId: string) => {
    setListingToDelete(listingId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, this would call the API to delete the listing
    console.log("Deleting listing:", listingToDelete)
    setDeleteDialogOpen(false)
    setListingToDelete(null)
  }

  const ListingCard = ({ listing, showSoldDate = false }: { listing: any; showSoldDate?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={listing.image || "/placeholder.svg"}
              alt={listing.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold line-clamp-2 text-sm">{listing.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/listing/${listing.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  {!showSoldDate && (
                    <DropdownMenuItem asChild>
                      <Link href={`/edit-listing/${listing.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(listing.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-lg font-bold text-primary mb-1">
              {listing.is_free ? "Free" : `$${listing.price.toLocaleString()}`}
            </p>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {listing.condition}
              </Badge>
              <span className="text-xs text-muted-foreground">{listing.location}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
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
      </CardContent>
    </Card>
  )

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

          <Button asChild>
            <Link href="/create-listing">
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Link>
          </Button>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold mb-2">My Listings</h1>
          <p className="text-muted-foreground">Manage your active and sold listings.</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="sold">Sold ({soldListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeListings.length > 0 ? (
              <div className="space-y-4">
                {activeListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">You don't have any active listings yet.</p>
                  <Button asChild>
                    <Link href="/create-listing">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Listing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sold" className="space-y-4">
            {soldListings.length > 0 ? (
              <div className="space-y-4">
                {soldListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} showSoldDate />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No sold listings yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
