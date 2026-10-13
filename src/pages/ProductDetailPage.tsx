import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.ts';
import { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { FarmMap } from '../components/FarmMap.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import {
  ShoppingBag,
  Check,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  Phone,
  Store,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Truck
} from 'lucide-react';
import {
  checkProductDeliverability,
  getUserPincode,
  setUserPincode,
  POPULAR_PINCODES
} from '../utils/pincodeHelper.ts';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [checkPin, setCheckPin] = useState(user?.pincode || getUserPincode());
  const [activeCheckPin, setActiveCheckPin] = useState(user?.pincode || getUserPincode());

  useEffect(() => {
    const pin = user?.pincode || getUserPincode();
    setCheckPin(pin);
    setActiveCheckPin(pin);
  }, [user]);

  const delivery = product ? checkProductDeliverability(product, activeCheckPin) : null;

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.products.getById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.images[0] || '');

          // Fetch similar products in same category
          try {
            const simRes = await api.products.list({ category: res.data.category, limit: 5 });
            if (simRes.success && simRes.data) {
              setSimilarProducts(simRes.data.filter(p => p.id !== res.data.id).slice(0, 4));
            }
          } catch (e) {
            console.error('Error fetching similar products:', e);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Inspecting crop details and farm verification..." />;
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Produce Listing Not Found</h2>
        <p className="text-xs text-stone-500">This harvest listing may have completed or been removed.</p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (delivery && !delivery.isDeliverable) {
      setErrorMsg(`Delivery restricted for PIN ${activeCheckPin}: ${delivery.explanation}`);
      setTimeout(() => setErrorMsg(null), 4500);
      return;
    }

    const res = addToCart(product, quantity);
    if (res.success) {
      setAdded(true);
      setErrorMsg(null);
      setTimeout(() => setAdded(false), 2000);
    } else {
      setErrorMsg(res.message || 'Could not add to cart');
      setTimeout(() => setErrorMsg(null), 3500);
    }
  };

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to="/marketplace" className="hover:text-stone-900">Marketplace</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-700 font-medium">{product.category}</span>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="aspect-4/3 w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isOrganic && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-md text-xs font-bold text-emerald-800 shadow-sm">
                Certified Organic Crop
              </div>
            )}
          </div>

          {/* Thumbnail row */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-emerald-600 scale-102' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Purchase Form */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span>{product.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {product.location?.city || 'Local Farm'}, {product.location?.state || 'India'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900">₹{product.price}</span>
              <span className="text-sm text-stone-500 font-medium">per {product.unit}</span>
            </div>

            <div className="mt-2 text-xs">
              {isOutOfStock ? (
                <span className="text-rose-600 font-semibold">Out of Stock currently</span>
              ) : (
                <span className="text-emerald-700 font-semibold">
                  Available in Farm Inventory: {product.quantity} {product.unit}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
            {product.description}
          </p>

          {/* Harvest & Quality Metadata */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-stone-400 text-[11px]">Harvest Timeline</p>
              <p className="font-semibold text-stone-800 mt-0.5">
                {product.harvestDate || 'Fresh daily harvest'}
              </p>
            </div>
            <div>
              <p className="text-stone-400 text-[11px]">Farming Standard</p>
              <p className="font-semibold text-stone-800 mt-0.5">
                {product.isOrganic ? 'Zero-Chemical Organic' : 'Direct Field Harvest'}
              </p>
            </div>
          </div>

          {/* Area PIN Code Delivery Checker Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Check Delivery to Area PIN Code</span>
              </span>
              <span className="text-[11px] text-stone-500">
                Farm Origin PIN: <span className="font-semibold text-stone-700">{delivery?.farmPincode || '411014'}</span> ({product.location?.city || 'Pune'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={checkPin}
                  onChange={e => setCheckPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit PIN code"
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white focus:outline-emerald-600 tracking-wider text-stone-900"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (checkPin.length === 6) {
                    setActiveCheckPin(checkPin);
                    setUserPincode(checkPin);
                  }
                }}
                disabled={checkPin.length !== 6}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                Check PIN
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-stone-400 font-medium">Quick Check:</span>
              {POPULAR_PINCODES.slice(0, 4).map(p => (
                <button
                  key={p.pincode}
                  type="button"
                  onClick={() => {
                    setCheckPin(p.pincode);
                    setActiveCheckPin(p.pincode);
                    setUserPincode(p.pincode);
                  }}
                  className={`px-2 py-0.5 rounded-md border text-stone-600 cursor-pointer ${
                    activeCheckPin === p.pincode
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-stone-200 hover:border-emerald-400 bg-white'
                  }`}
                >
                  {p.city} ({p.pincode})
                </button>
              ))}
            </div>

            {/* Live Result Status */}
            {delivery && (
              <div
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  delivery.isDeliverable
                    ? delivery.deliveryType === 'hyperlocal'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : delivery.deliveryType === 'regional'
                      ? 'bg-sky-50 border-sky-200 text-sky-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>
                    {delivery.isDeliverable ? '✅ ' + delivery.badge : '⚠️ Delivery Restricted'}
                  </span>
                  <span>{delivery.isDeliverable ? `Delivery Fee: ₹${delivery.deliveryFee}` : 'Unavailable'}</span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  {delivery.explanation}
                </p>
                {delivery.isDeliverable && (
                  <p className="text-[10px] opacity-80 pt-0.5">
                    ⏱️ Transit Time: <span className="font-semibold">{delivery.estimatedHours}</span> · Direct from grower {product.farmerName}.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Purchase Action Box */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-stone-700">Quantity ({product.unit}):</span>
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-stone-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.quantity || isOutOfStock}
                  onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40 font-bold"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-stone-500">
                Item Total: <span className="font-bold text-stone-900 text-sm">₹{product.price * quantity}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                added
                  ? 'bg-emerald-700 text-white'
                  : isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added {quantity} {product.unit} to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Basket · ₹{product.price * quantity}</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Farmer Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Cultivated By
            </h4>
            <div className="flex items-center gap-3">
              <img
                src={
                  product.farmer?.profileImage ||
                  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'
                }
                alt={product.farmerName}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-stone-900 text-sm">{product.farmerName}</h5>
                <p className="text-xs text-stone-500">{product.location?.farmName}</p>
                {product.farmer?.phone && (
                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{product.farmer.phone}</span>
                  </p>
                )}
              </div>

              <Link
                to={`/farmers/${product.farmerId}`}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg shrink-0 transition-colors"
              >
                View Farm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section: Farm Location */}
      {product.location?.lat && product.location?.lng && (
        <section className="pt-6 border-t border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Farm Location & Proximity</h3>
              <p className="text-xs text-stone-500">
                Harvested at {product.location.farmName || product.farmerName}, {product.location.city}, {product.location.state}
              </p>
            </div>
          </div>

          <FarmMap
            farmers={[
              {
                id: product.farmerId,
                name: product.farmerName,
                email: '',
                role: 'farmer',
                phone: product.farmer?.phone || '',
                isActive: true,
                createdAt: '',
                farmLocation: {
                  farmName: product.location.farmName,
                  city: product.location.city,
                  state: product.location.state,
                  lat: product.location.lat,
                  lng: product.location.lng
                }
              }
            ]}
            selectedFarmerId={product.farmerId}
            height="320px"
            zoom={10}
            center={[product.location.lat, product.location.lng]}
          />
        </section>
      )}

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="pt-8 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                Similar {product.category} from Other Local Growers
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Fresh seasonal alternatives harvested directly in nearby agri belts
              </p>
            </div>
            <Link
              to={`/marketplace?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View All {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
