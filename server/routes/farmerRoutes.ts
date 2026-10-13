import { Router } from 'express';
import { getFarmers, getFarmerById, getFarmerProducts } from '../controllers/farmerController.ts';

const router = Router();

router.get('/', getFarmers);
router.get('/:id', getFarmerById);
router.get('/:id/products', getFarmerProducts);

export default router;
