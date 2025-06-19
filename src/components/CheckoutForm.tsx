
import React, { useState } from "react";
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
    phone: "",
    address: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePincode = async (pincode: string) => {
    try {
      const { data, error } = await supabase
        .rpc('is_pincode_serviceable', { check_pincode: pincode });

      if (error) {
        console.error('Error checking pincode:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error validating pincode:', error);
      return false;
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Validate pincode serviceability
    const isServiceable = await validatePincode(formData.pincode);
    if (!isServiceable) {
      toast({
        title: "Service Not Available",
        description: `Sorry, we don't deliver to pincode ${formData.pincode} yet.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const deliveryFee = 50;
      const finalTotal = total + deliveryFee;
      const currentLocation = await getCurrentLocation();

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
            email: user.email,
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
      // Create order with payment_mode enum
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user!.id,
          total_amount: finalTotal,
          delivery_fee: 50,
          phone_number: formData.phone,
          delivery_address: formData.address,
          delivery_pincode: formData.pincode,
          payment_method: paymentMethod,
          payment_mode: paymentMethod === "online" ? "prepaid" : "cod",
          payment_status: paymentMethod === "online" ? "completed" : "pending",
          order_location: orderLocation,
          razorpay_order_id: razorpayData?.razorpay_order_id || null,
          razorpay_payment_id: razorpayData?.razorpay_payment_id || null,
          razorpay_signature: razorpayData?.razorpay_signature || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

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
    <div>
      {/* Order summary section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">₹{item.price} x {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
              className="lg:text-base"
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              type="text"
              value={formData.pincode}
              onChange={handleInputChange}
              required
              placeholder="Enter delivery pincode"
              className="lg:text-base"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Delivery Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Enter complete delivery address"
            className="lg:text-base"
          />
        </div>

        <div className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={(value: "cod" | "online") => setPaymentMethod(value)}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer mb-3">
              <RadioGroupItem value="cod" id="cod" />
              <div className="flex items-center space-x-3 flex-1">
                <Banknote className="w-5 h-5 text-green-600" />
                <div>
                  <Label htmlFor="cod" className="cursor-pointer font-medium">Cash on Delivery</Label>
                  <p className="text-sm text-gray-600">Pay when you receive your order</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="online" id="online" />
              <div className="flex items-center space-x-3 flex-1">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <Label htmlFor="online" className="cursor-pointer font-medium">Online Payment</Label>
                  <p className="text-sm text-gray-600">Pay using UPI, Cards, Net Banking</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="lg:text-lg">Subtotal:</span>
            <span className="lg:text-lg">₹{total}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="lg:text-lg">Delivery Fee:</span>
            <span className="lg:text-lg">₹50</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg lg:text-xl">
            <span>Total:</span>
            <span>₹{total + 50}</span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-3 lg:py-4 lg:text-lg"
          disabled={loading}
        >
          {loading ? "Placing Order..." : `Place Order (₹${total + 50})`}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
