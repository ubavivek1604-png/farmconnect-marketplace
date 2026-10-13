import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.ts';
import { User, Product } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { FarmMap } from '../components/FarmMap.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ArrowLeft,
  Store,
  ShieldCheck,
  Award
} from 'lucide-react';

export const FarmerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [farmer, setFarmer] = useState<(User & { productsCount?: number }) | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarmerProfile() {
      if (!id) return;
      setLoading(true);
      try {
        const [farmerRes, prodRes] = await Promise.all([
          api.farmers.getById(id),
          api.farmers.getProducts(id)
        ]);

        if (farmerRes.success && farmerRes.data) {
          setFarmer(farmerRes.data);
        }
        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Error fetching farmer profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmerProfile();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Connecting with local farm..." />;
  }

  if (!farmer) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Farmer Profile Not Found</h2>
        <Link
          to="/farmers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Farmers</span>
        </Link>
      </div>
    );
  }

  const farmLoc = farmer.farmLocation;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/farmers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Local Farmers Directory</span>
        </Link>
      </div>

      {/* Farm Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="h-44 bg-gradient-to-r from-emerald-800 to-emerald-950 relative">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="px-6 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-12 mb-6">
            <div className="flex items-end gap-4">
              <img
                src={
                  farmer.profileImage ||
                  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
                }
                alt={farmer.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="pb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {farmLoc?.farmName || `${farmer.name}'s Farm`}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-800 font-semibold">
                  👨‍🌾 Head Cultivator: {farmer.name}
                </p>
              </div>
            </div>

            {farmLoc?.organicCertified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Certified Organic Grower</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-stone-100">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Farm Story & Practices
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {farmLoc?.description || 'Authentic organic grower committed to regenerative cultivation and zero-middlemen direct consumer supply.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <p className="text-stone-400 text-[11px]">Experience</p>
                  <p className="font-bold text-stone-800 mt-0.5">{farmLoc?.experienceYears || 10}+ Years</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <p className="text-stone-400 text-[11px]">Current Harvests</p>
                  <p className="font-bold text-stone-800 mt-0.5">{products.length} Crops</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <p className="text-stone-400 text-[11px]">Region</p>
                  <p className="font-bold text-stone-800 mt-0.5">{farmLoc?.city}, {farmLoc?.state}</p>
                </div>
              </div>
            </div>

            {/* Farm Contact & Coordinates */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <h4 className="font-bold text-stone-900 text-xs">Farm Contact & Verification</h4>
              <div className="space-y-2 text-stone-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{farmer.phone || '+91 98220 44551'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{farmer.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{farmLoc?.address || farmer.address || 'Farm Belt, Rural Sector'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {farmLoc?.lat && farmLoc?.lng && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-stone-900">Farm Location Coordinates</h3>
          <FarmMap
            farmers={[farmer]}
            selectedFarmerId={farmer.id}
            height="300px"
            zoom={11}
            center={[farmLoc.lat, farmLoc.lng]}
          />
        </div>
      )}

      {/* Farm Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900">
              Fresh Harvest from {farmLoc?.farmName || farmer.name}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Order directly from this farm. Harvested upon order confirmation.
            </p>
          </div>
          <span className="text-xs text-stone-600 font-medium">
            {products.length} crops listed
          </span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
            No crops are actively listed for this farm currently. Check back soon for the next harvest!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
