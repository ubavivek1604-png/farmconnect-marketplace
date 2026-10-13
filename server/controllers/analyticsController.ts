import { Response } from 'express';
import { dataStore } from '../utils/dataStore.ts';
import { AuthRequest } from '../middleware/auth.ts';

export function getFarmerAnalytics(req: AuthRequest, res: Response): void {
  try {
    if (!req.user || req.user.role !== 'farmer') {
      res.status(403).json({ success: false, message: 'Only registered farmers can access farmer analytics.' });
      return;
    }

    const analytics = dataStore.getFarmerAnalytics(req.user.id);
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate farmer analytics.', error: (error as Error).message });
  }
}

export function getAdminAnalytics(req: AuthRequest, res: Response): void {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only administrators can access admin analytics.' });
      return;
    }

    const analytics = dataStore.getAdminAnalytics();
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate admin analytics.', error: (error as Error).message });
  }
}
