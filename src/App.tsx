import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { CustomizeBox } from './pages/CustomizeBox';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomBoxes } from './pages/admin/AdminCustomBoxes';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [adminPage, setAdminPage] = useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'admin') {
    if (!user) {
      return <AdminLogin />;
    }

    const renderAdminPage = () => {
      switch (adminPage) {
        case 'dashboard':
          // UPDATE: Yahan humne 'onNavigate' pass kiya hai
          return <AdminDashboard onNavigate={setAdminPage} />;
        case 'products':
          return <AdminProducts />;
        case 'orders':
          return <AdminOrders />;
        case 'custom-boxes':
          return <AdminCustomBoxes />;
        default:
          return <AdminDashboard onNavigate={setAdminPage} />;
      }
    };

    return (
      <AdminLayout currentPage={adminPage} onNavigate={setAdminPage}>
        {renderAdminPage()}
      </AdminLayout>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'shop':
        return <Shop />;
      case 'customize':
        return <CustomizeBox />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'cart':
        return <Cart />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    // Clean, Fast, and Beautiful Pastel Gradient
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fff0f5] via-[#fff5f7] to-[#fff5e6] font-sans text-gray-800 selection:bg-pink-100">
      
      <div className="flex flex-col min-h-screen">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        
        {/* Added smooth fade-in animation for page transitions */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          {renderPage()}
        </main>
        
        <Footer />
      </div>
      
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
