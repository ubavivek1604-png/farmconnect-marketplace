import {
  User,
  Product,
  Order,
  FarmerAnalytics,
  AdminAnalytics,
  FulfillmentStatus
} from '../types/index.ts';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || '/api';

function getToken(): string | null {
  return localStorage.getItem('farmconnect_token');
}

export function setToken(token: string): void {
  localStorage.setItem('farmconnect_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('farmconnect_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    register: (body: {
      name: string;
      email: string;
      password: string;
      role: 'customer' | 'farmer';
      phone?: string;
      address?: string;
      farmLocation?: Record<string, unknown>;
    }) => request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

    login: (body: { email: string; password: string }) =>
      request<{ success: boolean; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    getMe: () => request<{ success: boolean; user: User }>('/auth/me'),

    updateProfile: (body: Partial<User>) =>
      request<{ success: boolean; user: User }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(body)
      })
  },

  // Products
  products: {
    list: (params: {
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      farmerId?: string;
      city?: string;
      inStockOnly?: boolean;
      sort?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const q = new URLSearchParams();
      if (params.category && params.category !== 'All') q.set('category', params.category);
      if (params.search) q.set('search', params.search);
      if (params.minPrice !== undefined) q.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) q.set('maxPrice', params.maxPrice.toString());
      if (params.farmerId) q.set('farmerId', params.farmerId);
      if (params.city) q.set('city', params.city);
      if (params.inStockOnly) q.set('inStockOnly', 'true');
      if (params.sort) q.set('sort', params.sort);
      if (params.page) q.set('page', params.page.toString());
      if (params.limit) q.set('limit', params.limit.toString());

      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<{
        success: boolean;
        data: Product[];
        pagination: { total: number; page: number; totalPages: number };
      }>(`/products${queryStr}`);
    },

    getById: (id: string) =>
      request<{ success: boolean; data: Product }>(`/products/${id}`),

    create: (data: Partial<Product>) =>
      request<{ success: boolean; message: string; data: Product }>('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    update: (id: string, data: Partial<Product>) =>
      request<{ success: boolean; message: string; data: Product }>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/products/${id}`, {
        method: 'DELETE'
      })
  },

  // Farmers
  farmers: {
    list: (params: { city?: string; search?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.city) q.set('city', params.city);
      if (params.search) q.set('search', params.search);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<{
        success: boolean;
        data: (User & {
          productCount: number;
          availableProducts: number;
          categories: string[];
          sampleImages: string[];
        })[];
      }>(`/farmers${queryStr}`);
    },

    getById: (id: string) =>
      request<{ success: boolean; data: User & { productsCount: number } }>(`/farmers/${id}`),

    getProducts: (farmerId: string) =>
      request<{ success: boolean; data: Product[] }>(`/farmers/${farmerId}/products`)
  },

  // Orders
  orders: {
    create: (body: {
      items: { productId: string; quantity: number }[];
      deliveryAddress: Order['deliveryAddress'];
      paymentMethod: Order['paymentMethod'];
    }) =>
      request<{ success: boolean; message: string; data: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(body)
      }),

    getMyOrders: () =>
      request<{ success: boolean; data: any[] }>('/orders/my'),

    getById: (id: string) =>
      request<{ success: boolean; data: Order }>(`/orders/${id}`),

    updateStatus: (id: string, status: FulfillmentStatus) =>
      request<{ success: boolean; message: string; data: Order }>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
  },

  // Analytics
  analytics: {
    getFarmer: () =>
      request<{ success: boolean; data: FarmerAnalytics }>('/analytics/farmer'),

    getAdmin: () =>
      request<{ success: boolean; data: AdminAnalytics }>('/analytics/admin')
  },

  // Admin
  admin: {
    getUsers: (params: { role?: string; search?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.role) q.set('role', params.role);
      if (params.search) q.set('search', params.search);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<{ success: boolean; data: User[] }>(`/admin/users${queryStr}`);
    },

    toggleUserStatus: (id: string) =>
      request<{ success: boolean; message: string; data: User }>(`/admin/users/${id}/toggle-status`, {
        method: 'PATCH'
      }),

    getProducts: (params: { search?: string; category?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.search) q.set('search', params.search);
      if (params.category) q.set('category', params.category);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<{ success: boolean; data: Product[] }>(`/admin/products${queryStr}`);
    },

    toggleProductStatus: (id: string) =>
      request<{ success: boolean; message: string; data: Product }>(`/admin/products/${id}/toggle-status`, {
        method: 'PATCH'
      }),

    getOrders: () =>
      request<{ success: boolean; data: Order[] }>('/admin/orders'),

    resetSeed: () =>
      request<{ success: boolean; message: string; counts: Record<string, number> }>('/admin/reset-seed', {
        method: 'POST'
      }),

    getDemoCredentials: () =>
      request<{
        success: boolean;
        accounts: { role: string; name: string; email: string; password: string; description: string }[];
      }>('/admin/demo-credentials')
  }
};
