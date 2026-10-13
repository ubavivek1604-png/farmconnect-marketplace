import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Product, Order, FarmerAnalytics, ProductCategory, ProductUnit } from '../../types/index.ts';
import { LoadingSpinner } from '../../components/LoadingSpinner.tsx';
import { OrderStatusBadge } from '../../components/OrderStatusBadge.tsx';
import { LocationPickerMap } from '../../components/LocationPickerMap.tsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  X,
  Phone,
  Save,
  Check
} from 'lucide-react';

const CATEGORIES: ProductCategory[] = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Organic Produce'];
const UNITS: ProductUnit[] = ['kg', 'dozen', 'litre', 'piece', 'bunch', 'quintal'];

export const FarmerDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'profile'>('overview');

  const [analytics, setAnalytics] = useState<FarmerAnalytics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<{ order: Order; farmerItems: any[] }[]>([]);
  const [loading, setLoading] = useState(true);

  // Product modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: ProductCategory;
    price: number;
    unit: ProductUnit;
    quantity: number;
    images: string[];
    isOrganic: boolean;
    harvestDate: string;
  }>({
    name: '',
    description: '',
    category: 'Vegetables',
    price: 30,
    unit: 'kg',
    quantity: 50,
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'],
    isOrganic: true,
    harvestDate: 'Freshly harvested today'
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Profile state
  const [farmName, setFarmName] = useState(user?.farmLocation?.farmName || '');
  const [farmBio, setFarmBio] = useState(user?.farmLocation?.description || '');
  const [farmPhone, setFarmPhone] = useState(user?.phone || '');
  const [farmCity, setFarmCity] = useState(user?.farmLocation?.city || 'Pune');
  const [farmAddress, setFarmAddress] = useState(user?.farmLocation?.address || '');
  const [farmCoords, setFarmCoords] = useState<{ lat: number; lng: number }>({
    lat: user?.farmLocation?.lat || 18.5204,
    lng: user?.farmLocation?.lng || 73.8567
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [analyticsRes, ordersRes, productsRes] = await Promise.all([
        api.analytics.getFarmer(),
        api.orders.getMyOrders(),
        api.farmers.getProducts(user.id)
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (productsRes.success) setProducts(productsRes.data);
    } catch (e) {
      console.error('Failed to load farmer dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Product Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Vegetables',
      price: 35,
      unit: 'kg',
      quantity: 50,
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'],
      isOrganic: true,
      harvestDate: 'Harvested today at dawn'
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      unit: p.unit,
      quantity: p.quantity,
      images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'],
      isOrganic: p.isOrganic,
      harvestDate: p.harvestDate || 'Fresh crop'
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formData.price < 0 || formData.quantity < 0) {
      setFormError('Price and quantity must be non-negative values.');
      return;
    }

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, formData);
      } else {
        await api.products.create(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setFormError((err as Error).message || 'Failed to save crop');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your active farm catalog?`)) {
      return;
    }
    try {
      await api.products.delete(id);
      loadData();
    } catch (err) {
      alert((err as Error).message || 'Could not delete product');
    }
  };

  const handleUpdateItemStatus = async (orderId: string, status: any) => {
    try {
      await api.orders.updateStatus(orderId, status);
      loadData();
    } catch (err) {
      alert((err as Error).message || 'Failed to update order status');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.auth.updateProfile({
        phone: farmPhone,
        address: farmAddress,
        farmLocation: {
          farmName,
          description: farmBio,
          city: farmCity,
          address: farmAddress,
          lat: farmCoords.lat,
          lng: farmCoords.lng
        }
      });
      if (res.success && res.user) {
        updateUser(res.user);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } catch (err) {
      alert((err as Error).message || 'Failed to save farm profile');
    }
  };

  if (loading && !analytics) {
    return <LoadingSpinner message="Loading farmer console and real-time inventory..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
            alt=""
            className="w-14 h-14 rounded-2xl object-cover border border-emerald-200"
          />
          <div>
            <div className="text-xs font-semibold text-emerald-700">Verified Cultivator Portal</div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              {user?.farmLocation?.farmName || user?.name}
            </h1>
            <p className="text-xs text-stone-500">
              📍 {user?.farmLocation?.city}, {user?.farmLocation?.state || 'Maharashtra'} · Direct Farm Sales
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Harvest</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'products'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Crops & Inventory ({products.length})</span>
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
          <span>Fulfillment Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Farm Profile & Map Coordinates</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Total Revenue Earned</p>
              <p className="text-2xl font-extrabold text-stone-900">₹{analytics?.totalRevenue || 0}</p>
              <p className="text-[11px] text-emerald-700 font-medium">100% direct remuneration</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Orders Received</p>
              <p className="text-2xl font-extrabold text-stone-900">{analytics?.totalOrders || 0}</p>
              <p className="text-[11px] text-stone-500">Across local consumers</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Active Harvest Listings</p>
              <p className="text-2xl font-extrabold text-stone-900">{analytics?.totalProducts || 0}</p>
              <p className="text-[11px] text-stone-500">{analytics?.availableInventory || 0} total units in stock</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <p className="text-xs text-stone-500 font-medium">Low-Stock Warnings</p>
              <p className={`text-2xl font-extrabold ${(analytics?.lowStockProducts?.length || 0) > 0 ? 'text-amber-600' : 'text-stone-900'}`}>
                {analytics?.lowStockProducts?.length || 0}
              </p>
              <p className="text-[11px] text-stone-500">Inventory &lt; 10 units</p>
            </div>
          </div>

          {/* Low Stock Warning Box */}
          {(analytics?.lowStockProducts?.length || 0) > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Low Inventory Alert</span>
              </div>
              <p className="text-[11px] text-amber-800">
                The following crops have low stock remaining in farm storage. Replenish inventory after the next harvest:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {analytics?.lowStockProducts.map(p => (
                  <span key={p.id} className="bg-white px-2.5 py-1 rounded-lg border border-amber-300 font-medium text-amber-900 text-xs">
                    {p.name}: <strong>{p.quantity} {p.unit}</strong> left
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Revenue Performance</h3>
                <p className="text-xs text-stone-500">Calculated from verified customer orders</p>
              </div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Direct Sales</span>
              </div>
            </div>

            <div className="h-64 w-full">
              {analytics?.chartData && analytics.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="farmRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#78716c' }} />
                    <Tooltip
                      formatter={(val: any) => [`₹${val}`, 'Daily Revenue']}
                      contentStyle={{ backgroundColor: '#1c1917', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#farmRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-stone-400">
                  Revenue graph will update once new customer orders are placed.
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">Recent Incoming Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View All Orders →
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No orders received yet. Active crops are discoverable in the marketplace!
              </div>
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {orders.slice(0, 4).map(({ order, farmerItems }) => (
                  <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-stone-900">{order.orderNumber}</p>
                      <p className="text-stone-500 text-[11px]">
                        Customer: {order.customerName} · {farmerItems.map(i => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-stone-900">
                        ₹{farmerItems.reduce((acc, i) => acc + i.itemTotal, 0)}
                      </span>
                      <OrderStatusBadge status={farmerItems[0]?.fulfillmentStatus || order.orderStatus} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Crop Catalog Management</h2>
              <p className="text-xs text-stone-500">Add, adjust prices, edit descriptions, or mark items sold out.</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Harvest Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/9 w-full overflow-hidden bg-stone-100 relative">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {product.isOrganic && (
                      <span className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800">
                        Organic
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>{product.category}</span>
                      <span className="font-semibold text-emerald-700">
                        {product.quantity} {product.unit} in stock
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2">{product.description}</p>

                    <div className="pt-2 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-stone-900">₹{product.price}</span>
                      <span className="text-xs text-stone-500">/{product.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="flex-1 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-stone-800 flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-semibold text-rose-700 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Farmer Order Fulfillment</h2>
            <p className="text-xs text-stone-500">
              Manage fulfillment for items ordered from your farm. Once you pack and dispatch, update statuses to keep customers informed.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              No orders have been placed for your farm yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(({ order, farmerItems }) => (
                <div key={order.id} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{order.orderNumber}</span>
                        <OrderStatusBadge status={farmerItems[0]?.fulfillmentStatus || order.orderStatus} />
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · Payment: {order.paymentMethod}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-stone-500">Your Farm Total</p>
                      <p className="text-base font-extrabold text-stone-900">
                        ₹{farmerItems.reduce((acc, i) => acc + i.itemTotal, 0)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Delivery Information */}
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-stone-400 text-[11px]">Customer & Contact</p>
                      <p className="font-semibold text-stone-800 mt-0.5">{order.customerName}</p>
                      <p className="text-stone-600">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-stone-400 text-[11px]">Direct Destination</p>
                      <p className="text-stone-700 mt-0.5">
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* Items for this farmer */}
                  <div className="divide-y divide-stone-100 text-xs">
                    {farmerItems.map(item => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-stone-900">{item.productName}</p>
                          <p className="text-stone-500">
                            {item.quantity} {item.unit} × ₹{item.price} = ₹{item.itemTotal}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700">
                          Status: {item.fulfillmentStatus}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fulfillment Action Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-stone-500 font-semibold mr-1">Update Status:</span>

                    <button
                      onClick={() => handleUpdateItemStatus(order.id, 'Confirmed')}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-semibold"
                    >
                      Confirm Order
                    </button>

                    <button
                      onClick={() => handleUpdateItemStatus(order.id, 'Packed')}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg font-semibold"
                    >
                      Packed at Farm
                    </button>

                    <button
                      onClick={() => handleUpdateItemStatus(order.id, 'Shipped')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-semibold"
                    >
                      Dispatch / Shipped
                    </button>

                    <button
                      onClick={() => handleUpdateItemStatus(order.id, 'Delivered')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                    >
                      Mark Delivered
                    </button>

                    <button
                      onClick={() => handleUpdateItemStatus(order.id, 'Cancelled')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold ml-auto"
                    >
                      Cancel & Restore Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PROFILE TAB */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Farm Profile & Geolocation Coordinates</h2>
            <p className="text-xs text-stone-500">
              Customers locate your farm using these coordinates. Ensure accurate pin positioning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Farm / Orchard Name</label>
              <input
                type="text"
                required
                value={farmName}
                onChange={e => setFarmName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Direct Farmer Contact Phone</label>
              <input
                type="tel"
                required
                value={farmPhone}
                onChange={e => setFarmPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">City / Region</label>
              <input
                type="text"
                required
                value={farmCity}
                onChange={e => setFarmCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Farm Physical Address</label>
              <input
                type="text"
                value={farmAddress}
                onChange={e => setFarmAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-700 block mb-1">Farm Story & Cultivation Practices</label>
              <textarea
                rows={3}
                value={farmBio}
                onChange={e => setFarmBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
          </div>

          {/* Interactive Leaflet Location Picker */}
          <div className="pt-2">
            <label className="font-semibold text-stone-700 block mb-2 text-xs">
              Farm Geolocation Coordinates
            </label>
            <LocationPickerMap
              lat={farmCoords.lat}
              lng={farmCoords.lng}
              onChange={setFarmCoords}
              height="280px"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Farm Coordinates</span>
            </button>
            {profileSaved && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                Profile updated successfully!
              </span>
            )}
          </div>
        </form>
      )}

      {/* Product Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base">
                {editingProduct ? 'Edit Crop Details' : 'Add New Harvest to Marketplace'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Crop / Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Farm Fresh Vine Tomatoes"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Unit of Measurement</label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value as ProductUnit })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Price in ₹ (per {formData.unit})</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Available Quantity ({formData.unit})</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Crop Image URL</label>
                <input
                  type="url"
                  value={formData.images[0] || ''}
                  onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Harvest Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about quality, flavor profile, and picking time..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Harvest Date / Freshness Note</label>
                <input
                  type="text"
                  value={formData.harvestDate}
                  onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                  placeholder="e.g. Harvested this morning"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOrganic}
                    onChange={e => setFormData({ ...formData, isOrganic: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-stone-800">
                    Certified Organic (No chemical fertilizer or pesticide)
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Harvest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
