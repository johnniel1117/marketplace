"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Category } from "@/lib/types"

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-muted rounded mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-16 mx-auto"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{category.icon}</div>
              <h4 className="font-semibold mb-1">{category.name}</h4>
              <p className="text-sm text-muted-foreground">Browse items</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
