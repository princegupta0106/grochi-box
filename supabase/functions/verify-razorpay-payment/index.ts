
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash } from "https://deno.land/std@0.168.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();
    
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret not configured');
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHash('sha256')
      .update(body, 'utf8')
      .update(razorpayKeySecret, 'utf8')
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      throw new Error('Invalid payment signature');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update order with payment details
    const { error } = await supabase
      .from('orders')
      .update({
        payment_method: 'razorpay',
        payment_status: 'completed',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'confirmed'
      })
      .eq('id', order_id);

    if (error) {
      console.error('Error updating order:', error);
      throw new Error('Failed to update order');
    }

    return new Response(
      JSON.stringify({ success: true, verified: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: error.message, verified: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
