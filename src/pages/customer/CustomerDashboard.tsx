import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { api } from '../../services/api.ts';
import { Order } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { OrderStatusBadge } from '../../components/OrderStatusBadge.tsx';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  MapPin,
  Clock,
  Phone,
  Save,
  Check,
  CheckCircle2,
  Store,
  ArrowRight
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { cart, cartCount, totalAmount } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const res = await api.orders.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.auth.updateProfile({ name, phone, address });
      if (res.success && res.user) {
        updateUser(res.user);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      alert((err as Error).message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading customer account and order records..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Consumer Account
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track your farm orders, manage saved delivery addresses, and view direct farmer support contacts.
          </p>
        </div>

        {cartCount > 0 && (
          <Link
            to="/cart"
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>Active Basket: {cartCount} items (₹{totalAmount})</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Orders History with Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Your Farm Orders ({orders.length})</h2>
            <Link to="/marketplace" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              Browse More Produce →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <p className="font-semibold text-stone-800 text-sm">No orders placed yet.</p>
              <p className="text-xs text-stone-500">
                Explore local growers to have fresh crops harvested directly for your kitchen!
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-2xs"
                >
                  {/* Order Top Line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{order.orderNumber}</span>
                        <OrderStatusBadge status={order.orderStatus} />
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {order.paymentMethod}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-500">Total: </span>
                      <span className="text-base font-extrabold text-stone-900">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* 5-Step Status Progression Timeline */}
                  <div className="space-y-1.5 bg-stone-50/70 p-3.5 rounded-xl border border-stone-100">
                    <p className="text-[11px] font-bold text-stone-600">Order Progress</p>
                    <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                      {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                        const steps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
                        const isPast = steps.indexOf(order.orderStatus) >= idx;
                        const isCurrent = order.orderStatus === step;

                        return (
                          <div key={step} className="space-y-1 relative">
                            {isCurrent && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs animate-bounce">
                                🚜
                              </div>
                            )}
                            <div
                              className={`h-1.5 rounded-full ${
                                isPast ? 'bg-emerald-600' : 'bg-stone-200'
                              }`}
                            />
                            <span className={isCurrent ? 'font-bold text-emerald-800' : isPast ? 'text-stone-700' : 'text-stone-400'}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items Ordered */}
                  <div className="divide-y divide-stone-100 text-xs">
                    {order.items.map(item => (
                      <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-stone-900">{item.productName}</p>
                          <p className="text-[11px] text-stone-500">
                            👨‍🌾 {item.farmerName} ({item.farmCity || 'Local Farm'}) · {item.quantity} {item.unit} × ₹{item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-stone-900">₹{item.itemTotal}</p>
                          <span className="text-[10px] text-stone-500">{item.fulfillmentStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location */}
                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>
                      Delivered to: {order.deliveryAddress?.fullName}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.postalCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Profile & Saved Addresses */}
        <div className="space-y-6">
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs text-xs"
          >
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 pb-2 border-b border-stone-100">
              <UserIcon className="w-4 h-4 text-emerald-600" />
              <span>Customer Profile</span>
            </h3>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Email (Account Login)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Default Delivery Address</label>
              <textarea
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Flat / Apartment, Society, Locality, City, PIN"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>

            {savedSuccess && (
              <p className="text-center text-emerald-700 font-semibold text-[11px] flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Profile updated successfully!
              </p>
            )}
          </form>

          {/* Direct Farmer Support Info */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2 text-xs text-emerald-950">
            <h4 className="font-bold flex items-center gap-1.5 text-emerald-900">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Direct Farmer Transparency</span>
            </h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Every item in your order is fulfilled directly by the cultivator. If you have inquiries regarding harvest timing or organic practices, contact info is provided on each order record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
