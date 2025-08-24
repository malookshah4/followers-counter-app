import { Router } from 'express';
import { purchaseStarPackDev } from '../controllers/storeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// This endpoint simulates a purchase
router.post('/purchase-pack-dev', authMiddleware, purchaseStarPackDev);

export default router;