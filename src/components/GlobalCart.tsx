
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Cart from "@/components/Cart";

const GlobalCart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, updateQuantity, removeItem, clearCart, getTotalItems } = useCart();

  return (
    <>
      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 bg-amber-100 rounded-full hover:bg-amber-200 transition-colors"
      >
        <ShoppingCart className="w-5 h-5 text-amber-700" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {getTotalItems()}
          </span>
        )}
      </button>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
      />
    </>
  );
};

export default GlobalCart;
