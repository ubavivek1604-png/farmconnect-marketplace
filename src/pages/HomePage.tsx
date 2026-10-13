import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.ts';
import { Product, User } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { FarmMap } from '../components/FarmMap.tsx';
import { IndianVillageHeroLandscape } from '../components/IndianVillageHeroLandscape.tsx';
import { ImpactStatsSection } from '../components/ImpactStatsSection.tsx';
import { VillageToHomeJourney } from '../components/VillageToHomeJourney.tsx';
import { FarmStorySection } from '../components/FarmStorySection.tsx';
import { VillageVibesSection } from '../components/VillageVibesSection.tsx';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Truck,
  Leaf,
  Store,
  Users
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    count: '28+ varieties · Palak, Methi, Aloo, Gajar, Lauki'
  },
  {
    name: 'Fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop&q=80',
    count: '35+ varieties · Apples, Mangoes, Pears, Melons'
  },
  {
    name: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    count: '14+ varieties · Basmati, Sharbati, Millets'
  },
  {
    name: 'Pulses',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80',
    count: '16+ varieties · Masoor, Chana, Rajma, Moong'
  },
  {
    name: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    count: 'Gir Cow A2 Milk & Cultured Ghee'
  },
  {
    name: 'Organic Produce',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    count: 'Wild Honey & Certified Organic Greens'
  }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, farmRes] = await Promise.all([
          api.products.list({ limit: 8, inStockOnly: true }),
          api.farmers.list()
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.data);
        if (farmRes.success) setFarmers(farmRes.data);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (query: string, category: string, city: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    navigate(`/marketplace?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Immersive Indian Village Hero Landscape & Tractor Animation */}
      <IndianVillageHeroLandscape onSearch={handleHeroSearch} />

      {/* 2. Agricultural Community Impact Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <ImpactStatsSection />
      </div>

      {/* 2. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Popular Farm Categories
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              Seasonal field crops, freshly milked dairy, and traditionally milled grains.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/marketplace?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-emerald-400 hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-square w-full overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-500 truncate mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Fresh Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              Direct From Field
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Featured Harvest This Week
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              Verified inventory with real-time stock levels and transparent farm origin.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-stone-200/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. The Village-to-Home Journey (24-Hour Farm-to-Fork Loop) */}
      <VillageToHomeJourney />

      {/* 5. Interactive Nearby Farmers Map & Profiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Location-Based Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Know Your Farmer. Discover Nearby Farms.
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Explore local growers with verified farm plots across India. Click any pin to inspect the farmer's credentials and in-stock crops.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Map Container */}
            <div className="lg:col-span-2">
              <FarmMap farmers={farmers} height="440px" />
            </div>

            {/* Farmer Highlights */}
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {farmers.map(farmer => (
                <div
                  key={farmer.id}
                  className="bg-emerald-900/60 border border-emerald-800/80 rounded-2xl p-4 hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        farmer.profileImage ||
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={farmer.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-emerald-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">
                        {farmer.farmLocation?.farmName || farmer.name}
                      </h4>
                      <p className="text-xs text-emerald-300 truncate">
                        👨‍🌾 {farmer.name} · {farmer.farmLocation?.city}, {farmer.farmLocation?.state}
                      </p>
                      <p className="text-[11px] text-stone-300 line-clamp-2 mt-1">
                        {farmer.farmLocation?.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-emerald-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-200">
                      {farmer.farmLocation?.organicCertified ? '✓ Organic Certified' : '✓ Direct Grower'}
                    </span>
                    <Link
                      to={`/farmers/${farmer.id}`}
                      className="text-xs font-semibold text-emerald-400 hover:text-white flex items-center gap-1"
                    >
                      <span>View Farm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Farm Traditions & Heritage Stories */}
      <FarmStorySection />

      {/* 7. Village Roots & Farm Life Vibe */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VillageVibesSection />
      </div>

      {/* 6. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Transparent Supply Chain
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            How FarmConnect Operates
          </h2>
          <p className="text-stone-500 text-sm">
            A frictionless platform built for Indian growers to list produce and urban consumers to receive genuine farm quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
              01
            </div>
            <h3 className="font-bold text-stone-900 text-base">Farmers List Daily Harvest</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Growers input harvest quantities, determine their own fair prices in ₹, set farm location coordinates, and upload verified crop pictures.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
              02
            </div>
            <h3 className="font-bold text-stone-900 text-base">Customers Order Direct</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Consumers explore nearby farms, add items from multiple local growers into a single consolidated cart, and pick Cash on Delivery or UPI.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
              03
            </div>
            <h3 className="font-bold text-stone-900 text-base">Direct Farm Packing & Delivery</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Farmers pack orders on-site, status updates are tracked in real-time, and 100% of the produce price goes directly to the grower.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-base">Fair Farmer Earnings</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Middlemen take up to 45% of value in conventional Mandi markets. FarmConnect returns direct pricing power to the cultivator.
              </p>
            </div>

            <div className="space-y-2">
              <Leaf className="w-8 h-8 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-base">Chemical-Free Freshness</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Crops aren't sitting in artificial cold storages for weeks. You receive produce harvested within 24 to 48 hours.
              </p>
            </div>

            <div className="space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-base">Transparent Origins</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Know exactly who nurtured your grain and where your cow grazed. Complete traceability through interactive map pins.
              </p>
            </div>

            <div className="space-y-2">
              <Truck className="w-8 h-8 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-base">Multi-Farmer Cart</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Order Nashik onions, Pune tomatoes, and Punjab Basmati rice in a single checkout with individual farm fulfillment tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sample Testimonials (Accurately labeled) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs text-stone-400 uppercase tracking-wider">
            Verified Sample Testimonials
          </span>
          <h2 className="text-2xl font-bold text-stone-900">Voices From Our Community</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              “For the first time in 18 years of farming, I am able to sell my tomatoes at ₹30/kg directly to Pune families instead of being forced to dump crates at ₹8/kg in the wholesale yard.”
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80"
                alt="Ramesh Patil"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-stone-900">Ramesh Patil</p>
                <p className="text-[10px] text-stone-500">Farmer, Shivshambhu Agro (Pune)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              “The fragrance of Harpreet's 1121 Basmati Rice and Sunita's Nashik onions is completely different from wax-coated supermarket stock. Knowing the actual farmer gives immense peace of mind.”
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Priya Sharma"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-stone-900">Priya Sharma</p>
                <p className="text-[10px] text-stone-500">Customer, Kothrud, Pune</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <p className="text-xs text-stone-600 italic leading-relaxed">
              “The dashboard allows me to track all my orders, adjust inventory when harvested, and see exactly when customers receive my Desi Gir cow A2 milk.”
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                alt="Anand Devadiga"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-stone-900">Anand Devadiga</p>
                <p className="text-[10px] text-stone-500">Farmer, Cauvery River Dairy (Bengaluru)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Support Local Agriculture?
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Join hundreds of families buying directly from growers or sign up as a farmer to take control of your pricing.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/marketplace"
              className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors"
            >
              Start Shopping Now
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors"
            >
              Register As A Farmer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
