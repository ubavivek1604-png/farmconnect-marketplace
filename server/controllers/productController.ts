import { Request, Response } from 'express';
import { dataStore } from '../utils/dataStore.ts';
import { AuthRequest } from '../middleware/auth.ts';

const VALID_CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Organic Produce'];
const VALID_UNITS = ['kg', 'dozen', 'litre', 'piece', 'bunch', 'quintal'];

export function getProducts(req: Request, res: Response): void {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      farmerId,
      city,
      inStockOnly,
      sort,
      page,
      limit
    } = req.query;

    const result = dataStore.getAllProducts({
      category: category as string,
      search: search as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      farmerId: farmerId as string,
      city: city as string,
      inStockOnly: inStockOnly === 'true',
      sort: sort as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20
    });

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.', error: (error as Error).message });
  }
}

export function getProductById(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const product = dataStore.getProductById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const farmer = dataStore.findUserById(product.farmerId);
    res.status(200).json({
      success: true,
      data: {
        ...product,
        farmer: farmer ? {
          id: farmer.id,
          name: farmer.name,
          phone: farmer.phone,
          farmLocation: farmer.farmLocation,
          profileImage: farmer.profileImage
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product.', error: (error as Error).message });
  }
}

export function createProduct(req: AuthRequest, res: Response): void {
  try {
    if (!req.user || req.user.role !== 'farmer') {
      res.status(403).json({ success: false, message: 'Only registered farmers can add new products.' });
      return;
    }

    const {
      name,
      description,
      category,
      price,
      unit,
      quantity,
      images,
      isOrganic,
      harvestDate
    } = req.body;

    if (!name || !description || !category || price === undefined || !unit || quantity === undefined) {
      res.status(400).json({ success: false, message: 'All product fields are required.' });
      return;
    }

    const numPrice = Number(price);
    const numQty = Number(quantity);

    if (isNaN(numPrice) || numPrice < 0) {
      res.status(400).json({ success: false, message: 'Price must be a non-negative number.' });
      return;
    }

    if (isNaN(numQty) || numQty < 0) {
      res.status(400).json({ success: false, message: 'Quantity must be a non-negative number.' });
      return;
    }

    if (!VALID_CATEGORIES.includes(category)) {
      res.status(400).json({ success: false, message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` });
      return;
    }

    if (!VALID_UNITS.includes(unit)) {
      res.status(400).json({ success: false, message: `Unit must be one of: ${VALID_UNITS.join(', ')}` });
      return;
    }

    const farmer = dataStore.findUserById(req.user.id);
    const farmLoc = farmer?.farmLocation;

    const productImages = Array.isArray(images) && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
    ];

    const newProduct = dataStore.createProduct({
      name: name.trim(),
      description: description.trim(),
      category,
      price: numPrice,
      unit,
      quantity: numQty,
      images: productImages,
      farmerId: req.user.id,
      farmerName: req.user.name,
      location: {
        farmName: farmLoc?.farmName || `${req.user.name}'s Farm`,
        city: farmLoc?.city || 'Pune',
        state: farmLoc?.state || 'Maharashtra',
        address: farmLoc?.address || '',
        lat: farmLoc?.lat || 18.5204,
        lng: farmLoc?.lng || 73.8567
      },
      isAvailable: true,
      isOrganic: Boolean(isOrganic),
      harvestDate: harvestDate || 'Freshly Harvested'
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product.', error: (error as Error).message });
  }
}

export function updateProduct(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const existing = dataStore.getProductById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Role check: Farmer can only edit their own products; admin can edit any
    if (req.user?.role !== 'admin' && existing.farmerId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'You are only authorized to edit your own products.' });
      return;
    }

    const {
      name,
      description,
      category,
      price,
      unit,
      quantity,
      images,
      isAvailable,
      isOrganic,
      harvestDate
    } = req.body;

    const updates: Record<string, unknown> = {};

    if (name) updates.name = name.trim();
    if (description) updates.description = description.trim();
    if (category && VALID_CATEGORIES.includes(category)) updates.category = category;
    if (unit && VALID_UNITS.includes(unit)) updates.unit = unit;

    if (price !== undefined) {
      const p = Number(price);
      if (isNaN(p) || p < 0) {
        res.status(400).json({ success: false, message: 'Price must be a non-negative number.' });
        return;
      }
      updates.price = p;
    }

    if (quantity !== undefined) {
      const q = Number(quantity);
      if (isNaN(q) || q < 0) {
        res.status(400).json({ success: false, message: 'Quantity must be a non-negative number.' });
        return;
      }
      updates.quantity = q;
    }

    if (images && Array.isArray(images)) updates.images = images;
    if (isAvailable !== undefined) updates.isAvailable = Boolean(isAvailable);
    if (isOrganic !== undefined) updates.isOrganic = Boolean(isOrganic);
    if (harvestDate !== undefined) updates.harvestDate = harvestDate;

    const updated = dataStore.updateProduct(id, updates);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.', error: (error as Error).message });
  }
}

export function deleteProduct(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const existing = dataStore.getProductById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    if (req.user?.role !== 'admin' && existing.farmerId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'You are only authorized to delete your own products.' });
      return;
    }

    dataStore.deleteProduct(id);
    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.', error: (error as Error).message });
  }
}
