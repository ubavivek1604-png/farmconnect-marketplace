import { getInitialSeedData, SeedUser, SeedProduct, SeedOrder } from './seedData.ts';

class FarmDataStore {
  private users: SeedUser[] = [];
  private products: SeedProduct[] = [];
  private orders: SeedOrder[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  public init() {
    const seed = getInitialSeedData();
    this.users = seed.users;
    this.products = seed.products;
    this.orders = seed.orders;
    this.isInitialized = true;
    console.log(`🌾 FarmConnect Store Initialized: ${this.users.length} users, ${this.products.length} products, ${this.orders.length} orders loaded.`);
  }

  public resetToSeed() {
    this.init();
    return {
      usersCount: this.users.length,
      productsCount: this.products.length,
      ordersCount: this.orders.length
    };
  }

  // --- USERS ---
  public findUserByEmail(email: string): SeedUser | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): SeedUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public getAllUsers(): SeedUser[] {
    return [...this.users];
  }

  public getFarmers(): SeedUser[] {
    return this.users.filter(u => u.role === 'farmer' && u.isActive);
  }

  public createUser(user: Omit<SeedUser, 'id' | 'createdAt' | 'isActive'>): SeedUser {
    const newUser: SeedUser = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<SeedUser>): SeedUser | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = {
      ...this.users[index],
      ...updates
    };
    return this.users[index];
  }

  // --- PRODUCTS ---
  public getAllProducts(query: {
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
  }) {
    let list = [...this.products];

    // Filter active products
    list = list.filter(p => p.isAvailable);

    if (query.category && query.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === query.category?.toLowerCase());
    }

    if (query.farmerId) {
      list = list.filter(p => p.farmerId === query.farmerId);
    }

    if (query.city) {
      const cityQuery = query.city.toLowerCase();
      list = list.filter(p => p.location.city.toLowerCase().includes(cityQuery));
    }

    if (query.inStockOnly) {
      list = list.filter(p => p.quantity > 0);
    }

    if (query.minPrice !== undefined && !isNaN(query.minPrice)) {
      list = list.filter(p => p.price >= (query.minPrice ?? 0));
    }

    if (query.maxPrice !== undefined && !isNaN(query.maxPrice)) {
      list = list.filter(p => p.price <= (query.maxPrice ?? 999999));
    }

    if (query.search) {
      const s = query.search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.farmerName.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.location.city.toLowerCase().includes(s)
      );
    }

    // Sorting
    if (query.sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (query.sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (query.sort === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: newest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = list.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 20);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  public getProductById(id: string): SeedProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  public getProductsByFarmerId(farmerId: string): SeedProduct[] {
    return this.products.filter(p => p.farmerId === farmerId);
  }

  public createProduct(data: Omit<SeedProduct, 'id' | 'createdAt' | 'updatedAt'>): SeedProduct {
    const newProduct: SeedProduct = {
      ...data,
      id: `prd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<SeedProduct>): SeedProduct | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.products[index];
  }

  public deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // --- ORDERS ---
  public getOrderById(id: string): SeedOrder | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public getCustomerOrders(customerId: string): SeedOrder[] {
    return this.orders
      .filter(o => o.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getFarmerOrders(farmerId: string): { order: SeedOrder; farmerItems: SeedOrder['items'] }[] {
    const results: { order: SeedOrder; farmerItems: SeedOrder['items'] }[] = [];
    for (const order of this.orders) {
      const itemsForFarmer = order.items.filter(item => item.farmerId === farmerId);
      if (itemsForFarmer.length > 0) {
        results.push({
          order,
          farmerItems: itemsForFarmer
        });
      }
    }
    return results.sort((a, b) => new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime());
  }

  public getAllOrders(): SeedOrder[] {
    return [...this.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Safe atomic order creation:
   * Validates stock, calculates server-side totals, deducts stock, records order.
   */
  public createOrder(data: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: { productId: string; quantity: number }[];
    deliveryAddress: SeedOrder['deliveryAddress'];
    paymentMethod: SeedOrder['paymentMethod'];
  }): { success: boolean; order?: SeedOrder; error?: string } {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: 'Order must contain at least one item.' };
    }

    // 1. Validate all products and stock availability
    const verifiedItems: SeedOrder['items'] = [];
    let calculatedSubtotal = 0;

    for (const item of data.items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        return { success: false, error: `Product not found (ID: ${item.productId})` };
      }
      if (!product.isAvailable) {
        return { success: false, error: `${product.name} is currently unavailable.` };
      }
      if (item.quantity <= 0) {
        return { success: false, error: `Quantity must be greater than 0 for ${product.name}.` };
      }
      if (product.quantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.quantity} ${product.unit}, requested: ${item.quantity}.`
        };
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        productName: product.name,
        image: product.images[0] || '',
        price: product.price,
        unit: product.unit,
        quantity: item.quantity,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        farmCity: product.location?.city || '',
        itemTotal,
        fulfillmentStatus: 'Pending'
      });
    }

    // 2. Compute delivery fee: Free over ₹500, otherwise ₹40
    const deliveryFee = calculatedSubtotal >= 500 ? 0 : 40;
    const totalAmount = calculatedSubtotal + deliveryFee;

    // 3. Atomically decrement inventory for all purchased products
    for (const item of verifiedItems) {
      const product = this.getProductById(item.productId);
      if (product) {
        product.quantity -= item.quantity;
        if (product.quantity === 0) {
          // Keep available flag or let it display as Sold Out
        }
      }
    }

    const orderNumber = `FC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: SeedOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      items: verifiedItems,
      deliveryAddress: data.deliveryAddress,
      subtotal: calculatedSubtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
      orderStatus: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.unshift(newOrder);
    return { success: true, order: newOrder };
  }

  /**
   * Update item fulfillment status for a specific farmer's items or whole order
   */
  public updateFulfillmentStatus(
    orderId: string,
    farmerId: string | null,
    newStatus: SeedOrder['orderStatus']
  ): { success: boolean; order?: SeedOrder; error?: string } {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    // If order is cancelled, restore stock for affected items
    if (newStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      const itemsToRestore = farmerId ? order.items.filter(i => i.farmerId === farmerId) : order.items;
      for (const item of itemsToRestore) {
        if (item.fulfillmentStatus !== 'Cancelled') {
          const product = this.getProductById(item.productId);
          if (product) {
            product.quantity += item.quantity;
          }
        }
      }
    }

    if (farmerId) {
      // Farmer updates only their items
      let anyUpdated = false;
      for (const item of order.items) {
        if (item.farmerId === farmerId) {
          item.fulfillmentStatus = newStatus;
          anyUpdated = true;
        }
      }
      if (!anyUpdated) {
        return { success: false, error: 'No items in this order belong to your farm' };
      }

      // Check overall order status
      const allStatuses = order.items.map(i => i.fulfillmentStatus);
      if (allStatuses.every(s => s === 'Delivered')) {
        order.orderStatus = 'Delivered';
        if (order.paymentMethod === 'Cash on Delivery') {
          order.paymentStatus = 'Completed';
        }
      } else if (allStatuses.some(s => s === 'Shipped')) {
        order.orderStatus = 'Shipped';
      } else if (allStatuses.some(s => s === 'Packed')) {
        order.orderStatus = 'Packed';
      } else if (allStatuses.some(s => s === 'Confirmed')) {
        order.orderStatus = 'Confirmed';
      } else if (allStatuses.every(s => s === 'Cancelled')) {
        order.orderStatus = 'Cancelled';
      }
    } else {
      // Admin or system update
      order.orderStatus = newStatus;
      for (const item of order.items) {
        item.fulfillmentStatus = newStatus;
      }
      if (newStatus === 'Delivered' && order.paymentMethod === 'Cash on Delivery') {
        order.paymentStatus = 'Completed';
      }
    }

    order.updatedAt = new Date().toISOString();
    return { success: true, order };
  }

  // --- ANALYTICS ---
  public getFarmerAnalytics(farmerId: string) {
    const products = this.getProductsByFarmerId(farmerId);
    const totalProducts = products.length;
    const availableInventory = products.reduce((acc, p) => acc + p.quantity, 0);
    const lowStockProducts = products.filter(p => p.quantity < 10);

    const farmerOrders = this.getFarmerOrders(farmerId);
    const totalOrders = farmerOrders.length;

    let totalRevenue = 0;
    const salesByDay: Record<string, number> = {};

    for (const fo of farmerOrders) {
      for (const item of fo.farmerItems) {
        if (item.fulfillmentStatus !== 'Cancelled') {
          totalRevenue += item.itemTotal;
          const day = fo.order.createdAt.substring(0, 10);
          salesByDay[day] = (salesByDay[day] || 0) + item.itemTotal;
        }
      }
    }

    const chartData = Object.entries(salesByDay).map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      revenue
    }));

    return {
      totalProducts,
      availableInventory,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      recentOrders: farmerOrders.slice(0, 5).map(fo => ({
        orderNumber: fo.order.orderNumber,
        customerName: fo.order.customerName,
        date: fo.order.createdAt,
        total: fo.farmerItems.reduce((acc, i) => acc + i.itemTotal, 0),
        status: fo.farmerItems[0]?.fulfillmentStatus || fo.order.orderStatus
      })),
      chartData
    };
  }

  public getAdminAnalytics() {
    const totalUsers = this.users.length;
    const farmersCount = this.users.filter(u => u.role === 'farmer').length;
    const customersCount = this.users.filter(u => u.role === 'customer').length;
    const totalProducts = this.products.length;
    const totalOrders = this.orders.length;

    const totalRevenue = this.orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const ordersByStatus: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    for (const o of this.orders) {
      ordersByStatus[o.orderStatus] = (ordersByStatus[o.orderStatus] || 0) + 1;
    }

    const categoryDistribution: Record<string, number> = {};
    for (const p of this.products) {
      categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1;
    }

    const lowStockAlerts = this.products.filter(p => p.quantity < 10);

    return {
      totalUsers,
      farmersCount,
      customersCount,
      totalProducts,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      categoryDistribution,
      lowStockAlerts
    };
  }
}

export const dataStore = new FarmDataStore();
