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

// --- CUSTOM BACKGROUND PATTERN COMPONENT ---
const ButterflyPattern = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Base Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#fff0f5] via-[#ffe4e6] to-[#fff5e6]"></div>
    
    {/* Butterfly Texture Overlay */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
      <pattern id="butterfly-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {/* Butterfly Shape */}
        <path d="M14.5 12.5C14.5 9 17 6 20 6C23 6 25 8 25 11C25 14 23 16 20 16C17 16 14.5 12.5 14.5 12.5ZM14.5 12.5C14.5 16 12 19 9 19C6 19 4 17 4 14C4 11 6 9 9 9C12 9 14.5 12.5 14.5 12.5Z" 
              fill="#ec4899" transform="rotate(-15) translate(10,10) scale(1.5)" />
        {/* Flower Shape */}
        <path d="M55 55 Q60 50 65 55 Q70 60 65 65 Q60 70 55 65 Q50 70 45 65 Q40 60 45 55 Q50 50 55 55" 
              fill="#fb923c" transform="scale(0.8)" opacity="0.8"/>
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#butterfly-pattern)" />
    </svg>

    {/* Soft Overlay to blend everything */}
    <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
  </div>
);

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [adminPage, setAdminPage] = useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center relative">
        <ButterflyPattern />
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-[#ff6b81] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#ff6b81] font-dancing text-xl font-bold">Loading Magic...</p>
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
          return <AdminDashboard />;
        case 'products':
          return <AdminProducts />;
        case 'orders':
          return <AdminOrders />;
        case 'custom-boxes':
          return <AdminCustomBoxes />;
        default:
          return <AdminDashboard />;
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
    <div className="min-h-screen flex flex-col font-sans text-gray-800 relative">
      {/* Background is now a fixed layer behind everything */}
      <ButterflyPattern />

      {/* Main Content sits on top of the background */}
      <div className="z-10 flex flex-col min-h-screen">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
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


