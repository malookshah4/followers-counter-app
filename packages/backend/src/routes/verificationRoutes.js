import { Router } from 'express';
import { startVerification, submitVerification } from '../controllers/verificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/start', authMiddleware, startVerification);
router.post('/submit', authMiddleware, submitVerification);

export default router;