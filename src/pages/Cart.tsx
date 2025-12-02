 import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useCart } from '../context/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext'; // User info ke liye

// Navigation prop add kiya
interface CartProps {
  onNavigate?: (page: string) => void;
}

export function Cart({ onNavigate }: CartProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth(); // Current User nikal rahe hain
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  // Agar user login hai, to uska naam aur email pehle se bhar do
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      // 1. UNIQUE ORDER CODE GENERATE KARNA (Example: #MK-4821)
      const orderCode = 'MK-' + Math.floor(1000 + Math.random() * 9000);

      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      // 2. Firebase mein save karna (User ID aur Order Code ke saath)
      await addDoc(collection(db, 'orders'), {
        user_id: user?.uid || 'guest', // Agar login hai to ID, nahi to guest
        order_code: orderCode,         // Ye hai wo chhota code
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        order_items: orderItems,
        total_amount: getTotalPrice(),
        notes: customerInfo.notes,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      // 3. Success Message with Order ID
      alert(`Order Placed Successfully! 🎉\nYour Order ID is: #${orderCode}\nSave this for tracking.`);
      
      clearCart();
      setShowCheckout(false);
      setCustomerInfo({ name: '', email: '', phone: '', address: '', notes: '' });

      // 4. WhatsApp Message mein bhi Code bhejenge
      const message = `Hi! I just placed order #${orderCode} on shop.with.mukuu.\nTotal Amount: ₹${getTotalPrice()}`;
      window.open(
        `https://wa.me/919876543210?text=${encodeURIComponent(message)}`,
        '_blank'
      );

      // Agar login hai, to My Orders par bhej do
      if (user && onNavigate) {
        onNavigate('my-orders');
      }

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Start shopping and add items to your cart
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Start Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <Card key={item.id} className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-gray-300" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-2xl font-bold text-pink-600 mb-4">₹{item.price}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{getTotalPrice()}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600">Free</span></div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-800"><span>Total</span><span className="text-pink-600">₹{getTotalPrice()}</span></div>
              </div>
              
              <Button className="w-full mb-4" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button onClick={clearCart} className="w-full text-center text-red-600 hover:text-red-700 font-medium">Clear Cart</button>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal isOpen={showCheckout} onClose={() => setShowCheckout(false)} title="Checkout" size="lg">
        {/* Step: Agar login nahi hai to login karne ko bolo */}
        {!user ? (
          <div className="text-center py-6">
            <div className="bg-pink-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Please Login to Order</h3>
            <p className="text-gray-600 mb-6">Log in to track your order history and get faster checkout.</p>
            
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => onNavigate && onNavigate('login')}
              >
                Login / Create Account
              </Button>
              <p className="text-sm text-gray-500">or</p>
              {/* Agar fir bhi guest checkout karna chahe to ye form dikha sakte hain (Optional) */}
              <button 
                onClick={() => { /* Guest logic needs state change here, but for now redirecting to login is safer */ }}
                className="text-gray-500 underline text-sm hover:text-gray-700"
              >
                Guest checkout is currently disabled for better tracking
              </button>
            </div>
          </div>
        ) : (
          /* Agar Login hai, to Form dikhao */
          <div className="space-y-4">
            <Input label="Full Name" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} placeholder="Enter your full name" required />
            <Input label="Email Address" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} placeholder="your.email@example.com" required />
            <Input label="Phone Number" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
              <textarea value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} placeholder="Enter your complete delivery address" rows={3} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none resize-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
              <textarea value={customerInfo.notes} onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })} placeholder="Any special instructions?" rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none resize-none" />
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Order Total: <span className="font-bold text-pink-600 text-xl">₹{getTotalPrice()}</span></p>
              <p className="text-xs text-gray-500">You'll be redirected to WhatsApp to complete your order</p>
            </div>

            <Button className="w-full" onClick={handleCheckout} disabled={isSubmitting || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address}>
              {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
                          }
