import { Router } from "express";
import {
  createCampaign,
  getPromoPackages,
  purchaseCampaign,
  getMyCampaigns,
  getAvailableCampaigns,
} from "../controllers/campaignController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createCampaign);
router.get("/promo-packages", authMiddleware, getPromoPackages);
router.post("/purchase", authMiddleware, purchaseCampaign);
router.get("/my-campaigns", authMiddleware, getMyCampaigns);
router.get("/available", authMiddleware, getAvailableCampaigns)

export default router;
