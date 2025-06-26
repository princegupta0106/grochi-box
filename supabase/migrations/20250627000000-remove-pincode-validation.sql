-- Drop the trigger that validates pincodes before order insertion
DROP TRIGGER IF EXISTS validate_pincode_before_order ON public.orders;

-- Optionally, we can also drop the function used by the trigger if it's not needed elsewhere
DROP FUNCTION IF EXISTS public.validate_order_pincode();

-- We'll keep the is_pincode_serviceable function as it might be used elsewhere
-- If you want to drop it too, uncomment the next line
-- DROP FUNCTION IF EXISTS public.is_pincode_serviceable(TEXT);
