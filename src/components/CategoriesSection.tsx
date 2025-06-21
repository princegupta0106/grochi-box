
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: "fruits", name: "Fruits & Vegetables", icon: "🍎", color: "bg-green-100" },
  { id: "dairy", name: "Foodgrains, Oil & Masala", icon: "🌾", color: "bg-yellow-100" },
  { id: "snacks", name: "Bakery, Cakes & Dairy", icon: "🍰", color: "bg-pink-100" },
  { id: "beverages", name: "Beverages", icon: "🥤", color: "bg-blue-100" },
  { id: "snacks", name: "Snacks & Branded Foods", icon: "🍿", color: "bg-orange-100" },
  { id: "kitchen", name: "Kitchen", icon: "🍴", color: "bg-red-100" },
  { id: "beauty", name: "Beauty & Hygiene", icon: "🧴", color: "bg-purple-100" },
  { id: "baby", name: "Baby Care", icon: "👶", color: "bg-pink-100" },
  { id: "cleaning", name: "Cleaning & Household", icon: "🧽", color: "bg-green-100" },
  { id: "garden", name: "Garden", icon: "🌱", color: "bg-green-100" },
];

const CategoriesSection = () => {
  return (
    <div className="px-3 py-3 bg-white">
      <h2 className="text-base font-bold text-gray-900 mb-2">Shop by Category</h2>
      <div className="grid grid-cols-3 gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.id}`}
            className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 overflow-hidden"
          >
            <div className={`${category.color} p-3 flex items-center justify-center`}>
              <span className="text-3xl">{category.icon}</span>
            </div>
            <div className="p-2">
              <span className="text-xs font-medium text-gray-700 text-center block leading-tight">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
