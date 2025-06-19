
import { ShoppingCart, User, LogOut, Settings, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const handleSearchClick = () => {
    navigate('/products');
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50 border-b border-gray-100">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-green-600">QuickMart</h1>
            <p className="text-xs text-gray-500">Delivery in 10 minutes</p>
          </div>
          
          <div className="flex items-center gap-2">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button 
              onClick={onCartClick}
              className="relative p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-green-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <button
            onClick={handleSearchClick}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm text-left text-gray-500 hover:bg-gray-200 transition-colors"
          >
            Search for products...
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
