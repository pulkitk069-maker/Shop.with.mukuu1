import { Heart, Sparkles, Gift, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
              About shop.with.mukuu
            </span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Creating memorable gifting experiences with love and attention to every detail
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                shop.with.mukuu was born from a simple belief: every gift should tell a story and
                create a lasting memory. We started this journey with a passion for curating
                premium accessories and creating personalized gift experiences that bring joy to
                both the giver and the receiver.
              </p>
              <p>
                What sets us apart is our commitment to quality and personalization. Every product
                in our collection is carefully selected, and every gift box is thoughtfully
                assembled with love and attention to detail. We believe that the perfect gift is
                one that shows you truly understand and care about the recipient.
              </p>
              <p>
                From birthday celebrations to corporate gifting, from intimate anniversaries to
                grand weddings, we've had the privilege of being part of countless special moments.
                Each custom gift box we create is a labor of love, designed to exceed expectations
                and create unforgettable memories.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Crafted with Love</h3>
                  <p className="text-gray-600">
                    Every product and gift box is assembled with meticulous attention to detail
                    and genuine care.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Quality</h3>
                  <p className="text-gray-600">
                    We handpick every item in our collection to ensure the highest quality
                    standards.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Touch</h3>
                  <p className="text-gray-600">
                    Every gift can be customized to match your unique requirements and
                    preferences.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 rounded-3xl p-12 text-white text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto opacity-95">
            To create exceptional gifting experiences that celebrate life's special moments and
            strengthen the bonds between people. We strive to make every occasion memorable through
            carefully curated products and personalized service that exceeds expectations.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our top priority. We go above and beyond to ensure you're
                delighted with every purchase.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Unique Curation</h3>
              <p className="text-gray-600">
                Our collection features carefully selected products you won't find everywhere else.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Made with Love</h3>
              <p className="text-gray-600">
                Every aspect of our service is infused with care, passion, and attention to detail.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
