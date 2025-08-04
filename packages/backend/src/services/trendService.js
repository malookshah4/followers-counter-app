import prisma from '../db.js';
import axios from 'axios';

export const analyzeVideosByIds = async (accessToken, videoIds) => {
  console.log(`Starting analysis for ${videoIds.length} video(s)...`);

  if (!videoIds || videoIds.length === 0) {
    return { analyzed: 0 };
  }

  const videoListResponse = await axios.post(
    'https://open.tiktokapis.com/v2/video/list/?fields=id,music_info,hashtag_names',
    { video_ids: videoIds },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const videos = videoListResponse.data.data.videos;
  if (!videos || videos.length === 0) {
    return { analyzed: 0, message: "Could not fetch video data." };
  }

  console.log(`Successfully fetched data for ${videos.length} videos.`);

  for (const video of videos) {
    if (video.music_info) {
      const audio = video.music_info;
      await prisma.audioTrend.upsert({
        where: { id: audio.id.toString() },
        // If the trend exists, increment its count by 1
        update: { count: { increment: 1 }, lastSeen: new Date() },
        // If it's a new trend, create it with a count of 1
        create: {
          id: audio.id.toString(),
          title: audio.title,
          author: audio.artist_name,
          count: 1,
        },
      });
      console.log(`Upserted audio trend: ${audio.title}`);
    }

    if (video.hashtag_names) {
      for (const hashtagName of video.hashtag_names) {
        await prisma.hashtagTrend.upsert({
          where: { name: hashtagName },
          // If the trend exists, increment its count by 1
          update: { count: { increment: 1 }, lastSeen: new Date() },
          // If it's a new trend, create it with a count of 1
          create: {
            id: hashtagName,
            name: hashtagName,
            count: 1,
          },
        });
        console.log(`Upserted hashtag trend: #${hashtagName}`);
      }
    }
  }

  return { analyzed: videos.length, message: `Successfully analyzed and saved trends from ${videos.length} video(s)!` };
};