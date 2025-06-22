
-- Create banners table for homepage banners
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active banners
CREATE POLICY "Anyone can view active banners" 
  ON public.banners 
  FOR SELECT 
  USING (is_active = true);

-- Only authenticated users can manage banners (for admin panel)
CREATE POLICY "Authenticated users can manage banners" 
  ON public.banners 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Create storage bucket for banner images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true);

-- Allow public access to banner images
CREATE POLICY "Public can view banner images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

-- Allow authenticated users to upload banner images
CREATE POLICY "Authenticated users can upload banner images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete banner images
CREATE POLICY "Authenticated users can delete banner images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true);

-- Allow public access to product images
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');
