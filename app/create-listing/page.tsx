"use client"

import type React from "react"
import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function CreateListingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    location: "Palo Alto, CA",
    email: "",
    description: "",
  })

  const categories = [
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
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Listing Created!",
        description: "Your item has been listed successfully.",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photos Section */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Photos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Add photos</p>
                  <p className="text-xs text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="What are you selling?"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="mt-1 border-gray-300"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="mt-1 border-gray-300">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Price *
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="pl-8 border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="mt-1 border-gray-300"
                />
              </div>

              {/* Contact Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Contact Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 border-gray-300"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-1 border-gray-300"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
              >
                {isLoading ? "Creating..." : "Create Listing"}
              </Button>
            </form>
          </div>

          {/* Right Column - Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>

            {/* Preview Image */}
            <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Upload className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Photo preview</p>
              </div>
            </div>

            {/* Preview Details */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">{formData.title || "Title"}</h3>
              <p className="text-xl font-semibold text-gray-900">{formData.price ? `$${formData.price}` : "Price"}</p>
              <div className="text-sm text-gray-600">
                <p>Listed just now</p>
                <p>in {formData.location}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Seller Information</h4>
                <p className="text-sm text-gray-600">{formData.email || "seller@email.com"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
