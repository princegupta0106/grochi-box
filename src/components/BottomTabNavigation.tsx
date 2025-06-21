
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Clock, Grid3X3 } from 'lucide-react';

interface BottomTabNavigationProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const BottomTabNavigation = ({ cartItemsCount, onCartClick }: BottomTabNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
      onClick: () => navigate('/')
    },
    {
      id: 'products',
      label: 'Products',
      icon: Grid3X3,
      path: '/products',
      onClick: () => navigate('/products')
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Clock,
      path: '/past-orders',
      onClick: () => navigate('/past-orders')
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      path: '/cart',
      onClick: onCartClick
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const isActive = tab.id === 'cart' ? false : location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 ${
                isActive 
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {tab.id === 'cart' && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabNavigation;
