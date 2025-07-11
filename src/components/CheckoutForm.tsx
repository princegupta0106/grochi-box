import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;
  onSuccess: () => void;
}

const CheckoutForm = ({ cartItems, total, onSuccess }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    location: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  // Auto-fill form data from user profile if logged in
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      try {
        // First try to get data from user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, phone_number, address, pincode, location, email')
          .eq('id', user.id)
          .single();

        if (!profileError && profile) {
          setFormData({
            name: profile.name || user.user_metadata?.name || "",
            email: profile.email || user.email || "",
            phone: profile.phone_number || "",
            address: profile.address || "",
            pincode: profile.pincode || "",
            location: profile.location || "",
          });
        } else {
          // Fallback to user email if profile doesn't exist
          setFormData(prev => ({
            ...prev,
            name: user.user_metadata?.name || "",
            email: user.email || ""
          }));
        }

        // If profile doesn't have complete data, try to get from latest order
        if (!profile?.phone_number || !profile?.address || !profile?.pincode) {
          const { data: latestOrder } = await supabase
            .from('orders')
            .select('phone_number, delivery_address, delivery_pincode, order_location')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (latestOrder) {
            setFormData(prev => ({
              name: prev.name,
              email: prev.email,
              phone: prev.phone || latestOrder.phone_number || "",
              address: prev.address || latestOrder.delivery_address || "",
              pincode: prev.pincode || latestOrder.delivery_pincode || "",
              location: prev.location || latestOrder.order_location || "",
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCurrentLocation = (): Promise<string> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`${latitude}, ${longitude}`);
          },
          (error) => {
            console.error('Error getting location:', error);
            resolve('Location not available');
          }
        );
      } else {
        resolve('Geolocation not supported');
      }
    });
  };

  const updateUserProfile = async () => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          phone_number: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
          location: formData.location,
          email: formData.email,
          updated_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Helper function to extract product UUID from cart item ID
  const extractProductId = (cartItemId: string): string => {
    // If the ID contains a hyphen pattern indicating it might be concatenated
    // Split by the last occurrence of a UUID pattern and take the first part
    const parts = cartItemId.split('-');
    if (parts.length > 5) {
      // This looks like a concatenated UUID (product-variant)
      // Take the first 5 parts to reconstruct the product UUID
      return parts.slice(0, 5).join('-');
    }
    // Otherwise, assume it's already a proper product ID
    return cartItemId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const deliveryFee = 50;
      const finalTotal = total + deliveryFee;
      const currentLocation = formData.location || await getCurrentLocation();

      // Update user profile if logged in
      if (user) {
        await updateUserProfile();
      }

      if (paymentMethod === "online") {
        // Create Razorpay order
        const { data: razorpayOrder, error: razorpayError } = await supabase.functions.invoke(
          'create-razorpay-order',
          {
            body: {
              amount: finalTotal,
              currency: 'INR',
              receipt: `order_${Date.now()}`,
            },
          }
        );

        if (razorpayError) {
          throw new Error(razorpayError.message);
        }

        // Initialize Razorpay payment
        const options = {
          key: 'rzp_test_PBM2Y93ANCIoG2',
          amount: finalTotal * 100,
          currency: 'INR',
          name: 'Grocery Delivery',
          description: 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            // Verify payment
            const { data: verificationResult, error: verificationError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }
            );

            if (verificationError || !verificationResult.success) {
              toast({
                title: "Payment verification failed",
                description: "Please try again or contact support",
                variant: "destructive",
              });
              return;
            }

            // Create order after successful payment
            await createOrder(finalTotal, currentLocation, response);
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#059669',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // COD order
        await createOrder(finalTotal, currentLocation);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (finalTotal: number, orderLocation: string, razorpayData?: any) => {
    try {
      // Create order data
      const orderData = {
        user_id: user?.id || null,
        guest_email: !user ? formData.email : null,
        total_amount: finalTotal,
        delivery_fee: 50,
        phone_number: formData.phone,
        delivery_address: formData.address,
        delivery_pincode: formData.pincode,
        payment_method: paymentMethod,
        payment_mode: (paymentMethod === "online" ? "prepaid" : "cod") as "cod" | "prepaid",
        payment_status: paymentMethod === "online" ? "completed" : "pending",
        order_location: orderLocation,
        razorpay_order_id: razorpayData?.razorpay_order_id || null,
        razorpay_payment_id: razorpayData?.razorpay_payment_id || null,
        razorpay_signature: razorpayData?.razorpay_signature || null,
      };

      console.log('Creating order with data:', orderData);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      console.log('Order created successfully:', order);

      // Create order items with proper product_id format
      const orderItems = cartItems.map(item => {
        const productId = extractProductId(item.id);
        console.log(`Cart item ID: ${item.id}, Extracted product ID: ${productId}`);
        
        return {
          order_id: order.id,
          product_id: productId, // Use extracted product UUID
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        };
      });

      console.log('Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw itemsError;
      }

      console.log('Order items created successfully');

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      });

      onSuccess();
      navigate("/");
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
            className="h-10 border-2 focus:border-green-500 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
              className="h-10 border-2 focus:border-green-500 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
              className="h-10 border-2 focus:border-green-500 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Delivery Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Enter complete delivery address"
            className="h-10 border-2 focus:border-green-500 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pincode" className="text-sm font-semibold text-gray-700">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              type="text"
              value={formData.pincode}
              onChange={handleInputChange}
              required
              placeholder="Enter delivery pincode"
              className="h-10 border-2 focus:border-green-500 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location (Optional)</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter landmark or additional location details"
              className="h-10 border-2 focus:border-green-500 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-bold text-gray-900">Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={(value: "cod" | "online") => setPaymentMethod(value)}>
            <div className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
              <RadioGroupItem value="cod" id="cod" />
              <div className="flex items-center space-x-3 flex-1">
                <Banknote className="w-5 h-5 text-green-600" />
                <div>
                  <Label htmlFor="cod" className="cursor-pointer font-semibold text-gray-900 text-sm">Cash on Delivery</Label>
                  <p className="text-xs text-gray-600">Pay when you receive your order</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
              <RadioGroupItem value="online" id="online" />
              <div className="flex items-center space-x-3 flex-1">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <Label htmlFor="online" className="cursor-pointer font-semibold text-gray-900 text-sm">Online Payment</Label>
                  <p className="text-xs text-gray-600">Pay using UPI, Cards, Net Banking</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="border-t-2 pt-4 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Subtotal:</span>
            <span className="text-sm font-semibold text-gray-900">₹{total}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Delivery Fee:</span>
            <span className="text-sm font-semibold text-gray-900">₹50</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
            <span className="text-gray-900">Total:</span>
            <span className="text-green-600">₹{total + 50}</span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Placing Order..." : `Place Order (₹${total + 50})`}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
