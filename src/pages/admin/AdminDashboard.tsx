import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { AdminAnalytics, User, Product, Order } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { OrderStatusBadge } from '../../components/OrderStatusBadge.tsx';
import {
  Users,
  ShieldCheck,
  ShoppingBag,
  Store,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Search,
  CheckCircle,
  Eye,
  Tractor
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'products' | 'orders'>('analytics');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [anaRes, usersRes, prodsRes, ordsRes] = await Promise.all([
        api.analytics.getAdmin(),
        api.admin.getUsers({ search: userSearch || undefined }),
        api.admin.getProducts({ search: productSearch || undefined }),
        api.admin.getOrders()
      ]);

      if (anaRes.success) setAnalytics(anaRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (prodsRes.success) setProducts(prodsRes.data);
      if (ordsRes.success) setOrders(ordsRes.data);
    } catch (err) {
      console.error('Failed to load admin console data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userSearch, productSearch]);

  const handleToggleUser = async (id: string) => {
    try {
      await api.admin.toggleUserStatus(id);
      loadData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleToggleProduct = async (id: string) => {
    try {
      await api.admin.toggleProductStatus(id);
      loadData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleResetSeeds = async () => {
    if (!window.confirm('Reset all databases (products, orders, users) back to sample initial state?')) {
      return;
    }
    try {
      await api.admin.resetSeed();
      alert('Database successfully refreshed to clean seed records.');
      loadData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading && !analytics) {
    return <LoadingSpinner message="Verifying administrator credentials and loading platform metrics..." />;
  }

  // Format category data for Recharts Pie
  const categoryChartData = analytics?.categoryDistribution
    ? Object.entries(analytics.categoryDistribution).map(([name, value]) => ({ name, value }))
    : [];

  const statusChartData = analytics?.ordersByStatus
    ? Object.entries(analytics.ordersByStatus).map(([name, value]) => ({ name, count: value }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Platform Oversight
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            FarmConnect Administration HQ
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Global catalog moderation, user account governance, and overall agricultural exchange health.
          </p>
        </div>

        <button
          onClick={handleResetSeeds}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
          <span>Reset Sample Seeds</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'users'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'products'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Crop Moderation ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>All Orders ({orders.length})</span>
        </button>
      </div>

      {/* 1. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Platform GMV Revenue</p>
              <p className="text-2xl font-extrabold text-stone-900">₹{analytics?.totalRevenue || 0}</p>
              <p className="text-[11px] text-emerald-700">Gross Merchandise Value</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Total Orders</p>
              <p className="text-2xl font-extrabold text-stone-900">{analytics?.totalOrders || 0}</p>
              <p className="text-[11px] text-stone-500">Processed across platform</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Verified Farmers</p>
              <p className="text-2xl font-extrabold text-stone-900">{analytics?.farmersCount || 0}</p>
              <p className="text-[11px] text-emerald-700">Active producers</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Registered Consumers</p>
              <p className="text-2xl font-extrabold text-stone-900">{analytics?.customersCount || 0}</p>
              <p className="text-[11px] text-stone-500">Direct buyers</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Active Harvest Listings</p>
              <p className="text-2xl font-extrabold text-stone-900">{analytics?.totalProducts || 0}</p>
              <p className="text-[11px] text-stone-500">Catalog items</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Orders by Fulfillment Status</h3>
                <p className="text-xs text-stone-500">Distribution of platform order states</p>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#78716c' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1c1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Produce Catalog by Category</h3>
                <p className="text-xs text-stone-500">Inventory share of distinct crop types</p>
              </div>

              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: { name?: string; percent?: number }) =>
                        `${name || ''} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`
                      }
                    >
                      {categoryChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1c1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-stone-900">User Management</h2>
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Contact / Phone</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{u.name}</p>
                            <p className="text-[11px] text-stone-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium capitalize">
                        {u.role === 'farmer' ? '👨‍🌾 Farmer' : u.role === 'admin' ? '🛡️ Admin' : '🛒 Customer'}
                      </td>
                      <td className="py-3 px-4">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold ${u.isActive ? 'text-emerald-700' : 'text-rose-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'admin' ? (
                          <button
                            onClick={() => handleToggleUser(u.id)}
                            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                              u.isActive
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        ) : (
                          <span className="text-stone-400 text-[11px]">Admin Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-stone-900">Listing Catalog Moderation</h2>
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Produce Item</th>
                    <th className="py-3 px-4 font-semibold">Farmer</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Price</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="font-bold text-stone-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{p.farmerName}</td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-stone-900">₹{p.price}/{p.unit}</td>
                      <td className="py-3 px-4">
                        <span className={p.quantity < 10 ? 'text-amber-700 font-bold' : ''}>
                          {p.quantity} {p.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold ${p.isAvailable ? 'text-emerald-700' : 'text-stone-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.isAvailable ? 'bg-emerald-600' : 'bg-stone-400'}`}></span>
                          {p.isAvailable ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleProduct(p.id)}
                          className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                            p.isAvailable
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.isAvailable ? 'Delist' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Platform Orders Log</h2>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Items</th>
                    <th className="py-3 px-4 font-semibold">Total Amount</th>
                    <th className="py-3 px-4 font-semibold">Payment</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-bold text-stone-900">{o.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-stone-800">{o.customerName}</p>
                        <p className="text-[11px] text-stone-400">{o.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">
                        {o.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-stone-900">₹{o.totalAmount}</td>
                      <td className="py-3 px-4">{o.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <OrderStatusBadge status={o.orderStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
