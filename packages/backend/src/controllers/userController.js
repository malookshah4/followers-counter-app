import prisma from '../db.js';

// Get the current logged-in user's profile
export const getMe = async (req, res) => {
  try {
    // We can access req.user.id because our authMiddleware added it
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tikTokAccount: true, // Include the linked TikTok account details
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't send sensitive data like tokens back to the client
    const { accessToken, refreshToken, ...safeTikTokAccount } = user.tikTokAccount;

    res.json({ user: { ...user, tikTokAccount: safeTikTokAccount } });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};