import prisma from '../db.js';

// This object defines our products. It's the single source of truth for star amounts.
const STAR_PACKS = {
  starter: { stars: 550 },
  creator: { stars: 1200 },
  pro: { stars: 3000 },
};

// This function simulates a successful purchase for development
export const purchaseStarPackDev = async (req, res) => {
  const userId = req.user.id;
  const { packId } = req.body;

  const pack = STAR_PACKS[packId];
  if (!pack) {
    return res.status(400).json({ message: 'Invalid star pack ID.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        stars: {
          increment: pack.stars,
        },
      },
    });

    // In a real app, we would log this transaction in the PaymentOrder table here.

    res.json({
      message: `${pack.stars} stars added successfully.`,
      newStarBalance: updatedUser.stars,
    });
  } catch (error) {
    console.error('Failed to add stars:', error);
    res.status(500).json({ message: 'Failed to add stars.' });
  }
};