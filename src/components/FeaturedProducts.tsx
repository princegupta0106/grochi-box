
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';

interface FeaturedProductsProps {
  onAddToCart: (product: any) => void;
}

const FeaturedProducts = ({ onAddToCart }: FeaturedProductsProps) => {
  const { data: products = [], isLoading } = useProducts();

  // Show first 8 products as featured
  const featuredProducts = products.slice(0, 8);

  if (isLoading) {
    return (
      <div className="mb-8 max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-amber-200 rounded w-32 animate-pulse"></div>
          <div className="h-6 bg-amber-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-amber-100/50 rounded-xl p-4 animate-pulse">
              <div className="h-20 bg-amber-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-amber-200 rounded mb-2"></div>
              <div className="h-3 bg-amber-200 rounded mb-2"></div>
              <div className="h-8 bg-amber-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-amber-800">Featured Products</h2>
        <Link 
          to="/products" 
          className="text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          See all →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id.toString(),
              name: product.name,
              price: parseFloat(product.price.toString()),
              unit: product.weight || "1 unit",
              image: (product.images && product.images[0]) ? product.images[0] : "🛒",
            }}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
