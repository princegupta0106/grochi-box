
import React from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
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
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    console.log("Proceeding to checkout with items:", items);
    console.log("Total amount:", total);
    
    if (items.length === 0) {
      console.log("Cart is empty, not proceeding");
      return;
    }

    onClose();
    
    // Store cart data in sessionStorage temporarily
    sessionStorage.setItem('checkoutData', JSON.stringify({
      cartItems: items,
      total: total
    }));
    
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-md h-full flex flex-col shadow-xl border-l border-amber-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-200 bg-amber-50/50">
          <h2 className="text-lg font-bold text-amber-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-amber-700" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-amber-700 text-lg font-medium">Your cart is empty</p>
              <p className="text-amber-600 text-sm mt-2">Add some items to get started</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-amber-50/50 rounded-lg p-3 flex items-center gap-3 border border-amber-200">
                  <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center text-2xl">
                    {item.image.startsWith('http') ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      item.image
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-amber-800 text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-amber-600">{item.unit}</p>
                    <p className="text-sm font-bold text-amber-700">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center hover:bg-amber-300 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-amber-700" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-amber-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-amber-200 p-4 bg-amber-50/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-amber-800">Total:</span>
                <span className="text-xl font-bold text-amber-700">₹{total}</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  disabled={items.length === 0}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-3 px-4 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full bg-amber-100 text-amber-800 font-medium py-2 px-4 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
