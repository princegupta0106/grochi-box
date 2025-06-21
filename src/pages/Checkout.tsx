
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<{
    cartItems: any[];
    total: number;
  } | null>(null);

  useEffect(() => {
    // Get checkout data from sessionStorage
    const storedData = sessionStorage.getItem('checkoutData');
    if (storedData) {
      const data = JSON.parse(storedData);
      console.log("Checkout page loaded with:", data);
      setCheckoutData(data);
    } else {
      console.log("No checkout data found in sessionStorage");
    }
  }, []);

  const handleSuccess = () => {
    // Clear the checkout data from sessionStorage
    sessionStorage.removeItem('checkoutData');
    // Navigate back to home and trigger cart clear through a custom event
    window.dispatchEvent(new CustomEvent('clearCart'));
    navigate('/');
  };

  if (!checkoutData || !checkoutData.cartItems || checkoutData.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No items in cart</h2>
          <Link to="/" className="text-green-600 hover:text-green-700">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-24">
        <CheckoutForm
          cartItems={checkoutData.cartItems}
          total={checkoutData.total}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default Checkout;
