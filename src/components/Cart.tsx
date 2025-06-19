
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CheckoutForm from './CheckoutForm';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const Cart = ({ isOpen, onClose, items, updateQuantity, removeItem, clearCart }: CartProps) => {
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      // Redirect to auth page or show login modal
      window.location.href = '/auth';
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    clearCart();
    setShowCheckout(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {showCheckout ? (
        // Full screen checkout view that replaces the entire UI
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 lg:p-6 border-b">
            <h2 className="text-xl lg:text-2xl font-semibold">Checkout</h2>
            <button
              onClick={() => setShowCheckout(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <CheckoutForm
              cartItems={items}
              total={totalAmount}
              onSuccess={handleCheckoutSuccess}
            />
          </div>
        </div>
      ) : (
        // Regular cart sidebar
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white shadow-lg z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                <h2 className="text-lg lg:text-xl font-semibold">Your Cart ({totalItems})</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {items.length === 0 ? (
                <div className="text-center py-8 lg:py-12">
                  <ShoppingBag className="w-16 h-16 lg:w-20 lg:h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 lg:text-lg">Your cart is empty</p>
                  <p className="text-sm lg:text-base text-gray-400 mt-1">Add some items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 lg:p-4 border rounded-lg">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm lg:text-base truncate">{item.name}</h3>
                        <p className="text-green-600 font-semibold lg:text-lg">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 lg:p-2 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 lg:w-10 text-center font-medium lg:text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 lg:p-2 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 lg:p-2 hover:bg-red-100 rounded text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 lg:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg lg:text-xl font-semibold">Total:</span>
                  <span className="text-xl lg:text-2xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-3 lg:py-4 rounded-lg font-medium hover:bg-green-700 transition-colors lg:text-lg"
                  >
                    {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-200 text-gray-700 py-2 lg:py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
