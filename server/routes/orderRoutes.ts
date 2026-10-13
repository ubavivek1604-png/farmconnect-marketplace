import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);

export default router;
