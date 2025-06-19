
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
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <Link to={`/product/${product.id}`} className="block">
        <div className="text-center mb-3">
          <div className="mb-2 h-16 flex items-center justify-center">
            {isImageUrl ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded"
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
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
              {discount}% OFF
            </span>
          )}
        </div>
        
        <div className="space-y-2 mb-3">
          <h3 className="font-medium text-gray-800 text-sm leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs">{product.unit}</p>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">
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
        className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors active:scale-95"
      >
        ADD
      </button>
    </div>
  );
};

export default ProductCard;
