
-- Add location column to orders table to track order location
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_location TEXT;
