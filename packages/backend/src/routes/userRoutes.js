import { Router } from 'express';
import { getMe } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// This route is protected by our authMiddleware
router.get('/me', authMiddleware, getMe);

export default router;