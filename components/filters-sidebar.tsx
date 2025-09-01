"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Category } from "@/lib/types"

interface FiltersSidebarProps {
  onFiltersChange: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
}

export interface SearchFilters {
  category?: string
  location?: string
  minPrice?: string
  maxPrice?: string
  condition?: string
  isFree?: boolean
}

export function FiltersSidebar({ onFiltersChange, initialFilters = {} }: FiltersSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const updateFilter = (key: keyof SearchFilters, value: string | boolean | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {}
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter location..."
              value={filters.location || ""}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => updateFilter("category", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Price Range</Label>
          <div className="space-y-2">
            <Input
              placeholder="Min price"
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
            />
            <Input
              placeholder="Max price"
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Checkbox
              id="free-items"
              checked={filters.isFree || false}
              onCheckedChange={(checked) => updateFilter("isFree", checked as boolean)}
            />
            <Label htmlFor="free-items" className="text-sm">
              Free items only
            </Label>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Condition</Label>
          <Select
            value={filters.condition || "any"}
            onValueChange={(value) => updateFilter("condition", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Condition</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
