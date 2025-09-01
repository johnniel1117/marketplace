import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: listing, error } = await supabase
      .from("listings")
      .select(`
        *,
        categories(name, slug),
        profiles(display_name, avatar_url, location, phone)
      `)
      .eq("id", id)
      .eq("status", "active")
      .single()

    if (error) {
      console.error("Error fetching listing:", error)
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, category_id, location, condition, images, tags, is_free, status } = body

    const { data: listing, error } = await supabase
      .from("listings")
      .update({
        title,
        description,
        price: is_free ? null : price,
        category_id,
        location,
        condition,
        images,
        tags,
        is_free,
        status,
      })
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the listing
      .select(`
        *,
        categories(name, slug),
        profiles(display_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error("Error updating listing:", error)
      return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("listings").delete().eq("id", id).eq("user_id", user.id) // Ensure user owns the listing

    if (error) {
      console.error("Error deleting listing:", error)
      return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
    }

    return NextResponse.json({ message: "Listing deleted successfully" })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
