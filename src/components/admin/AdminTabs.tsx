
import React from 'react';
import { Package, ShoppingBag, BadgePercent } from "lucide-react";

interface AdminTabsProps {
  activeTab: "products" | "orders" | "coupons";
  onTabChange: (tab: "products" | "orders" | "coupons") => void;
  productsCount: number;
  ordersCount: number;
  couponsCount: number;
}

const AdminTabs = ({ activeTab, onTabChange, productsCount, ordersCount, couponsCount }: AdminTabsProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4">
        <div className="flex space-x-8">
          <button
            onClick={() => onTabChange("products")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "products"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Products ({productsCount})
          </button>
          <button
            onClick={() => onTabChange("orders")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "orders"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Orders ({ordersCount})
          </button>
          <button
            onClick={() => onTabChange("coupons")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "coupons"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <BadgePercent className="w-4 h-4 inline mr-2" />
            Coupons ({couponsCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTabs;
