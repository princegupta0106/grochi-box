
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import BannerCarousel from "@/components/BannerCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryProductSection from "@/components/CategoryProductSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <BannerCarousel />
      
      <div className="max-w-6xl mx-auto px-4">
        <FeaturedProducts onAddToCart={addToCart} />
        
        <CategoriesSection />
        
        <div className="bg-white rounded-xl shadow-sm my-6">
          {categories.map((category) => (
            <CategoryProductSection
              key={category.id}
              category={category}
              onAddToCart={addToCart}
            />
          ))}
        </div>
        
        <FeaturesSection />
        
        <AboutSection />
      </div>
      
      <Footer />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
      />

      <div className="pb-20">
        <BottomTabNavigation
          cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
        />
      </div>
    </div>
  );
};

export default Index;
