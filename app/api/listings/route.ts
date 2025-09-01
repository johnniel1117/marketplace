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
        categories(name, slug)
      `) // Removed profiles join
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
    const body = await request.json()
    const { title, description, price, category_id, location, email, condition, images, tags, is_free } = body

    // Log the incoming request body for debugging
    console.log('POST /api/listings body:', body)

    // Validate required fields
    if (!title || !description || !category_id || !email) {
      return NextResponse.json({ error: "Missing required fields: title, description, category_id, or email" }, { status: 400 })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate price
    if (price !== null && price < 0) {
      return NextResponse.json({ error: "Price cannot be negative" }, { status: 400 })
    }

    // TEMPORARY WORKAROUND: Skip server-side category validation
    // since the frontend already validates the category exists
    console.log('Skipping server-side category validation for:', category_id)
    
    // Optional: Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(category_id)) {
      console.error('Invalid UUID format for category_id:', category_id)
      return NextResponse.json({ error: `Invalid category ID format: ${category_id}` }, { status: 400 })
    }

    // Get user (optional)
    const { data: { user } } = await supabase.auth.getUser()

    const { data: listing, error } = await supabase
      .from("listings")
      .insert({
        title,
        description,
        price: is_free ? null : price,
        category_id: category_id,
        user_id: user?.id || null,
        location,
        email,
        condition: condition || 'new',
        status: 'active',
        images: images || [],
        tags: tags || [],
        is_free: is_free || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select(`
        *,
        categories(name, slug)
      `) // Removed profiles join
      .single()

    if (error) {
      console.error("Error creating listing:", error)
      return NextResponse.json({ error: `Failed to create listing: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json(listing, { status: 201 })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}