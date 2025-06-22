
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';

interface CategoryProductSectionProps {
  category: {
    id: string;
    name: string;
    icon: string;
  };
  onAddToCart: (product: any) => void;
}

const CategoryProductSection = ({ category, onAddToCart }: CategoryProductSectionProps) => {
  const { data: products = [], isLoading } = useProducts(category.id);

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="mb-4">
          <div className="h-6 bg-amber-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40 bg-amber-100/50 rounded-xl p-4 animate-pulse">
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

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-bold text-amber-800">{category.name}</h2>
        <Link 
          to={`/products?category=${category.id}`} 
          className="text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          See all →
        </Link>
      </div>
      
      <div className="px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-40">
              <ProductCard
                product={{
                  id: product.id.toString(),
                  name: product.name,
                  price: parseFloat(product.price.toString()),
                  unit: product.weight || "1 unit",
                  image: (product.images && product.images[0]) ? product.images[0] : "🛒",
                }}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryProductSection;
