import { Router } from 'express';
import { getFarmerAnalytics, getAdminAnalytics } from '../controllers/analyticsController.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.get('/farmer', authenticate, getFarmerAnalytics);
router.get('/admin', authenticate, getAdminAnalytics);

export default router;
