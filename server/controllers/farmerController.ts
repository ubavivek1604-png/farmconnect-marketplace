import { Request, Response } from 'express';
import { dataStore } from '../utils/dataStore.ts';

export function getFarmers(req: Request, res: Response): void {
  try {
    const { city, search } = req.query;
    let farmers = dataStore.getFarmers();

    if (city) {
      const c = (city as string).toLowerCase();
      farmers = farmers.filter(f => f.farmLocation?.city?.toLowerCase().includes(c));
    }

    if (search) {
      const s = (search as string).toLowerCase();
      farmers = farmers.filter(f =>
        f.name.toLowerCase().includes(s) ||
        f.farmLocation?.farmName?.toLowerCase().includes(s) ||
        f.farmLocation?.city?.toLowerCase().includes(s) ||
        f.farmLocation?.description?.toLowerCase().includes(s)
      );
    }

    const result = farmers.map(f => {
      const products = dataStore.getProductsByFarmerId(f.id);
      return {
        id: f.id,
        name: f.name,
        phone: f.phone,
        profileImage: f.profileImage,
        farmLocation: f.farmLocation,
        productCount: products.length,
        availableProducts: products.filter(p => p.isAvailable && p.quantity > 0).length,
        categories: Array.from(new Set(products.map(p => p.category))),
        sampleImages: products.slice(0, 3).map(p => p.images[0]).filter(Boolean),
        createdAt: f.createdAt
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch farmers.', error: (error as Error).message });
  }
}

export function getFarmerById(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const farmer = dataStore.findUserById(id);

    if (!farmer || farmer.role !== 'farmer') {
      res.status(404).json({ success: false, message: 'Farmer not found.' });
      return;
    }

    const products = dataStore.getProductsByFarmerId(farmer.id);

    res.status(200).json({
      success: true,
      data: {
        id: farmer.id,
        name: farmer.name,
        phone: farmer.phone,
        address: farmer.address,
        farmLocation: farmer.farmLocation,
        profileImage: farmer.profileImage,
        productsCount: products.length,
        createdAt: farmer.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch farmer profile.', error: (error as Error).message });
  }
}

export function getFarmerProducts(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const products = dataStore.getProductsByFarmerId(id);

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch farmer products.', error: (error as Error).message });
  }
}
