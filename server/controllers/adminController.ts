import { Request, Response } from 'express';
import { dataStore } from '../utils/dataStore.ts';
import { AuthRequest } from '../middleware/auth.ts';

export function getUsers(req: AuthRequest, res: Response): void {
  try {
    const { role, search } = req.query;
    let users = dataStore.getAllUsers();

    if (role && role !== 'all') {
      users = users.filter(u => u.role === role);
    }

    if (search) {
      const s = (search as string).toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.phone.toLowerCase().includes(s)
      );
    }

    const safeUsers = users.map(({ passwordHash: _, ...u }) => u);
    res.status(200).json({ success: true, data: safeUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.', error: (error as Error).message });
  }
}

export function toggleUserStatus(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const user = dataStore.findUserById(id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (user.role === 'admin' && user.id === req.user?.id) {
      res.status(400).json({ success: false, message: 'Cannot deactivate your own administrator account.' });
      return;
    }

    const updated = dataStore.updateUser(id, { isActive: !user.isActive });
    const { passwordHash: _, ...safeUser } = updated!;

    res.status(200).json({
      success: true,
      message: `User ${updated?.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user status.', error: (error as Error).message });
  }
}

export function getAdminProducts(req: AuthRequest, res: Response): void {
  try {
    const { search, category } = req.query;
    // Get all products including unavailable
    let products = dataStore.getAllProducts({
      search: search as string,
      category: category as string,
      limit: 1000
    }).products;

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.', error: (error as Error).message });
  }
}

export function toggleProductStatus(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const product = dataStore.getProductById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const updated = dataStore.updateProduct(id, { isAvailable: !product.isAvailable });
    res.status(200).json({
      success: true,
      message: `Product ${updated?.isAvailable ? 'activated' : 'deactivated'} successfully.`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle product status.', error: (error as Error).message });
  }
}

export function getAdminOrders(req: AuthRequest, res: Response): void {
  try {
    const orders = dataStore.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin orders.', error: (error as Error).message });
  }
}

export function resetSeedData(req: Request, res: Response): void {
  try {
    const counts = dataStore.resetToSeed();
    res.status(200).json({
      success: true,
      message: 'Database reset to initial verified sample data.',
      counts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset seed data.', error: (error as Error).message });
  }
}

export function getDemoCredentials(req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    message: 'Pre-configured test accounts for evaluation',
    accounts: [
      {
        role: 'Farmer',
        name: 'Ramesh Patil',
        email: 'ramesh.farmer@farmconnect.org',
        password: 'password123',
        description: 'Multi-acre organic farm near Pune with tomatoes, potatoes, honey, and palak'
      },
      {
        role: 'Customer',
        name: 'Priya Sharma',
        email: 'customer@farmconnect.org',
        password: 'password123',
        description: 'Customer with active past delivered and shipped orders in Pune'
      },
      {
        role: 'Admin',
        name: 'FarmConnect Admin HQ',
        email: 'admin@farmconnect.org',
        password: 'password123',
        description: 'Full administrative controls, platform analytics, moderation'
      }
    ]
  });
}
