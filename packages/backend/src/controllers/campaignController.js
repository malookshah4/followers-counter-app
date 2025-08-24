import prisma from '../db.js';
import axios from 'axios';

// Define the cost for each campaign type
const CAMPAIGN_COSTS = {
  FOLLOW: 20, // 20 stars per follower
  LIKE: 4,      // 4 stars per like
};

export const createCampaign = async (req, res) => {
    const { type, targetUrl, totalAmount } = req.body;
    const userId = req.user.id;

    if (!['FOLLOW', 'LIKE'].includes(type) || !targetUrl || !totalAmount) {
        return res.status(400).json({ message: 'Invalid campaign data provided.' });
    }

    try {
        const cost = totalAmount * CAMPAIGN_COSTS[type];
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { tikTokAccount: true } });

        if (!user || !user.tikTokAccount) {
            return res.status(400).json({ message: 'User TikTok account not found.' });
        }
        if (user.stars < cost) {
            return res.status(400).json({ message: `Not enough stars. You need ${cost}, but you only have ${user.stars}.` });
        }

        let thumbnailUrl = null;
        let title = null;

        if (type === 'LIKE') {
            const match = targetUrl.match(/\/video\/(\d{18,})/);
            const videoId = match ? match[1] : null;

            if (!videoId) {
                throw new Error("Could not find a valid TikTok Video ID in the provided URL.");
            }

            // === THIS IS THE CHANGE ===
            // We now ask for 'title' in the fields parameter
            const response = await axios.post(
                'https://open.tiktokapis.com/v2/video/list/?fields=cover_image_url,title',
                { video_ids: [videoId] },
                { headers: { Authorization: `Bearer ${user.tikTokAccount.accessToken}`, 'Content-Type': 'application/json' } }
            );

            const videoData = response.data.data.videos[0];
            if (!videoData) {
                 throw new Error("Could not find video data. The video may be private or the URL is incorrect.");
            }

            thumbnailUrl = videoData.cover_image_url;
            title = videoData.title; // Get the title from the response
        }

        const [updatedUser, newCampaign] = await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { stars: { decrement: cost } },
            }),
            prisma.campaign.create({
                // Add the 'title' to the data being saved
                data: { type, targetUrl, totalAmount: Number(totalAmount), userId, thumbnailUrl, title },
            }),
        ]);

        res.status(201).json(newCampaign);
    } catch (error) {
        console.error('Failed to create campaign:', error.response?.data || error.message);
        res.status(500).json({ message: error.message || 'Failed to create campaign.' });
    }
};

export const getPromoPackages = async (req, res) => {
    try {
        const packages = await prisma.promoPackage.findMany({
            where: { isActive: true },
            orderBy: { costInStars: 'asc' }
        });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch promo packages.' });
    }
};

export const purchaseCampaign = async (req, res) => {
    const userId = req.user.id;
    const { packageId, targetUrl } = req.body;

    try {
        const promoPackage = await prisma.promoPackage.findUnique({ where: { id: packageId } });
        if (!promoPackage) {
            return res.status(404).json({ message: 'Promo package not found.' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user.stars < promoPackage.costInStars) {
            return res.status(400).json({ message: 'Not enough stars.' });
        }

        const [updatedUser, newCampaign] = await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { stars: { decrement: promoPackage.costInStars } },
            }),
            prisma.campaign.create({
                data: {
                    userId: userId,
                    targetUrl: targetUrl,
                    type: promoPackage.type,
                    totalAmount: promoPackage.amount,
                },
            }),
        ]);

        res.status(201).json(newCampaign);
    } catch (error) {
        console.error('Failed to purchase campaign:', error);
        res.status(500).json({ message: 'Failed to purchase campaign.' });
    }
};

export const getMyCampaigns = async (req, res ) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: {userId: req.user.id},
      orderBy: { createdAt: 'desc' },
    })
    res.json(campaigns)
  } catch (error) {
     res.status(500).json({ message: 'Failed to fetch user campaigns.' });
  }
}


// Get a list of available campaigns for the logged-in user to complete
export const getAvailableCampaigns = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
        userId: { not: loggedInUserId }, // Not the user's own campaign
        tasks: { none: { userId: loggedInUserId } }, // The user has not completed a task for this campaign
      },
      take: 10,
      include: {
        user: {
          select: {
            tikTokAccount: {
              select: {
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get available campaigns.' });
  }
};