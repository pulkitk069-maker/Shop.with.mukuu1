import { useEffect, useState } from 'react';
import { Package, Calendar, MapPin, ChevronDown, ChevronUp, ShoppingBag, LogOut } from 'lucide-react'; // LogOut icon import kiya
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_address: string;
  order_items: OrderItem[];
  order_code?: string;
}

export function MyOrders({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { user, signOut } = useAuth(); // signOut function yahan se liya

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('user_id', '==', user?.uid),
        orderBy('created_at', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
      // Fallback if index is missing
      try {
        const q2 = query(collection(db, 'orders'), where('user_id', '==', user?.uid));
        const snapshot = await getDocs(q2);
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
        ordersData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(ordersData);
      } catch (e) {
        console.error("Fallback failed", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate('home'); // Logout ke baad Home par bhejo
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading your orders...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <Button onClick={() => onNavigate('login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            {user.displayName && <p className="text-gray-600">Welcome, {user.displayName}</p>}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onNavigate('shop')}>
              Continue Shopping
            </Button>
            {/* NEW SIGN OUT BUTTON */}
            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:bg-red-50 border-red-200">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Button onClick={() => onNavigate('shop')}>Start Shopping</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <Package className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">
                            Order #{order.order_code || order.id.slice(0, 6).toUpperCase()}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                          <span>{order.order_items.length} Items</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <span className="text-xl font-bold text-gray-800">₹{order.total_amount}</span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.order_items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {item.quantity}x {item.product_name}
                              </span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Delivery Details</h4>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{order.customer_address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
                 }
