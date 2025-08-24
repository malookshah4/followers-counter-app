import prisma from '../db.js';
import { sendMessageToUser } from '../websocket.js';
// Define the rewards for each task type
const TASK_REWARDS = {
  FOLLOW: 10, // 10 stars for a follow
  LIKE: 2,      // 2 stars for a like
};

// Get a list of available tasks for the logged-in user
export const getTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find active campaigns that are NOT created by the current user,
    // and for which the current user has NOT already completed a task.
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
        userId: {
          not: userId,
        },
        tasks: {
          none: {
            userId: userId,
          },
        },
      },
      take: 10, // Show 10 tasks at a time
    });
    res.json(campaigns);
  } catch (error) {
    console.error('Failed to get tasks:', error);
    res.status(500).json({ message: 'Failed to get tasks.' });
  }
};

