
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote } from "lucide-react";
import { RAZORPAY_CONFIG, PAYMENT_METHODS, PaymentMethod } from "@/config/payment";

interface PaymentOptionsProps {
  totalAmount: number;
  onPaymentSuccess: (paymentMethod: PaymentMethod, paymentDetails?: any) => void;
  onPaymentError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentOptions = ({ totalAmount, onPaymentSuccess, onPaymentError }: PaymentOptionsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRazorpayPayment = () => {
    setIsProcessing(true);
    
    const options = {
      key: RAZORPAY_CONFIG.key_id,
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.company_name,
      description: RAZORPAY_CONFIG.description,
      theme: RAZORPAY_CONFIG.theme,
      handler: function (response: any) {
        setIsProcessing(false);
        onPaymentSuccess(PAYMENT_METHODS.RAZORPAY, response);
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
          onPaymentError("Payment cancelled by user");
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: ""
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      setIsProcessing(false);
      onPaymentError("Razorpay SDK not loaded");
    }
  };

  const handleCODPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(PAYMENT_METHODS.COD);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === PAYMENT_METHODS.RAZORPAY
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-300'
          }`}
          onClick={() => setSelectedMethod(PAYMENT_METHODS.RAZORPAY)}
        >
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-medium">Online Payment</h4>
              <p className="text-sm text-gray-600">Pay using UPI, Cards, Net Banking</p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === PAYMENT_METHODS.COD
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-300'
          }`}
          onClick={() => setSelectedMethod(PAYMENT_METHODS.COD)}
        >
          <div className="flex items-center space-x-3">
            <Banknote className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-medium">Cash on Delivery</h4>
              <p className="text-sm text-gray-600">Pay when you receive your order</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-xl font-bold text-green-600">₹{totalAmount}</span>
        </div>

        {selectedMethod && (
          <Button
            onClick={selectedMethod === PAYMENT_METHODS.RAZORPAY ? handleRazorpayPayment : handleCODPayment}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
          >
            {isProcessing ? 'Processing...' : `Pay ₹${totalAmount}`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentOptions;
