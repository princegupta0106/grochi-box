
-- Create a table to track admin locations and manage serviceability
CREATE TABLE IF NOT EXISTS public.admin_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  pincode TEXT NOT NULL,
  is_current_location BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for admin locations
ALTER TABLE public.admin_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage locations" 
  ON public.admin_locations 
  FOR ALL 
  USING (auth.uid() = admin_user_id);

-- Create a function to check if a pincode is serviceable
CREATE OR REPLACE FUNCTION public.is_pincode_serviceable(check_pincode TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.serviceable_pincodes 
    WHERE pincode = check_pincode AND is_active = true
  );
END;
$$;

-- Create a trigger to validate orders against serviceable pincodes
CREATE OR REPLACE FUNCTION public.validate_order_pincode()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the delivery pincode is serviceable
  IF NOT public.is_pincode_serviceable(NEW.delivery_pincode) THEN
    RAISE EXCEPTION 'Order cannot be placed. Pincode % is not serviceable.', NEW.delivery_pincode;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_pincode_before_order ON public.orders;
CREATE TRIGGER validate_pincode_before_order
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_pincode();

-- Add payment method and payment details columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
