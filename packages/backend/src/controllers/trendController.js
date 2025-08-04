import { analyzeVideosByIds } from '../services/trendService.js';
import prisma from '../db.js';

export const triggerTrendAnalysis = async (req, res) => {
  try {
    // Get the logged-in user's access token from our database
    const userAccount = await prisma.tikTokAccount.findUnique({
      where: { userId: req.user.id },
    });

    if (!userAccount || !userAccount.accessToken) {
      return res.status(400).json({ message: 'User does not have a linked TikTok account.' });
    }

    // --- TEMPORARY TEST CODE ---
    // PASTE YOUR PUBLIC VIDEO ID HERE
    const videoIdsToTest = ["7533936363226662407"]; 
    // Example: const videoIdsToTest = ["7381234567891234567"];

    const result = await analyzeVideosByIds(userAccount.accessToken, videoIdsToTest);
    res.json({ message: 'Trend analysis complete.', ...result });

  } catch (error) {
    console.error('Trend analysis failed:', error.response?.data || error.message);
    res.status(500).json({ message: 'Trend analysis failed.' });
  }
};

// This function gets all the saved trends from the database
export const getTrends = async (req, res) => {
  try {
    const audioTrends = await prisma.audioTrend.findMany({
      orderBy: { lastSeen: 'desc' }, // Show the most recently seen first
    });

    const hashtagTrends = await prisma.hashtagTrend.findMany({
      orderBy: { lastSeen: 'desc' },
    });

    res.json({ audioTrends, hashtagTrends });
  } catch (error) {
    console.error('Failed to get trends:', error);
    res.status(500).json({ message: 'Failed to get trends.' });
  }
};