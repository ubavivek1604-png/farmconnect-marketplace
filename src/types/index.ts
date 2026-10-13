export type UserRole = 'customer' | 'farmer' | 'admin';

export interface FarmLocation {
  farmName?: string;
  description?: string;
  city?: string;
  state?: string;
  address?: string;
  pincode?: string;
  deliveryRadiusKm?: number;
  lat: number;
  lng: number;
  experienceYears?: number;
  organicCertified?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address?: string;
  pincode?: string;
  farmLocation?: FarmLocation;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Dairy'
  | 'Organic Produce';

export type ProductUnit = 'kg' | 'dozen' | 'litre' | 'piece' | 'bunch' | 'quintal';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  quantity: number;
  images: string[];
  farmerId: string;
  farmerName: string;
  location: {
    farmName?: string;
    city?: string;
    state?: string;
    address?: string;
    pincode?: string;
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  isOrganic: boolean;
  harvestDate?: string;
  createdAt: string;
  updatedAt: string;
  farmer?: Partial<User>;
}

export type FulfillmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  image?: string;
  price: number;
  unit: string;
  quantity: number;
  farmerId: string;
  farmerName: string;
  farmCity?: string;
  itemTotal: number;
  fulfillmentStatus: FulfillmentStatus;
  updatedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    notes?: string;
  };
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'UPI / NetBanking (Test Mode)';
  paymentStatus: 'Pending' | 'Completed' | 'Refunded';
  orderStatus: FulfillmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FarmerAnalytics {
  totalProducts: number;
  availableInventory: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: Product[];
  recentOrders: {
    orderNumber: string;
    customerName: string;
    date: string;
    total: number;
    status: FulfillmentStatus;
  }[];
  chartData: {
    date: string;
    revenue: number;
  }[];
}

export interface AdminAnalytics {
  totalUsers: number;
  farmersCount: number;
  customersCount: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  categoryDistribution: Record<string, number>;
  lowStockAlerts: Product[];
}
