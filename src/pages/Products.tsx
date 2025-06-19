import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { Search, ArrowLeft, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
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

const Products = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const { data: products = [], isLoading, error } = useProducts(category);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-green-600">
                  {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
                </h1>
                <p className="text-xs text-gray-500">
                  {filteredProducts.length} products found
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-green-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <div className="pt-32 pb-6">
        {isLoading ? (
          <div className="px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-16 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="px-4 py-4 text-center">
            <p className="text-red-500">Error loading products. Please try again.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery ? `No products found for "${searchQuery}"` : "No products found."}
            </p>
          </div>
        ) : (
          <div className="px-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id.toString(),
                    name: product.name,
                    price: parseFloat(product.price.toString()),
                    unit: product.weight || "1 unit",
                    image: (product.images && product.images[0]) ? product.images[0] : "🛒",
                  }}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
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

export default Products;
