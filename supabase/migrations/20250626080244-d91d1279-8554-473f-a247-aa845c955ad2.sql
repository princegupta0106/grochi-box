
-- Create a table for product variants
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  weight TEXT NOT NULL,
  price NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add some sample variants for existing products
INSERT INTO public.product_variants (product_id, weight, price) 
SELECT id, '500g', price * 0.7 FROM public.products WHERE is_active = true LIMIT 10;

INSERT INTO public.product_variants (product_id, weight, price) 
SELECT id, '1kg', price FROM public.products WHERE is_active = true LIMIT 10;

INSERT INTO public.product_variants (product_id, weight, price) 
SELECT id, '250g', price * 0.4 FROM public.products WHERE is_active = true LIMIT 5;

-- Create index for better performance
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_active ON public.product_variants(is_active);
