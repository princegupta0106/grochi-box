
import { useAuth } from "@/hooks/useAuth";
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
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const Index = () => {
  const { user } = useAuth();
  const { cartItems, addToCart, updateQuantity, removeItem, clearCart, getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header
        cartItemsCount={getTotalItems()}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <BannerCarousel />
      
      <div className="max-w-6xl mx-auto px-4">
        <FeaturedProducts onAddToCart={handleAddToCart} />
        
        <CategoriesSection />
        
        <div className="bg-white rounded-xl shadow-sm my-6">
          {categories.map((category) => (
            <CategoryProductSection
              key={category.id}
              category={category}
              onAddToCart={handleAddToCart}
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
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
        />
      </div>
    </div>
  );
};

export default Index;
