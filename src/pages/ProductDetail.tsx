
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import { useCart } from "@/contexts/CartContext";
import Cart from "@/components/Cart";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: variants = [] } = useProductVariants(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeItem, clearCart, getTotalItems } = useCart();

  const product = products.find(p => p.id.toString() === id);

  // Set default variant when variants load
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <Link to="/" className="text-gray-700 hover:text-gray-800">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const currentWeight = selectedVariant ? selectedVariant.weight : (product.weight || "1 unit");
    const productImage = (product.images && product.images[0]) ? product.images[0] : "🛒";
    
    addToCart({
      id: `${product.id}-${selectedVariant?.id || 'default'}`,
      name: product.name,
      price: currentPrice,
      unit: currentWeight,
      image: productImage
    }, quantity);
  };

  // Check if image is a URL or emoji
  const productImage = (product.images && product.images[0]) ? product.images[0] : "🛒";
  const isImageUrl = productImage.startsWith('http') || productImage.startsWith('/');
  
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentWeight = selectedVariant ? selectedVariant.weight : (product.weight || "1 unit");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50 border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>
              <h1 className="text-lg font-bold text-gray-800">Product Details</h1>
            </div>
            
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
          </div>
        </div>
      </header>

      {/* Product Details */}
      <div className="pt-20 pb-24">
        <div className="bg-white/90 backdrop-blur-sm mx-4 mt-4 rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Product Image */}
          <div className="h-64 bg-white flex items-center justify-center p-8">
            {isImageUrl ? (
              <img 
                src={productImage} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLDivElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : (
              <div className="text-8xl">{productImage}</div>
            )}
            {isImageUrl && (
              <div className="text-8xl hidden items-center justify-center w-full h-full">🛒</div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6">            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            {product.description && (
              <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variants Selection */}
            {variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-gray-800 font-medium mb-3">Choose Size:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border rounded-lg text-sm transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-amber-400'
                      }`}
                    >
                      <div className="font-medium">{variant.weight}</div>
                      <div className="text-xs">₹{variant.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-gray-800">₹{currentPrice}</span>
              <span className="text-gray-600">per {currentWeight}</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-800 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-700" />
                </button>
                <span className="px-4 py-2 font-medium text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add {quantity} to Cart - ₹{(currentPrice * quantity).toFixed(2)}
        </button>
      </div>

      {/* Unified Cart Component */}
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

export default ProductDetail;
