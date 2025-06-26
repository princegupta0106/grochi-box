
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  originalPrice?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Check if image is a URL or emoji
  const isImageUrl = product.image.startsWith('http') || product.image.startsWith('/');

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 w-full relative overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="text-center mb-3">
          <div className="mb-2 h-20 flex items-center justify-center bg-white rounded-md">
            {isImageUrl ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLDivElement;
                  if (fallback) {
                    fallback.style.display = 'block';
                  }
                }}
              />
            ) : (
              <div className="text-4xl">{product.image}</div>
            )}
            {isImageUrl && (
              <div className="text-4xl hidden">🛒</div>
            )}
          </div>
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {discount}% OFF
            </span>
          )}
        </div>
        
        <div className="space-y-1 mb-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2rem]">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs">{product.unit}</p>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-lg">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 text-sm line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          onAddToCart(product);
        }}
        className="w-full bg-[#d97706] hover:bg-gray-900 text-white text-sm font-semibold py-2 px-3 rounded-md transition-all duration-200 transform hover:scale-105 shadow-md"
      >
        ADD TO CART
      </button>
    </div>
  );
};

export default ProductCard;
