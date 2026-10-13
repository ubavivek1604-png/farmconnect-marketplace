import React, { useState, useEffect } from 'react';
import { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Plus, Check, ShoppingBag, MapPin, AlertCircle, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkProductDeliverability, getUserPincode } from '../utils/pincodeHelper.ts';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentPin, setCurrentPin] = useState(user?.pincode || getUserPincode());
  const delivery = checkProductDeliverability(product, currentPin);

  useEffect(() => {
    setCurrentPin(user?.pincode || getUserPincode());
    const onPinChange = (e: Event) => {
      const pin = (e as CustomEvent).detail || getUserPincode();
      setCurrentPin(pin);
    };
    window.addEventListener('farmconnect_pincode_changed', onPinChange);
    return () => window.removeEventListener('farmconnect_pincode_changed', onPinChange);
  }, [user]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!delivery.isDeliverable) {
      setErrorMsg(`Fresh produce restricted for PIN ${currentPin} (${delivery.distanceKm} km away)`);
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }

    const result = addToCart(product, 1);
    if (result.success) {
      setAdded(true);
      setErrorMsg(null);
      setTimeout(() => setAdded(false), 1600);
    } else {
      setErrorMsg(result.message || 'Could not add to cart');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const isLowStock = product.quantity > 0 && product.quantity < 10;
  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative">
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 block">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quiet editorial text overlays */}
        {product.isOrganic && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-emerald-800 shadow-xs">
            Organic Certified
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-xs font-semibold px-3 py-1 bg-rose-600 rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata: Category and Farm Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 truncate">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              {product.location?.city || 'Local Farm'}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-stone-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Farmer Attribution */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-1">
            Grown by <span className="text-stone-700 font-medium">{product.farmerName}</span>
          </p>

          {/* PIN Code Delivery Status Badge */}
          <div className="mt-2">
            {delivery.isDeliverable ? (
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                  delivery.deliveryType === 'hyperlocal'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : delivery.deliveryType === 'regional'
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
                title={delivery.explanation}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-pulse" />
                <span className="truncate">{delivery.badge}</span>
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                title={delivery.explanation}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span className="truncate">Restricted for PIN {currentPin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-stone-900">₹{product.price}</span>
              <span className="text-xs text-stone-500">/{product.unit}</span>
            </div>

            {/* Inventory Status */}
            <div className="text-[11px] mt-0.5">
              {isOutOfStock ? (
                <span className="text-rose-600 font-medium">Out of stock</span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-medium">Only {product.quantity} {product.unit} left</span>
              ) : (
                <span className="text-emerald-700">{product.quantity} {product.unit} available</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              added
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200'
            }`}
            title="Add to shopping cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-1 text-[11px] text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="truncate">{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
