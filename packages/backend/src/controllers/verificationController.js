import prisma from '../db.js';
import axios from 'axios';

const TASK_REWARDS = { FOLLOW: 10, LIKE: 2 };

// Step 1: User starts a task. We get the initial counts.
export const startVerification = async (req, res) => {
    const userId = req.user.id;
    const { campaignId } = req.body;

    try {
        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign) throw new Error('Campaign not found.');

        const user = await prisma.user.findUnique({ where: { id: userId }, include: { tikTokAccount: true } });
        if (!user.tikTokAccount) throw new Error('User not connected to TikTok.');

        let initialCount = 0;
        if (campaign.type === 'LIKE') {
            // For LIKE tasks, we check the video's like count
            const videoId = campaign.targetUrl.match(/\/video\/(\d{18,})/)?.[1];
            if (!videoId) throw new Error('Invalid video URL in campaign.');

            const response = await axios.post(
                'https://open.tiktokapis.com/v2/video/list/?fields=like_count',
                { video_ids: [videoId] },
                { headers: { Authorization: `Bearer ${user.tikTokAccount.accessToken}` } }
            );
            initialCount = response.data.data.videos[0].like_count;
        } else if (campaign.type === 'FOLLOW') {
            // For FOLLOW tasks, we check the user's following count
            const fields = "following_count";
            const response = await axios.get(
                `https://open.tiktokapis.com/v2/user/info/?fields=${fields}`,
                { headers: { Authorization: `Bearer ${user.tikTokAccount.accessToken}` } }
            );
            initialCount = response.data.data.user.following_count;
        }

        // Create a ticket to store the initial state
        const ticket = await prisma.verificationTicket.create({
            data: { userId, campaignId, initialCount }
        });

        res.json({ ticketId: ticket.id });

    } catch (error) {
        console.error("Verification start failed:", error.response?.data || error.message);
        res.status(500).json({ message: "Could not start verification." });
    }
};

// Step 2: User comes back and asks to verify. We check the new counts.
export const submitVerification = async (req, res) => {
    const userId = req.user.id;
    const { ticketId } = req.body;

    try {
        const ticket = await prisma.verificationTicket.findUnique({ where: { id: ticketId } });
        if (!ticket || ticket.userId !== userId) throw new Error('Invalid verification ticket.');

        const campaign = await prisma.campaign.findUnique({ where: { id: ticket.campaignId } });
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { tikTokAccount: true } });

        let newCount = 0;
        if (campaign.type === 'LIKE') {
            const videoId = campaign.targetUrl.match(/\/video\/(\d{18,})/)?.[1];
            const response = await axios.post(
                'https://open.tiktokapis.com/v2/video/list/?fields=like_count',
                { video_ids: [videoId] },
                { headers: { Authorization: `Bearer ${user.tikTokAccount.accessToken}` } }
            );
            newCount = response.data.data.videos[0].like_count;
        } else if (campaign.type === 'FOLLOW') {
            const fields = "following_count";
            const response = await axios.get(
                `https://open.tiktokapis.com/v2/user/info/?fields=${fields}`,
                { headers: { Authorization: `Bearer ${user.tikTokAccount.accessToken}` } }
            );
            newCount = response.data.data.user.following_count;
        }

        // The Verification Check
        if (newCount > ticket.initialCount) {
            // SUCCESS! Award the stars. This is the same logic from taskController.
            const reward = TASK_REWARDS[campaign.type];
            await prisma.$transaction([
                prisma.user.update({ where: { id: userId }, data: { stars: { increment: reward } } }),
                prisma.task.create({ data: { userId, campaignId: campaign.id } }),
                prisma.campaign.update({ where: { id: campaign.id }, data: { currentAmount: { increment: 1 } } }),
            ]);
            // Check if campaign is now complete
            const finalCampaign = await prisma.campaign.findUnique({where: {id: campaign.id}});
            if (finalCampaign.currentAmount >= finalCampaign.totalAmount) {
                await prisma.campaign.update({where: {id: campaign.id}, data: {status: 'COMPLETE'}});
            }
            res.json({ success: true, message: `Verification successful! You earned ${reward} stars.` });
        } else {
            // FAIL
            res.status(400).json({ success: false, message: 'Verification failed. The action was not detected.' });
        }

        // Clean up the used ticket
        await prisma.verificationTicket.delete({ where: { id: ticketId } });

    } catch (error) {
        console.error("Verification submit failed:", error.response?.data || error.message);
        res.status(500).json({ message: "Could not submit verification." });
    }
};