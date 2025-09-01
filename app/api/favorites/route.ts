import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
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

    const { data: favorites, error } = await supabase
      .from("favorites")
      .select(`
        *,
        listings(
          *,
          categories(name, slug),
          profiles(display_name, avatar_url)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching favorites:", error)
      return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
    }

    return NextResponse.json(favorites)
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
    const { listing_id } = body

    if (!listing_id) {
      return NextResponse.json({ error: "Missing listing_id" }, { status: 400 })
    }

    const { data: favorite, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        listing_id,
      })
      .select(`
        *,
        listings(
          *,
          categories(name, slug),
          profiles(display_name, avatar_url)
        )
      `)
      .single()

    if (error) {
      console.error("Error creating favorite:", error)
      return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
    }

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get("listing_id")

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!listingId) {
      return NextResponse.json({ error: "Missing listing_id" }, { status: 400 })
    }

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId)

    if (error) {
      console.error("Error removing favorite:", error)
      return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
    }

    return NextResponse.json({ message: "Favorite removed successfully" })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
