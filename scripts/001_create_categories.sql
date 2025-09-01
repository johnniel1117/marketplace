-- Create categories table for marketplace items
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Electronics', 'electronics', 'Phones, computers, gadgets and more', '📱'),
  ('Vehicles', 'vehicles', 'Cars, motorcycles, boats and parts', '🚗'),
  ('Home & Garden', 'home-garden', 'Furniture, appliances, tools and decor', '🏠'),
  ('Clothing & Accessories', 'clothing-accessories', 'Fashion, shoes, jewelry and bags', '👕'),
  ('Sports & Recreation', 'sports-recreation', 'Exercise equipment, outdoor gear and games', '⚽'),
  ('Books & Media', 'books-media', 'Books, movies, music and games', '📚'),
  ('Free Stuff', 'free-stuff', 'Items being given away for free', '🆓'),
  ('Services', 'services', 'Professional and personal services', '🔧')
ON CONFLICT (slug) DO NOTHING;

-- No RLS needed for categories as they are public read-only data
