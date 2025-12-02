import { useEffect, useState } from 'react';
import { Package, Eye, Check, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
// Firebase Imports
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

// Interfaces define kar rahe hain taaki TypeScript khush rahe
interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  order_items: OrderItem[];
  notes?: string;
  updated_at?: string;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Firebase se orders lana (Newest first)
      const ordersRef = collection(db, 'orders');
      // Note: Agar 'created_at' index nahi bana hoga to shayad console me warning aaye
      // Par abhi ke liye ye simple query chal jayegi
      const q = query(ordersRef, orderBy('created_at', 'desc'));
      
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
      // Fallback: Agar index error aaye to bina sorting ke load karo
      try {
        const snapshot = await getDocs(collection(db, 'orders'));
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      } catch (e) {
        console.error("Orders load failed completely");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      // Firebase update
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status, 
        updated_at: new Date().toISOString() 
      });
      
      loadOrders(); // List refresh karo
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status } as Order);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
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

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500">Orders will appear here when customers place them</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{order.customer_name}</h3>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span>Items: {order.order_items?.length || 0}</span>
                    <span className="font-bold text-pink-600">Total: ₹{order.total_amount}</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => viewOrder(order)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                      >
                        Ship Order
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                      >
                        Mark Delivered
                      </Button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Address:</strong> {selectedOrder.customer_address}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-pink-600">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.notes && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Order Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedOrder.notes}</p>
                </div>
              </div>
            )}

            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                <span className="text-2xl font-bold text-pink-600">₹{selectedOrder.total_amount}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Order Date: {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedOrder.status === status ? 'primary' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
