
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

interface ProductGridProps {
  category: string;
  onAddToCart: (product: any) => void;
}

const ProductGrid = ({ category, onAddToCart }: ProductGridProps) => {
  const { data: products = [], isLoading, error } = useProducts(category);

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="px-4 py-4 text-center">
        <p className="text-red-500">Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
        {category} ({products.length} items)
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
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
      )}
    </div>
  );
};

export default ProductGrid;
