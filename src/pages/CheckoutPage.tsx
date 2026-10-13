import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryFee, totalAmount, clearCart, groupedByFarmer } = useCart();
  const { user, loginWithDemoAccount } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || 'Priya Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [street, setStreet] = useState(user?.address || 'Flat 402, Green Meadows, Kothrud');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('411038');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI / NetBanking (Test Mode)'>('Cash on Delivery');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Your basket is empty</h2>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If user is not authenticated, prompt quick customer login
    if (!user) {
      try {
        await loginWithDemoAccount('customer');
      } catch {
        setError('Please sign in or use quick demo account before completing checkout.');
        return;
      }
    }

    if (!fullName || !phone || !street || !city || !postalCode) {
      setError('Please fill in all delivery details.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: cart.map(i => ({
          productId: i.product.id,
          quantity: i.quantity
        })),
        deliveryAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          postalCode,
          notes
        },
        paymentMethod
      };

      const res = await api.orders.create(payload);

      if (res.success && res.data) {
        clearCart();
        navigate(`/order-success/${res.data.orderNumber}`, { state: { order: res.data } });
      } else {
        setError(res.message || 'Failed to place order.');
      }
    } catch (err) {
      setError((err as Error).message || 'Server error during order processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Direct Farm Checkout</h1>
        <p className="text-xs text-stone-500 mt-1">
          Review your delivery coordinates and place order directly with {Object.keys(groupedByFarmer).length} local farm(s).
        </p>
      </div>

      {!user && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900">
            <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Checking out as Guest? You can 1-click log in as demo customer Priya Sharma for full order tracking.
            </span>
          </div>
          <button
            type="button"
            onClick={() => loginWithDemoAccount('customer')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shrink-0"
          >
            Sign in as Demo Customer
          </button>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Address & Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Coordinates Form */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              1. Delivery Coordinates & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Mobile Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Street Address / Apartment</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="Flat No, Building Name, Society, Locality"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">City / Town</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Postal PIN Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  placeholder="411038"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Delivery Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Leave with security guard"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              2. Payment Selection
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-0.5 text-emerald-600"
                />
                <div className="text-xs">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span>Cash on Delivery (Recommended for local produce)</span>
                  </div>
                  <p className="text-stone-500 mt-1">
                    Pay the farmer directly in cash upon receiving and inspecting your fresh produce.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI / NetBanking (Test Mode)'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI / NetBanking (Test Mode)'}
                  onChange={() => setPaymentMethod('UPI / NetBanking (Test Mode)')}
                  className="mt-0.5 text-emerald-600"
                />
                <div className="text-xs">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-700" />
                    <span>UPI / NetBanking (Hackathon Test Mode)</span>
                  </div>
                  <p className="text-stone-500 mt-1">
                    Simulates instant server-side UPI verification without storing real card credentials.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Confirmation */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-2xs">
          <h3 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
            Order Review
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-900 truncate">{product.name}</p>
                  <p className="text-[11px] text-stone-500">
                    {quantity} {product.unit} × ₹{product.price} · {product.farmerName}
                  </p>
                </div>
                <span className="font-bold text-stone-900 shrink-0">
                  ₹{product.price * quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-stone-900">
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline text-base font-bold text-stone-900">
              <span>Final Total</span>
              <span className="text-xl text-emerald-800">₹{totalAmount}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Processing order with farmers...</span>
            ) : (
              <>
                <span>Place Order · ₹{totalAmount}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-stone-500 text-center">
            By placing this order, you support local growers with 100% direct remuneration.
          </p>
        </div>
      </form>
    </div>
  );
};
