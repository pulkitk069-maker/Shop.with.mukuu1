import { useState, useEffect } from 'react';
import { Check, ChevronRight, Gift, Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
// Firebase Imports
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Product type definition
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  is_active: boolean;
}

const steps = ['Choose Theme', 'Select Items', 'Add Message', 'Contact Info'];

export function CustomizeBox() {
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    theme: '',
    selectedItems: [] as string[],
    customMessage: '',
    budgetRange: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const themes = [
    { id: 'birthday', name: 'Birthday Celebration', icon: '🎂' },
    { id: 'anniversary', name: 'Anniversary', icon: '💕' },
    { id: 'wedding', name: 'Wedding', icon: '💐' },
    { id: 'baby', name: 'Baby Shower', icon: '👶' },
    { id: 'corporate', name: 'Corporate Gift', icon: '💼' },
    { id: 'other', name: 'Other Occasion', icon: '🎁' },
  ];

  const budgetRanges = ['Under ₹1000', '₹1000 - ₹2000', '₹2000 - ₹5000', 'Above ₹5000'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Firebase se products lana
      const querySnapshot = await getDocs(collection(db, 'products'));
      const prodsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Sirf active products filter karna
      const activeProducts = prodsData.filter(p => p.is_active !== false);
      setProducts(activeProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(itemId)
        ? prev.selectedItems.filter(id => id !== itemId)
        : [...prev.selectedItems, itemId]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Firebase mein request save karna
      await addDoc(collection(db, 'custom_gift_boxes'), {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        selected_items: formData.selectedItems,
        box_theme: formData.theme,
        custom_message: formData.customMessage,
        budget_range: formData.budgetRange,
        status: 'pending',
        created_at: new Date().toISOString() // Zaroori hai sorting ke liye
      });

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Request Submitted!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for your custom gift box request. We'll contact you shortly to finalize the details.
          </p>
          <Button onClick={() => window.location.reload()}>
            Create Another Box
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Customize Your Gift Box</h1>
          <p className="text-gray-600 text-lg">Create a personalized gift in 4 easy steps</p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600 hidden sm:block">
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      index < currentStep ? 'bg-pink-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-8">
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-500" />
                Choose Your Theme
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setFormData({ ...formData, theme: theme.id })}
                    className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.theme === theme.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-4xl mb-3">{theme.icon}</div>
                    <div className="font-semibold text-gray-800">{theme.name}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {budgetRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => setFormData({ ...formData, budgetRange: range })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.budgetRange === range
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Gift className="w-6 h-6 text-pink-500" />
                Select Items for Your Box
              </h2>
              <p className="text-gray-600 mb-6">Choose products you'd like to include</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => toggleItem(product.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.selectedItems.includes(product.id)
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Gift className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                        <p className="text-pink-600 font-bold">₹{product.price}</p>
                      </div>
                      {formData.selectedItems.includes(product.id) && (
                        <Check className="w-5 h-5 text-pink-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-500" />
                Add Your Personal Message
              </h2>
              <textarea
                value={formData.customMessage}
                onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                placeholder="Write a heartfelt message for your loved one..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                This message will be included in your gift box
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Contact Information</h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              <div className="mt-8 p-6 bg-pink-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Theme:</strong> {themes.find(t => t.id === formData.theme)?.name}</p>
                  <p><strong>Budget:</strong> {formData.budgetRange}</p>
                  <p><strong>Items Selected:</strong> {formData.selectedItems.length} products</p>
                  <p><strong>Custom Message:</strong> {formData.customMessage ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.customerName || !formData.customerEmail || !formData.customerPhone}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !formData.theme) ||
                  (currentStep === 1 && formData.selectedItems.length === 0)
                }
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
                        }
