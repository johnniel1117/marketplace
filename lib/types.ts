export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  created_at: string
}

export interface Profile {
  id: string
  display_name?: string
  bio?: string
  location?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price?: number
  category_id?: string
  user_id: string
  location?: string
  condition?: "new" | "like-new" | "good" | "fair" | "poor"
  status: "active" | "sold" | "pending" | "inactive"
  images?: string[]
  tags?: string[]
  is_free: boolean
  created_at: string
  updated_at: string
  expires_at: string
  categories?: Category
  profiles?: Profile
}

export interface Message {
  id: string
  listing_id: string
  sender_id: string
  recipient_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: Profile
  recipient?: Profile
  listings?: Pick<Listing, "id" | "title">
}

export interface Favorite {
  id: string
  user_id: string
  listing_id: string
  created_at: string
  listings?: Listing
}
