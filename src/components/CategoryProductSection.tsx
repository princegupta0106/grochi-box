
import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ChevronRight } from 'lucide-react';

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
      <div className="mb-8 bg-white mx-4 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40 bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
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
    <div className="mb-8 bg-white mx-4 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
              <p className="text-sm text-gray-600">{products.length} items available</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600 font-medium text-sm">
            <span>See all</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
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
