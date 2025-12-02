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

// Animated Butterfly Component
const Butterfly = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute opacity-40 pointer-events-none animate-float" style={style}>
    🦋
  </div>
);

// Animated Flower Component
const Flower = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute opacity-30 pointer-events-none animate-spin-slow" style={style}>
    🌸
  </div>
);

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [adminPage, setAdminPage] = useState('dashboard');
  const { user, loading } = useAuth();

  // Background Elements (Randomly positioned)
  const bgElements = [
    <Butterfly key="b1" style={{ top: '10%', left: '5%', animationDelay: '0s' }} />,
    <Flower key="f1" style={{ top: '15%', right: '10%', animationDuration: '10s' }} />,
    <Butterfly key="b2" style={{ bottom: '20%', left: '15%', animationDelay: '2s' }} />,
    <Flower key="f2" style={{ bottom: '10%', right: '5%', animationDuration: '12s' }} />,
    <Butterfly key="b3" style={{ top: '40%', right: '20%', animationDelay: '4s' }} />,
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff0f5] to-[#fff5e6] flex items-center justify-center relative overflow-hidden">
        {bgElements}
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-[#ff6b81] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-dancing text-xl">Loading Magic...</p>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fff0f5] via-[#fff5f7] to-[#fff5e6] font-sans text-gray-800 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {bgElements}
      </div>

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


