import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.ts';
import { User } from '../types/index.ts';
import { FarmMap } from '../components/FarmMap.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import {
  MapPin,
  Search,
  ArrowRight,
  Phone,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const FarmersDirectoryPage: React.FC = () => {
  const [farmers, setFarmers] = useState<(User & {
    productCount?: number;
    availableProducts?: number;
    categories?: string[];
    sampleImages?: string[];
  })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | undefined>();

  useEffect(() => {
    async function loadFarmers() {
      setLoading(true);
      try {
        const res = await api.farmers.list({
          search: search.trim() || undefined,
          city: cityFilter || undefined
        });
        if (res.success) {
          setFarmers(res.data);
        }
      } catch (err) {
        console.error('Error fetching farmers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmers();
  }, [search, cityFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Verified Agricultural Directory
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 mt-1">
            Local Farmers & Orchards
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Connect directly with verified local growers. View their cultivation locations, farm practices, and in-season harvests.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search farmer or farm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-300 focus:outline-emerald-600 shadow-2xs"
            />
          </div>

          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-stone-300 bg-white text-stone-700 outline-none"
          >
            <option value="">All Regions</option>
            <option value="Pune">Pune & Haveli</option>
            <option value="Nashik">Nashik Belt</option>
            <option value="Ludhiana">Punjab</option>
            <option value="Bengaluru">Bengaluru Rural</option>
          </select>
        </div>
      </div>

      {/* Map Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-semibold text-stone-800">Pan-India Farm Coordinates</span>
          <span>Click on any pin to inspect farm details or center on listing</span>
        </div>
        <FarmMap
          farmers={farmers}
          selectedFarmerId={selectedFarmerId}
          onSelectFarmer={id => setSelectedFarmerId(id)}
          height="400px"
        />
      </div>

      {/* Farmers List Grid */}
      {loading ? (
        <LoadingSpinner message="Locating certified local growers..." />
      ) : farmers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <p className="text-stone-700 font-semibold text-base">No farmers found matching criteria.</p>
          <p className="text-xs text-stone-500">Try changing the region or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map(farmer => {
            const isSelected = farmer.id === selectedFarmerId;
            return (
              <div
                key={farmer.id}
                onClick={() => setSelectedFarmerId(farmer.id)}
                className={`bg-white rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-stone-200 hover:border-emerald-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={
                        farmer.profileImage ||
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={farmer.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-stone-900 text-base leading-tight truncate">
                        {farmer.farmLocation?.farmName || farmer.name}
                      </h3>
                      <p className="text-xs text-emerald-800 font-medium mt-0.5">
                        👨‍🌾 {farmer.name}
                      </p>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        {farmer.farmLocation?.city}, {farmer.farmLocation?.state}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 mt-3 leading-relaxed">
                    {farmer.farmLocation?.description || 'Authentic organic grower committed to regenerative cultivation.'}
                  </p>

                  {/* Metadata row */}
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      {farmer.farmLocation?.experienceYears || 5}+ years farming
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-emerald-700">
                      {farmer.availableProducts ?? farmer.productCount ?? 0} crops available
                    </span>
                    <span>·</span>
                    <span>
                      {farmer.farmLocation?.organicCertified ? 'Organic' : 'Direct Field'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                  <div className="text-xs text-stone-600 flex items-center gap-1 truncate">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{farmer.phone || '+91 98220 44551'}</span>
                  </div>

                  <Link
                    to={`/farmers/${farmer.id}`}
                    onClick={e => e.stopPropagation()}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>View Harvest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
