
import { useState } from "react";

interface SubCategoryTabsProps {
  selectedCategory: string;
  selectedSubCategory: string;
  onSubCategoryChange: (subCategory: string) => void;
}

const SubCategoryTabs = ({ selectedCategory, selectedSubCategory, onSubCategoryChange }: SubCategoryTabsProps) => {
  const subCategories: { [key: string]: { id: string; name: string; icon: string }[] } = {
    fruits: [
      { id: "fresh", name: "Fresh Fruits", icon: "🍎" },
      { id: "seasonal", name: "Seasonal", icon: "🥭" },
      { id: "exotic", name: "Exotic", icon: "🥝" },
      { id: "citrus", name: "Citrus", icon: "🍊" },
    ],
    vegetables: [
      { id: "leafy", name: "Leafy Greens", icon: "🥬" },
      { id: "root", name: "Root Vegetables", icon: "🥕" },
      { id: "herbs", name: "Herbs", icon: "🌿" },
      { id: "organic", name: "Organic", icon: "🥒" },
    ],
    dairy: [
      { id: "milk", name: "Milk", icon: "🥛" },
      { id: "cheese", name: "Cheese", icon: "🧀" },
      { id: "yogurt", name: "Yogurt", icon: "🥄" },
      { id: "butter", name: "Butter", icon: "🧈" },
    ],
    snacks: [
      { id: "chips", name: "Chips", icon: "🥔" },
      { id: "cookies", name: "Cookies", icon: "🍪" },
      { id: "nuts", name: "Nuts", icon: "🥜" },
      { id: "crackers", name: "Crackers", icon: "🍿" },
    ],
    beverages: [
      { id: "juices", name: "Juices", icon: "🧃" },
      { id: "soft-drinks", name: "Soft Drinks", icon: "🥤" },
      { id: "water", name: "Water", icon: "💧" },
      { id: "tea-coffee", name: "Tea & Coffee", icon: "☕" },
    ],
  };

  const currentSubCategories = subCategories[selectedCategory] || [];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-4 py-3">
        <div 
          className="flex gap-2 overflow-x-auto" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {currentSubCategories.map((subCategory) => (
            <button
              key={subCategory.id}
              onClick={() => onSubCategoryChange(subCategory.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                selectedSubCategory === subCategory.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{subCategory.icon}</span>
              <span>{subCategory.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryTabs;
