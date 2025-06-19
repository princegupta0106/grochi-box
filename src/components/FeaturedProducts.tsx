
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

interface FeaturedProductsProps {
  onAddToCart: (product: any) => void;
}

const FeaturedProducts = ({ onAddToCart }: FeaturedProductsProps) => {
  const { data: allProducts = [] } = useProducts();
  
  // Filter products that are featured today
  const featuredProducts = allProducts.filter(product => product.is_featured_today);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-6 bg-white mx-4 my-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⭐</span>
        <h2 className="text-lg font-semibold text-gray-800">Today's Featured Products</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
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
