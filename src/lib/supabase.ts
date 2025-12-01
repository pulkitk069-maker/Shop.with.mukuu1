import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  order_items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CustomGiftBox {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  selected_items: string[];
  box_theme: string;
  custom_message: string;
  budget_range: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_image: string;
  rating: number;
  comment: string;
  is_featured: boolean;
  created_at: string;
}
