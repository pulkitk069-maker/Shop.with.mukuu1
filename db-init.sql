-- Database initialization script for shop.with.mukuu
-- Run this in your Supabase SQL editor to set up the database

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL DEFAULT 0,
  images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated users can manage products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  order_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount numeric(10, 2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create custom_gift_boxes table
CREATE TABLE IF NOT EXISTS custom_gift_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  selected_items jsonb DEFAULT '[]'::jsonb,
  box_theme text DEFAULT '',
  custom_message text DEFAULT '',
  budget_range text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_gift_boxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage custom boxes" ON custom_gift_boxes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can create custom box requests" ON custom_gift_boxes FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT '',
  subtitle text DEFAULT '',
  image_url text NOT NULL,
  link_url text DEFAULT '',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners" ON banners FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated users can manage banners" ON banners FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_image text DEFAULT '',
  rating integer DEFAULT 5,
  comment text NOT NULL,
  is_featured boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (is_featured = true);
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert sample categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Accessories', 'accessories', 'Premium fashion accessories for every style', 1),
  ('Gift Packs', 'gift-packs', 'Curated gift packs for every occasion', 2),
  ('Surprise Boxes', 'surprise-boxes', 'Mystery boxes filled with delightful surprises', 3),
  ('Combo Sets', 'combo-sets', 'Perfectly paired combo sets at great prices', 4),
  ('Customize Your Box', 'customize-your-box', 'Create your own personalized gift box', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, category_id, description, price, stock_quantity, is_featured, images)
SELECT
  'Rose Gold Bracelet',
  'rose-gold-bracelet',
  id,
  'Elegant rose gold bracelet perfect for any occasion',
  1299.00,
  15,
  true,
  '["https://images.pexels.com/photos/1464822/pexels-photo-1464822.jpeg"]'::jsonb
FROM categories WHERE slug = 'accessories' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, category_id, description, price, stock_quantity, is_featured, images)
SELECT
  'Premium Gift Box',
  'premium-gift-box',
  id,
  'Luxury gift box with handpicked premium items',
  2499.00,
  10,
  true,
  '["https://images.pexels.com/photos/264985/pexels-photo-264985.jpeg"]'::jsonb
FROM categories WHERE slug = 'gift-packs' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, category_id, description, price, stock_quantity, images)
SELECT
  'Surprise Delight Box',
  'surprise-delight-box',
  id,
  'A curated box of surprises for someone special',
  1799.00,
  20,
  '["https://images.pexels.com/photos/3445327/pexels-photo-3445327.jpeg"]'::jsonb
FROM categories WHERE slug = 'surprise-boxes' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, category_id, description, price, stock_quantity, is_featured, images)
SELECT
  'Essential Accessories Combo',
  'essential-accessories-combo',
  id,
  'Must-have accessories bundled together at a special price',
  1899.00,
  12,
  true,
  '["https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg"]'::jsonb
FROM categories WHERE slug = 'combo-sets' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, rating, comment, is_featured) VALUES
  ('Priya Sharma', 5, 'Absolutely loved the gift box I ordered! The quality was amazing and everything was beautifully packaged. Highly recommend!', true),
  ('Rahul Verma', 5, 'Best gifting experience ever! The custom box I created was perfect. My sister was so happy!', true),
  ('Ananya Reddy', 5, 'Beautiful accessories and excellent customer service. Will definitely order again!', true)
ON CONFLICT DO NOTHING;

-- Insert site settings
INSERT INTO site_settings (key, value) VALUES
  ('contact', '{"whatsapp": "+911234567890", "instagram": "@shop.with.mukuu", "email": "hello@shopwithmukuu.com"}'),
  ('brand', '{"name": "shop.with.mukuu", "tagline": "Premium Accessories & Gift Packs – Curated with Love"}')
ON CONFLICT (key) DO NOTHING;
