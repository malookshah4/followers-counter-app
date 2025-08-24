import { Router } from 'express';
import { getTasks } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Get a list of available tasks
router.get('/', authMiddleware, getTasks);


export default router;