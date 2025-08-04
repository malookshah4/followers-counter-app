import { Router } from 'express';
import { triggerTrendAnalysis, getTrends } from '../controllers/trendController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// A protected route to start the analysis for the logged-in user
router.post('/analyze', authMiddleware, triggerTrendAnalysis);
// Route to get the list of saved trends
router.get('/', authMiddleware, getTrends);

export default router;