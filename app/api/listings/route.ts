import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const location = searchParams.get("location")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const condition = searchParams.get("condition")
    const isFree = searchParams.get("isFree")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let query = supabase
      .from("listings")
      .select(`
        *,
        categories(name, slug),
        profiles(display_name, avatar_url)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    // Apply filters
    if (category) {
      query = query.eq("categories.slug", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (location) {
      query = query.ilike("location", `%${location}%`)
    }

    if (minPrice) {
      query = query.gte("price", Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte("price", Number.parseFloat(maxPrice))
    }

    if (condition) {
      query = query.eq("condition", condition)
    }

    if (isFree === "true") {
      query = query.eq("is_free", true)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: listings, error } = await query

    if (error) {
      console.error("Error fetching listings:", error)
      return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
    }

    return NextResponse.json(listings)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, category_id, location, condition, images, tags, is_free } = body

    // Validate required fields
    if (!title || !description || !category_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: listing, error } = await supabase
      .from("listings")
      .insert({
        title,
        description,
        price: is_free ? null : price,
        category_id,
        user_id: user.id,
        location,
        condition,
        images: images || [],
        tags: tags || [],
        is_free: is_free || false,
      })
      .select(`
        *,
        categories(name, slug),
        profiles(display_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error("Error creating listing:", error)
      return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
    }

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
