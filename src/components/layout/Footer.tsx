import { Instagram, Mail, Phone, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 via-rose-50 to-peach-50 border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent mb-4">
              shop.with.mukuu
            </h3>
            <p className="text-gray-600 mb-4">
              Premium Accessories & Gift Packs – Curated with Love
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/shop.with.mukuu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full hover:bg-pink-100 transition-colors shadow-md"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
              </a>
              <a
                href="mailto:hello@shopwithmukuu.com"
                className="p-3 bg-white rounded-full hover:bg-pink-100 transition-colors shadow-md"
              >
                <Mail className="w-5 h-5 text-pink-600" />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full hover:bg-pink-100 transition-colors shadow-md"
              >
                <Phone className="w-5 h-5 text-pink-600" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Custom Gifts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Accessories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Gift Packs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Surprise Boxes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Combo Sets
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-pink-200 text-center">
          <p className="text-gray-600 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> by shop.with.mukuu
            <span className="mx-2">•</span>
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
