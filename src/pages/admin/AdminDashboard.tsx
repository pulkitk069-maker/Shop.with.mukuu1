import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Gift } from 'lucide-react';
import { Card } from '../../components/ui/Card';
// Firebase Imports
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    customBoxRequests: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // 1. Products Fetch Karna
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const totalProducts = productsSnapshot.size;

      // 2. Orders Fetch Karna (Total Orders & Revenue)
      let totalOrders = 0;
      let totalRevenue = 0;
      let pendingOrders = 0;

      // Note: Try-catch block taaki agar 'orders' collection na ho to crash na kare
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        totalOrders = ordersSnapshot.size;

        // Revenue Calculation
        ordersSnapshot.docs.forEach(doc => {
          const data = doc.data();
          // Total Revenue jodna (Ensure number format)
          if (data.total_amount) {
            totalRevenue += Number(data.total_amount);
          }
          // Pending orders ginnna
          if (data.status === 'pending') {
            pendingOrders++;
          }
        });
      } catch (e) {
        console.log("Orders collection abhi nahi bana hai (New Store)");
      }

      // 3. Custom Box Requests Fetch Karna
      let customBoxRequests = 0;
      try {
        const customBoxesSnapshot = await getDocs(collection(db, 'custom_gift_boxes'));
        customBoxRequests = customBoxesSnapshot.size;
      } catch (e) {
        console.log("Custom Boxes collection abhi nahi bana hai");
      }

      // State Update Karna
      setStats({
        totalProducts,
        totalOrders,
        pendingOrders, // Loop se count kiya hua
        totalRevenue,
        customBoxRequests,
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
    },
    {
      title: 'Custom Box Requests',
      value: stats.customBoxRequests,
      icon: Gift,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your store overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Active Products</span>
              <span className="font-bold text-gray-800">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Completed Orders</span>
              <span className="font-bold text-gray-800">{stats.totalOrders - stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-bold text-gray-800">
                ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">New orders received</p>
                <p className="text-xs text-gray-500">{stats.pendingOrders} pending orders</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Custom box requests</p>
                <p className="text-xs text-gray-500">{stats.customBoxRequests} total requests</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Product inventory</p>
                <p className="text-xs text-gray-500">{stats.totalProducts} products listed</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
