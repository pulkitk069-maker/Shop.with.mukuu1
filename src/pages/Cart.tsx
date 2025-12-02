import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useCart } from '../context/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      await addDoc(collection(db, 'orders'), {
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

      alert('Order placed successfully! We will contact you soon.');
      clearCart();
      setShowCheckout(false);
      setCustomerInfo({ name: '', email: '', phone: '', address: '', notes: '' });

      window.open(
        `https://wa.me/919876543210?text=Hi! I just placed an order on shop.with.mukuu. Order total: ₹${getTotalPrice()}`,
        '_blank'
      );
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- YE WALA PART FIXED HAI ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Start shopping and add items to your cart
          </p>
          {/* Yahan change kiya hai: Ab ye Home page par le jayega */}
          <Button onClick={() => window.location.href = '/'}>
            Start Shopping
          </Button>
        </Card>
      </div>
    );
  }
  // -----------------------------

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <Card key={item.id} className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-2xl font-bold text-pink-600 mb-4">₹{item.price}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-pink-600">₹{getTotalPrice()}</span>
                </div>
              </div>

              <Button
                className="w-full mb-4"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <button
                onClick={clearCart}
                className="w-full text-center text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Checkout"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            placeholder="Enter your full name"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            placeholder="your.email@example.com"
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address
            </label>
            <textarea
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              placeholder="Enter your complete delivery address"
              rows={3}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Notes (Optional)
            </label>
            <textarea
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
              placeholder="Any special instructions?"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Order Total: <span className="font-bold text-pink-600 text-xl">₹{getTotalPrice()}</span></p>
            <p className="text-xs text-gray-500">You'll be redirected to WhatsApp to complete your order</p>
          </div>

          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={isSubmitting || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address}
          >
            {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
