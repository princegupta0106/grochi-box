
export const RAZORPAY_CONFIG = {
  key_id: "rzp_test_PBM2Y93ANCIoG2",
  key_secret: "d5cwiAvh98MH4deTvSfEqMH5", // This should be kept secure on backend
  currency: "INR",
  company_name: "Your Store",
  description: "Payment for your order",
  theme: {
    color: "#10B981" // Green color matching your theme
  }
};

export const PAYMENT_METHODS = {
  RAZORPAY: "razorpay",
  COD: "cod"
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
