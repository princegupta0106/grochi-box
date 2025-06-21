
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryProductSection from "@/components/CategoryProductSection";
import CategoriesSection from "@/components/CategoriesSection";
import Cart from "@/components/Cart";
import BottomTabNavigation from "@/components/BottomTabNavigation";
import { useToast } from "@/hooks/use-toast";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Listen for cart clear events from checkout success
  useEffect(() => {
    const handleClearCart = () => {
      setCartItems([]);
    };

    window.addEventListener('clearCart', handleClearCart);
    return () => {
      window.removeEventListener('clearCart', handleClearCart);
    };
  }, []);

  const categories = [
    { 
      id: "fruits", 
      name: "Fresh Fruits", 
      icon: "🍎"
    },
    { 
      id: "vegetables", 
      name: "Fresh Vegetables", 
      icon: "🥕"
    },
    { 
      id: "dairy", 
      name: "Dairy Products", 
      icon: "🥛"
    },
    { 
      id: "snacks", 
      name: "Snacks & Munchies", 
      icon: "🍿"
    },
    { 
      id: "beverages", 
      name: "Cold Drinks & Juices", 
      icon: "🥤"
    },
  ];

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
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <FeaturedProducts onAddToCart={addToCart} />
      
      <CategoriesSection />
      
      <div className="bg-white">
        {categories.map((category) => (
          <CategoryProductSection
            key={category.id}
            category={category}
            onAddToCart={addToCart}
          />
        ))}
      </div>
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
      />

      <BottomTabNavigation
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />
    </div>
  );
};

export default Index;
