
import { useNavigate } from "react-router-dom";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs = ({ selectedCategory, onCategoryChange }: CategoryTabsProps) => {
  const navigate = useNavigate();
  
  const categories = [
    { 
      id: "fruits", 
      name: "Fruits", 
      icon: "🍎",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=300&fit=crop&crop=center"
    },
    { 
      id: "vegetables", 
      name: "Vegetables", 
      icon: "🥕",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&crop=center"
    },
    { 
      id: "dairy", 
      name: "Dairy", 
      icon: "🥛",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&crop=center"
    },
    { 
      id: "snacks", 
      name: "Snacks", 
      icon: "🍿",
      image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop&crop=center"
    },
    { 
      id: "beverages", 
      name: "Beverages", 
      icon: "🥤",
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <div className="bg-white border-b border-gray-100 py-3">
      <div className="px-4">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95 w-full"
            >
              <div className="aspect-square w-full rounded-md overflow-hidden mb-2 mx-auto">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLDivElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-gray-100 hidden items-center justify-center text-2xl">
                  {category.icon}
                </div>
              </div>
              <h3 className="font-medium text-gray-800 text-center text-xs">{category.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
