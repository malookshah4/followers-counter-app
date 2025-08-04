import { Router } from 'express';
import { redirectToTikTok, handleTikTokCallback } from '../controllers/authController.js';

const router = Router();
router.get('/tiktok', redirectToTikTok);
router.get('/tiktok/callback', handleTikTokCallback);

export default router;