"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function CreateListingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [formData, setFormData] = useState({
    title: "",
    category: "", // will store category.id (UUID)
    price: "",
    location: "Palo Alto, CA",
    email: "",
    description: "",
    condition: "new",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('id, name, slug')
        console.log('Categories fetched:', { data, error }) // Debug log
        
        // Add detailed logging for each category
        if (data) {
          console.log('Category details:')
          data.forEach((cat, index) => {
            console.log(`${index + 1}. ID: ${cat.id}, Name: ${cat.name}, Slug: ${cat.slug}`)
          })
        }
        
        if (error) {
          console.error('Error fetching categories:', error)
          toast({
            title: "Error",
            description: "Failed to load categories. Please refresh the page.",
            variant: "destructive",
          })
          return
        }
        if (!data || data.length === 0) {
          console.warn('No categories found in database')
          toast({
            title: "Warning",
            description: "No categories available. Please contact support.",
            variant: "destructive",
          })
          return
        }
        setCategories(data)
      } catch (err) {
        console.error('Unexpected error fetching categories:', err)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        })
      }
    }
    fetchCategories()
  }, [toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast({
          title: "Error",
          description: "Only JPEG, PNG, or WebP images are allowed",
          variant: "destructive",
        })
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.email) {
        throw new Error("Please fill in all required fields: title, description, category, and email")
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Invalid email format")
      }

      // Validate price
      if (formData.price && parseFloat(formData.price) < 0) {
        throw new Error("Price cannot be negative")
      }

      // Validate category - check if the selected category ID exists
      const selectedCategory = categories.find((cat) => cat.id === formData.category)
      if (!selectedCategory) {
        console.error('Selected category not found:', {
          selectedCategoryId: formData.category,
          availableCategories: categories
        })
        throw new Error("Invalid category selected")
      }
      
      console.log('Selected category:', selectedCategory)

      // Handle image upload if present
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `public/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, imageFile)

        if (uploadError) {
          console.error('Image upload error:', uploadError)
          throw new Error(`Image upload failed: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName)
        
        imageUrl = publicUrl
      }

      // Send data to API route
      const requestBody = {
        title: formData.title,
        description: formData.description,
        price: formData.price ? Number(formData.price) : null,
        category_id: formData.category, // Now sending the UUID
        location: formData.location,
        email: formData.email,
        condition: formData.condition,
        images: imageUrl ? [imageUrl] : [],
        is_free: !formData.price || parseFloat(formData.price) === 0,
        tags: [],
      }
      
      console.log('Sending to API:', requestBody)
      
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const { error } = await response.json()
        console.error('API error:', error)
        throw new Error(error || "Failed to create listing")
      }

      toast({
        title: "Listing Created!",
        description: "Your item has been listed successfully.",
      })

      router.push("/")
    } catch (error: any) {
      console.error('Submit error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create listing. Please try again.",
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
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 
                  flex items-center justify-center text-center">
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleImageChange}
      ref={fileInputRef}
      className="hidden"
    />
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="flex flex-col items-center justify-center"
    >
      <Upload className="h-8 w-8 mb-3 text-gray-400" />
      <p className="text-sm text-gray-600 mb-2">Add photos</p>
      <p className="text-xs text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
    </button>
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
                    <SelectValue placeholder={categories.length ? "Select a category" : "Loading categories..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Condition *</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger className="mt-1 border-gray-300">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {['new', 'like-new', 'good', 'fair', 'poor'].map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {cond.charAt(0).toUpperCase() + cond.slice(1)}
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
                disabled={isLoading || categories.length === 0}
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
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="object-cover w-full h-full rounded-lg" />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Photo preview</p>
                </div>
              )}
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