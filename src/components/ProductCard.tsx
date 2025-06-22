
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
    <div className="bg-transparent rounded-lg p-1.5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300 w-full relative overflow-hidden backdrop-blur-sm">
      <Link to={`/product/${product.id}`} className="block">
        <div className="text-center mb-1.5">
          <div className="mb-1 h-16 flex items-center justify-center bg-amber-50/70 rounded-md">
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
              <div className="text-3xl">{product.image}</div>
            )}
            {isImageUrl && (
              <div className="text-3xl hidden">🛒</div>
            )}
          </div>
          {discount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-bold">
              {discount}% OFF
            </span>
          )}
        </div>
        
        <div className="space-y-0.5 mb-1.5">
          <h3 className="font-semibold text-amber-900 text-xs leading-tight line-clamp-2 min-h-[1rem]">
            {product.name}
          </h3>
          <p className="text-amber-700 text-xs">{product.unit}</p>
          
          <div className="flex items-center gap-1">
            <span className="font-bold text-amber-800 text-sm">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-amber-600 text-xs line-through">
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
        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-semibold py-1 px-2 rounded-md transition-all duration-200 transform hover:scale-105 shadow-md"
      >
        ADD TO CART
      </button>
    </div>
  );
};

export default ProductCard;
