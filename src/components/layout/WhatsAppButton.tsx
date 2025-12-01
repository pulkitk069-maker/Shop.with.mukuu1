import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/1234567890?text=Hi! I want to order from shop.with.mukuu', '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center gap-2 group"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden group-hover:inline-block max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 whitespace-nowrap">
        Order on WhatsApp
      </span>
    </button>
  );
}
