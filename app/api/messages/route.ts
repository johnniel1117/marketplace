import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
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

    let query = supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(display_name, avatar_url),
        recipient:profiles!messages_recipient_id_fkey(display_name, avatar_url),
        listings(title, id)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false })

    if (listingId) {
      query = query.eq("listing_id", listingId)
    }

    const { data: messages, error } = await query

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json(messages)
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
    const { listing_id, recipient_id, content } = body

    // Validate required fields
    if (!listing_id || !recipient_id || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        listing_id,
        sender_id: user.id,
        recipient_id,
        content,
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(display_name, avatar_url),
        recipient:profiles!messages_recipient_id_fkey(display_name, avatar_url),
        listings(title, id)
      `)
      .single()

    if (error) {
      console.error("Error creating message:", error)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
