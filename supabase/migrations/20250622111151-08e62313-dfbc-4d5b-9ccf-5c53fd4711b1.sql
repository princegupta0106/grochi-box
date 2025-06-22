
-- Add guest_email column to orders table for non-authenticated users
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Add a comment to explain the column usage
COMMENT ON COLUMN public.orders.guest_email IS 'Email address for guest users who place orders without authentication';
