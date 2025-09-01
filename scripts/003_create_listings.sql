-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT,
  condition TEXT CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'poor')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'inactive')),
  images TEXT[], -- Array of image URLs
  tags TEXT[],
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_user ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings(location);

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listings
-- Anyone can view active listings
CREATE POLICY "listings_public_read" ON public.listings 
  FOR SELECT USING (status = 'active');

-- Users can view all their own listings
CREATE POLICY "listings_owner_read" ON public.listings 
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own listings
CREATE POLICY "listings_insert_own" ON public.listings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "listings_update_own" ON public.listings 
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "listings_delete_own" ON public.listings 
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_listings_updated_at 
  BEFORE UPDATE ON public.listings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
