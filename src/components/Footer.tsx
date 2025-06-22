
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-amber-100 to-orange-100 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛒</span>
              <h3 className="text-xl font-bold text-amber-900">DesiCart Bazaar</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your trusted source for authentic Rajasthani raw foods & masalas. 100% 
              natural, traditionally sourced. Delivered fresh to your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-amber-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-amber-800 text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-amber-800 text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-700 hover:text-amber-800 text-sm transition-colors"
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="font-bold text-amber-900 mb-4">Connect With Us</h4>
            <div className="flex gap-4 mb-4">
              <a 
                href="#" 
                className="p-2 bg-amber-200 rounded-full hover:bg-amber-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-amber-800" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-amber-200 rounded-full hover:bg-amber-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-amber-800" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-amber-200 rounded-full hover:bg-amber-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-amber-800" />
              </a>
            </div>
            <p className="text-gray-700 text-sm">
              Follow us for updates and offers!
            </p>
          </div>
        </div>

        <div className="border-t border-amber-200 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 DesiCart Bazaar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
