import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.ts';
import { Product } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { PincodeSelectorModal } from '../components/PincodeSelectorModal.tsx';
import {
  getUserPincode,
  getRegionFromPincode,
  checkProductDeliverability
} from '../utils/pincodeHelper.ts';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Filter,
  RotateCcw,
  MapPin,
  Truck
} from 'lucide-react';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Organic Produce'];

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Area PIN Code state
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState(getUserPincode());
  const [deliverableOnly, setDeliverableOnly] = useState(false);

  useEffect(() => {
    const onPinChange = (e: Event) => {
      const pin = (e as CustomEvent).detail || getUserPincode();
      setCurrentPin(pin);
    };
    window.addEventListener('farmconnect_pincode_changed', onPinChange);
    return () => window.removeEventListener('farmconnect_pincode_changed', onPinChange);
  }, []);

  // Filters
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'All');
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [city, setCity] = useState<string>(searchParams.get('city') || '');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [sort, setSort] = useState<string>('newest');

  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const deliverableProducts = products.filter(p => checkProductDeliverability(p, currentPin).isDeliverable);
  const displayedProducts = deliverableOnly ? deliverableProducts : products;

  useEffect(() => {
    // Sync URL params when arriving with query params
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const s = searchParams.get('search');
    if (s) setSearch(s);
    const c = searchParams.get('city');
    if (c) setCity(c);
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.products.list({
        category: category !== 'All' ? category : undefined,
        search: search.trim() || undefined,
        city: city || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        inStockOnly,
        sort,
        limit: 120
      });

      if (res.success) {
        setProducts(res.data);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      console.error('Failed to load marketplace products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, city, inStockOnly, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetFilters = () => {
    setCategory('All');
    setSearch('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(true);
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Direct Farm Marketplace
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 mt-1">
            Fresh Produce Catalog
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Browse genuine farm harvests sold directly by local growers at transparent rates in ₹.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search produce, farm, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-xl border border-stone-300 focus:outline-emerald-600 shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchProducts();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Area PIN Code Delivery & Availability Status Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-stone-500 text-[11px] font-medium block">Active Delivery Location</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-stone-900 text-sm">
                PIN {currentPin} · {getRegionFromPincode(currentPin).city}, {getRegionFromPincode(currentPin).state}
              </span>
              <button
                type="button"
                onClick={() => setPincodeModalOpen(true)}
                className="px-2.5 py-0.5 bg-white hover:bg-emerald-100/70 border border-emerald-300 rounded-lg text-emerald-800 font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Change PIN
              </button>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-stone-800 font-semibold cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-emerald-200/90 shadow-2xs self-start sm:self-auto">
          <input
            type="checkbox"
            checked={deliverableOnly}
            onChange={e => setDeliverableOnly(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded-xs accent-emerald-600 cursor-pointer"
          />
          <span>Deliverable to PIN {currentPin} only</span>
          <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
            {products.filter(p => checkProductDeliverability(p, currentPin).isDeliverable).length} available
          </span>
        </label>
      </div>

      {/* Interactive Category Tabs (Button controls with click handlers allowed per skill) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              const p = new URLSearchParams(searchParams);
              if (cat === 'All') p.delete('category');
              else p.set('category', cat);
              setSearchParams(p);
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block bg-white p-5 rounded-2xl border border-stone-200 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Region / City Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700">Farm Region</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none text-stone-800"
            >
              <option value="">All Regions</option>
              <option value="Pune">Pune & Haveli Belt</option>
              <option value="Nashik">Nashik Agri Valley</option>
              <option value="Ludhiana">Punjab Grains Region</option>
              <option value="Bengaluru">Bengaluru Rural</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-stone-200 bg-stone-50"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
            <button
              onClick={fetchProducts}
              className="w-full py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100"
            >
              Apply Price
            </button>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>In-stock inventory only</span>
            </label>
          </div>
        </div>

        {/* Products Results Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Count, Sort, Mobile Filter Button */}
          <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-stone-200">
            <div className="text-xs text-stone-600">
              Showing <span className="font-bold text-stone-900">{displayedProducts.length}</span> of {totalCount} items
              {deliverableOnly && (
                <span className="text-emerald-700 font-semibold ml-1.5">(Deliverable to PIN {currentPin})</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-stone-200 rounded-lg cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Filters</span>
              </button>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-transparent border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 outline-none cursor-pointer"
                >
                  <option value="newest">Newest Harvest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Product Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <LoadingSpinner message="Fetching field-fresh inventory..." />
          ) : displayedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
              <p className="text-stone-700 font-semibold text-base">
                {deliverableOnly
                  ? `No produce currently deliverable to PIN ${currentPin} with active filters.`
                  : 'No produce matched your filters.'}
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {deliverableOnly
                  ? 'Try unchecking the deliverable-only filter or changing your delivery PIN code.'
                  : 'Try widening your price range, searching for another crop, or choosing another category.'}
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-80 h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-bold text-stone-900">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-stone-200 bg-stone-50"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700">Farm Region</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full mt-1 p-2 text-xs rounded-xl border border-stone-200 bg-stone-50"
                >
                  <option value="">All Regions</option>
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Ludhiana">Ludhiana (Punjab)</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700">Price Range (₹)</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="p-2 text-xs border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="p-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>In-stock inventory only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <button
                onClick={() => {
                  fetchProducts();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-stone-600 rounded-xl text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Area PIN Code Selector Modal */}
      <PincodeSelectorModal
        isOpen={pincodeModalOpen}
        onClose={() => setPincodeModalOpen(false)}
      />
    </div>
  );
};
