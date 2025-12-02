import { useEffect, useState } from 'react';
import { Search, Filter, Gift, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
// Firebase imports
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ye wo file hai jo humne step 2 mein banayi thi
import { useCart } from '../context/CartContext';

// Types define kar rahe hain taki error na aaye
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: string;
  stock_quantity: number;
  is_active: boolean;
  created_at?: any;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Categories lana Firebase se
      const catsSnapshot = await getDocs(collection(db, 'categories'));
      const catsData = catsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];

      // 2. Products lana Firebase se
      const prodsSnapshot = await getDocs(collection(db, 'products'));
      const prodsData = prodsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Sirf active products dikhana
      const activeProducts = prodsData.filter(p => p.is_active !== false);

      setCategories(catsData);
      setProducts(activeProducts);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;

    let matchesPrice = true;
    if (priceRange === 'under500') matchesPrice = product.price < 500;
    if (priceRange === '500-1000') matchesPrice = product.price >= 500 && product.price <= 1000;
    if (priceRange === '1000-2000') matchesPrice = product.price > 1000 && product.price <= 2000;
    if (priceRange === 'over2000') matchesPrice = product.price > 2000;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shop Our Collection</h1>
          <p className="text-gray-600 text-lg">Discover premium accessories and gift packs</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Prices</option>
              <option value="under500">Under ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-2000">₹1000 - ₹2000</option>
              <option value="over2000">Over ₹2000</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? 'Loading products...' : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
          </p>
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filters Applied</span>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
           <div className="flex justify-center p-12">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
           </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} hover>
                <div className="group">
                  <div className="aspect-square bg-gray-100 overflow-hidden rounded-t-2xl relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    {product.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-pink-600">₹{product.price}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                    {product.stock_quantity > 0 && product.stock_quantity < 5 && (
                      <p className="text-xs text-orange-600 mt-2">
                        Only {product.stock_quantity} left in stock!
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
