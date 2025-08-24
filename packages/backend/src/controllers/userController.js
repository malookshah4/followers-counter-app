import prisma from '../db.js';
import axios from 'axios';
// Get the current logged-in user's profile
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user from our database to find their access token
    const userInDb = await prisma.user.findUnique({
      where: { id: userId },
      include: { tikTokAccount: true },
    });

    if (!userInDb || !userInDb.tikTokAccount) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Use the access token to get LIVE stats from the TikTok API
    const fields = "open_id,avatar_url_100,display_name,follower_count,following_count";
    const userStatsResponse = await axios.get(
      `https://open.tiktokapis.com/v2/user/info/?fields=${fields}`,
      {
        headers: { Authorization: `Bearer ${userInDb.tikTokAccount.accessToken}` },
      }
    );

    const liveTikTokStats = userStatsResponse.data.data.user;

    // 3. Combine our database info (like stars) with live TikTok info
    const combinedUserData = {
      ...userInDb,
      tikTokAccount: {
        ...userInDb.tikTokAccount,
        // Add the live stats to the object we send to the frontend
        follower_count: liveTikTokStats.follower_count,
        following_count: liveTikTokStats.following_count,
      },
    };

    // Remove sensitive data before sending
    const { accessToken, refreshToken, ...safeTikTokAccount } = combinedUserData.tikTokAccount;
    res.json({ user: { ...combinedUserData, tikTokAccount: safeTikTokAccount } });

  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// This function is optimized to only get the latest follower count
export const getLiveStats = async (req, res) => {
  try {
    const userInDb = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { tikTokAccount: true },
    });

    if (!userInDb || !userInDb.tikTokAccount) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const fields = "follower_count";
    const response = await axios.get(
      `https://open.tiktokapis.com/v2/user/info/?fields=${fields}`,
      { headers: { Authorization: `Bearer ${userInDb.tikTokAccount.accessToken}` } }
    );

    res.json({ follower_count: response.data.data.user.follower_count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch live stats.' });
  }
};