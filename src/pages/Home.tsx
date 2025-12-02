import { useEffect, useState } from 'react';
import { Star, Gift, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
// Firebase Imports
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface HomeProps {
  onNavigate: (page: string) => void;
}

// Types define kar rahe hain
interface Category {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  display_order: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
}

interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_featured: boolean;
}

export function Home({ onNavigate }: HomeProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Categories Fetch Karna
      const catsSnapshot = await getDocs(collection(db, 'categories'));
      const catsData = catsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      // Sort manually (display_order ke hisaab se)
      catsData.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setCategories(catsData);

      // 2. Featured Products Fetch Karna
      // Note: 'where' queries ke liye Firestore mein index chahiye hota hai.
      // Agar index error aaye to hum client-side filter kar lenge fallback ke liye.
      try {
        const prodsRef = collection(db, 'products');
        const q = query(prodsRef, where('is_featured', '==', true), where('is_active', '==', true), limit(4));
        const prodsSnapshot = await getDocs(q);
        const prodsData = prodsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setFeaturedProducts(prodsData);
      } catch (e) {
        // Fallback: Agar index nahi hai to sab laake filter karo
        const allProds = await getDocs(collection(db, 'products'));
        const filtered = allProds.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Product))
          .filter(p => p.is_featured && p.is_active)
          .slice(0, 4);
        setFeaturedProducts(filtered);
      }

      // 3. Testimonials Fetch Karna (Agar collection ho to)
      try {
        const testRef = collection(db, 'testimonials');
        const q = query(testRef, where('is_featured', '==', true), limit(3));
        const testSnapshot = await getDocs(q);
        const testData = testSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Testimonial[];
        setTestimonials(testData);
      } catch (e) {
        console.log("Testimonials collection not created yet, showing defaults or empty.");
        // Optional: Yahan hardcoded testimonials dikha sakte hain agar database khali hai
      }

    } catch (error) {
      console.error("Error loading home data:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full mb-6 shadow-md">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">Premium Quality Gifts</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
              shop.with.mukuu
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-light">
            Premium Accessories & Gift Packs – Curated with Love
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('shop')}>
              Shop Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('customize')}>
              Customize Your Box
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                <Gift className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Handpicked products with love</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                <Sparkles className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Custom Boxes</h3>
              <p className="text-gray-600 text-sm">Personalized gift hampers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                <Heart className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Made with Love</h3>
              <p className="text-gray-600 text-sm">Every detail matters to us</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Discover our curated collections</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map(category => (
              <Card key={category.id} hover>
                <div
                  onClick={() => onNavigate('shop')}
                  className="cursor-pointer group overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center overflow-hidden">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Gift className="w-16 h-16 text-pink-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-pink-50 to-orange-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
              <p className="text-gray-600 text-lg">Our most loved items</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <Card key={product.id} hover>
                  <div 
                    className="cursor-pointer group"
                    onClick={() => onNavigate('shop')} // Click karne par Shop pe le jao
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden rounded-t-2xl">
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
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-2xl font-bold text-pink-600">₹{product.price}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button onClick={() => onNavigate('shop')}>
                View All Products
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 text-lg">Real reviews from real people</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map(testimonial => (
                <Card key={testimonial.id}>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.customer_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{testimonial.customer_name}</h4>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Something Special?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let us help you create the perfect gift for your loved ones
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate('customize')}
          >
            Start Customizing
          </Button>
        </div>
      </section>
    </div>
  );
              }
