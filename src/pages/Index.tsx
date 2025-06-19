import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import SubCategoryTabs from "@/components/SubCategoryTabs";
import ProductGrid from "@/components/ProductGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import Cart from "@/components/Cart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
}

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(""); // No default category
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const addToCart = (product: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">QuickMart</h1>
          <p className="text-gray-600 mb-6">Delivery in 10 minutes</p>
          <p className="text-gray-700 mb-8">Please login to start shopping</p>
          <Link
            to="/auth"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Login / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {selectedCategory && (
        <SubCategoryTabs
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          onSubCategoryChange={setSelectedSubCategory}
        />
      )}

      {/* Past Orders Button */}
      <div className="px-4 py-3">
        <button 
          onClick={() => navigate('/past-orders')}
          className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">View Past Orders</span>
        </button>
      </div>
      
      <FeaturedProducts onAddToCart={addToCart} />
      
      {selectedCategory && (
        <div className="pb-4">
          <ProductGrid
            category={selectedCategory}
            onAddToCart={addToCart}
          />
        </div>
      )}
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
      />
    </div>
  );
};

export default Index;
