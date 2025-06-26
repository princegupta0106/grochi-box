
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

const categories = [
  { id: "fruits", name: "Fruits & Vegetables", icon: Tag },
  { id: "dairy", name: "Foodgrains, Oil & Masala", icon: Tag },
  { id: "snacks", name: "Bakery, Cakes & Dairy", icon: Tag },
  { id: "beverages", name: "Beverages", icon: Tag },
  { id: "snacks", name: "Snacks & Branded Foods", icon: Tag },
  { id: "kitchen", name: "Kitchen", icon: Tag },
  { id: "beauty", name: "Beauty & Hygiene", icon: Tag },
  { id: "baby", name: "Baby Care", icon: Tag },
  { id: "cleaning", name: "Cleaning & Household", icon: Tag },
  { id: "garden", name: "Garden", icon: Tag },
];

const CategoriesSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-amber-800 text-center mb-8">Explore Our Categories</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="bg-white/50 backdrop-blur-sm rounded-lg border border-amber-100/50 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 overflow-hidden"
            >
              <div className="p-3 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-amber-100/50 rounded-lg flex items-center justify-center mb-2">
                  <IconComponent className="w-5 h-5 text-amber-700" />
                </div>
                <span className="text-xs font-medium text-amber-800 leading-tight">
                  {category.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSection;
