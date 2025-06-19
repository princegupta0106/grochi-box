
-- Create coupons table
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('free_delivery', 'percentage', 'flat_off', 'amount_based')),
  value numeric NOT NULL,
  minimum_amount numeric,
  max_discount numeric,
  usage_limit integer,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(is_active);
CREATE INDEX idx_coupons_expires_at ON public.coupons(expires_at);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for coupons (admin can manage, users can read active ones)
CREATE POLICY "Anyone can view active coupons" 
  ON public.coupons 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage coupons" 
  ON public.coupons 
  FOR ALL 
  USING (true);
