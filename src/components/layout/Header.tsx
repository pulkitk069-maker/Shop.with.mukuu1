import { useState } from 'react';
import { ShoppingCart, Menu, X, Heart, User, LogIn } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user } = useAuth(); // User login status check kar rahe hain

  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'Shop', path: 'shop' },
    { name: 'Customize Box', path: 'customize' },
    { name: 'About', path: 'about' },
    { name: 'Contact', path: 'contact' },
  ];

  const handleUserNavigation = () => {
    if (user) {
      // Agar login hai, to My Orders par le jao
      onNavigate('my-orders');
    } else {
      // Agar login nahi hai, to Login page par le jao
      onNavigate('login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            shop.with.mukuu
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`font-medium transition-colors ${
                  currentPage === item.path
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-pink-50 rounded-full transition-colors hidden md:block">
              <Heart className="w-6 h-6 text-gray-600" />
            </button>
            
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 hover:bg-pink-50 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Smart User Button */}
            <button
              onClick={handleUserNavigation}
              className="p-2 hover:bg-pink-50 rounded-full transition-colors hidden md:block"
              title={user ? "My Orders" : "Login"}
            >
              {user ? (
                <User className="w-6 h-6 text-gray-600" />
              ) : (
                <LogIn className="w-6 h-6 text-gray-600" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:hidden hover:bg-pink-50 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === item.path
                    ? 'bg-pink-100 text-pink-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile Menu Smart Button */}
            <button
              onClick={() => {
                handleUserNavigation();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {user ? 'My Orders & Account' : 'Login / Sign Up'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
                  }
