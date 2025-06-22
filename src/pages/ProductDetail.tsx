
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: products = [] } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const product = products.find(p => p.id.toString() === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-2">Product not found</h2>
          <Link to="/" className="text-amber-700 hover:text-amber-800">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart`,
    });
  };

  // Check if image is a URL or emoji
  const productImage = (product.images && product.images[0]) ? product.images[0] : "🛒";
  const isImageUrl = productImage.startsWith('http') || productImage.startsWith('/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-50 border-b border-amber-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-amber-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-amber-700" />
              </Link>
              <h1 className="text-lg font-bold text-amber-800">Product Details</h1>
            </div>
            
            <button className="relative p-2 bg-amber-100 rounded-full hover:bg-amber-200 transition-colors">
              <ShoppingCart className="w-5 h-5 text-amber-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <div className="pt-20 pb-24">
        <div className="bg-white/80 backdrop-blur-sm mx-4 mt-4 rounded-xl shadow-lg overflow-hidden border border-amber-200">
          {/* Product Image */}
          <div className="h-64 bg-amber-50/70 flex items-center justify-center p-8">
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
            <h1 className="text-2xl font-bold text-amber-800 mb-2">{product.name}</h1>
            <p className="text-amber-700 mb-4">{product.weight || "1 unit"}</p>
            
            {product.description && (
              <p className="text-amber-800 text-sm mb-6 leading-relaxed">
                {product.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-amber-800">₹{product.price}</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-amber-800 font-medium">Quantity:</span>
              <div className="flex items-center border border-amber-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-amber-100 transition-colors"
                >
                  <Minus className="w-4 h-4 text-amber-700" />
                </button>
                <span className="px-4 py-2 font-medium text-amber-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-amber-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-amber-200 p-4">
        <button
          onClick={addToCart}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          Add {quantity} to Cart - ₹{(parseFloat(product.price.toString()) * quantity).toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
