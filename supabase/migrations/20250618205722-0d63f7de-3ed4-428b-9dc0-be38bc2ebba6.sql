
-- Create enum for order status
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  pincode TEXT NOT NULL,
  address TEXT,
  order_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create serviceable_pincodes table
CREATE TABLE public.serviceable_pincodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pincode TEXT NOT NULL UNIQUE,
  area_name TEXT NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  minimum_order_qty INTEGER DEFAULT 1,
  images TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  weight TEXT,
  category TEXT NOT NULL,
  sub_category TEXT,
  is_featured_today BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  status order_status DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  delivery_pincode TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serviceable_pincodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for serviceable_pincodes (public read access)
CREATE POLICY "Anyone can view serviceable pincodes" ON public.serviceable_pincodes
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- RLS Policies for products (public read access)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone_number, pincode)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'pincode', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update order_ids in profiles when new order is created
CREATE OR REPLACE FUNCTION public.update_user_order_ids()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET order_ids = array_append(order_ids, NEW.id)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user's order_ids array when new order is created
CREATE TRIGGER on_order_created
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_user_order_ids();

-- Insert some sample serviceable pincodes
INSERT INTO public.serviceable_pincodes (pincode, area_name, delivery_fee) VALUES
('110001', 'Connaught Place, Delhi', 25.00),
('110016', 'Lajpat Nagar, Delhi', 25.00),
('400001', 'Fort, Mumbai', 30.00),
('400050', 'Bandra West, Mumbai', 30.00),
('560001', 'Bangalore City, Bangalore', 20.00),
('560008', 'Malleshwaram, Bangalore', 20.00);

-- Insert some sample products
INSERT INTO public.products (name, description, price, weight, category, sub_category, is_featured_today, images) VALUES
('Fresh Bananas', 'Fresh yellow bananas - rich in potassium', 40.00, '1 kg', 'fruits', 'fresh_fruits', true, ARRAY['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300']),
('Organic Apples', 'Crisp and sweet organic apples', 120.00, '1 kg', 'fruits', 'organic', false, ARRAY['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300']),
('Fresh Milk', 'Full cream fresh milk', 25.00, '500ml', 'dairy', 'milk', true, ARRAY['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300']),
('Whole Wheat Bread', 'Healthy whole wheat bread', 35.00, '400g', 'bakery', 'bread', false, ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300']),
('Fresh Carrots', 'Crunchy orange carrots', 30.00, '500g', 'vegetables', 'root_vegetables', false, ARRAY['https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300']),
('Potato Chips', 'Crispy salted potato chips', 20.00, '50g', 'snacks', 'chips', true, ARRAY['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300']);
