import { Router } from 'express';
import {
  getUsers,
  toggleUserStatus,
  getAdminProducts,
  toggleProductStatus,
  getAdminOrders,
  resetSeedData,
  getDemoCredentials
} from '../controllers/adminController.ts';
import { authenticate, requireRole } from '../middleware/auth.ts';

const router = Router();

// Public helper for hackathon judges & testers
router.get('/demo-credentials', getDemoCredentials);
router.post('/reset-seed', resetSeedData);

// Admin-only protected routes
router.use(authenticate, requireRole(['admin']));

router.get('/users', getUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/products', getAdminProducts);
router.patch('/products/:id/toggle-status', toggleProductStatus);
router.get('/orders', getAdminOrders);

export default router;
