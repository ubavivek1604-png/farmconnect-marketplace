import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Store,
  AlertCircle
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    totalAmount,
    groupedByFarmer
  } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Your Basket is Empty</h2>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          Browse verified local farms and fill your basket with vine-fresh tomatoes, organic pulses, and natural honey.
        </p>
        <div className="pt-2">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const freeDeliveryThreshold = 500;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Shopping Basket</h1>
          <p className="text-xs text-stone-500 mt-1">
            Items from {Object.keys(groupedByFarmer).length} local farm(s) ready for direct fulfillment.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cart items grouped by farmer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Delivery Bar */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {amountToFreeDelivery === 0 ? (
                  <span className="font-semibold text-emerald-800">
                    🎉 You qualify for FREE Direct Farm Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="font-semibold">₹{amountToFreeDelivery}</strong> more of fresh produce to get <strong className="font-semibold">FREE Delivery</strong>
                  </span>
                )}
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
              Threshold: ₹500
            </span>
          </div>

          {Object.entries(groupedByFarmer).map(([farmerId, group]) => (
            <div
              key={farmerId}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs"
            >
              {/* Farmer header */}
              <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-stone-900">{group.farmerName}</span>
                  {group.farmCity && (
                    <span className="text-stone-500">· {group.farmCity}</span>
                  )}
                </div>
                <span className="text-[11px] text-stone-400">
                  {group.items.length} item(s)
                </span>
              </div>

              {/* Items in this farm */}
              <div className="divide-y divide-stone-100 p-2">
                {group.items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 flex items-center gap-4 hover:bg-stone-50/50 rounded-xl transition-colors"
                  >
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80'}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100"
                    />

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${product.id}`}
                        className="font-semibold text-stone-900 text-sm hover:text-emerald-700 truncate block"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-stone-500 mt-0.5">
                        ₹{product.price} / {product.unit}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden shrink-0">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-stone-900 min-w-[28px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.quantity}
                        className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 font-bold disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right shrink-0 min-w-[70px]">
                      <p className="text-sm font-bold text-stone-900">
                        ₹{product.price * quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[11px] text-stone-400 hover:text-rose-600 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-2xs">
          <h3 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs text-stone-600">
            <div className="flex items-center justify-between">
              <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
              <span className="font-semibold text-stone-900">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>Direct Delivery</span>
                {deliveryFee === 0 && <span className="text-emerald-700 font-bold">(Free)</span>}
              </span>
              <span className="font-semibold text-stone-900">
                {deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between text-base font-bold text-stone-900">
              <span>Total Payable</span>
              <span className="text-xl text-emerald-800">₹{totalAmount}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Direct farmer remuneration (zero platform deductions)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Packed fresh by grower upon order acceptance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
