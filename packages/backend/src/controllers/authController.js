import axios from 'axios';
import jwt from 'jsonwebtoken';
import prisma from '../db.js'; // Make sure you have created db.js

// 1. Redirect user to TikTok's login page
export const redirectToTikTok = (req, res) => {
  const csrfState = Math.random().toString(36).substring(2);
  // In a real app, you would save this csrfState in the user's session
  // or a cookie to verify it on the callback.

  const TIKTOK_AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/';

  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
     scope: 'user.info.basic,user.info.profile,user.info.stats,video.list',
    response_type: 'code',
    redirect_uri: `${process.env.FRONTEND_URL}/auth/callback`,
    state: csrfState,
  });

  // Redirect the user's browser to the TikTok authorization page
  res.redirect(`${TIKTOK_AUTH_URL}?${params.toString()}`);
};


// 2. Handle the callback from the frontend after user logs in on TikTok

export const handleTikTokCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is missing.' });
  }

  try {
    // ... (The console.log debug block can be removed now if you wish)

    const tokenResponse = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.FRONTEND_URL}/auth/callback`,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, open_id, ...tokenData } = tokenResponse.data;

    const userResponse = await axios.get(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url_100',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const tikTokUser = userResponse.data.data.user;

    const userInDb = await prisma.user.upsert({
      where: { id: tikTokUser.open_id },
      update: {
        tikTokAccount: {
          update: {
            accessToken: access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            // The 'refreshExpiresIn' field that caused the error is now removed
          },
        },
      },
      create: {
        id: tikTokUser.open_id,
        tikTokAccount: {
          create: {
            id: tikTokUser.open_id,
            username: tikTokUser.display_name,
            avatarUrl: tikTokUser.avatar_url_100,
            accessToken: access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            scope: tokenData.scope,
            // The 'refreshExpiresIn' field that caused the error is now removed
          },
        },
      },
      include: {
        tikTokAccount: true,
      },
    });

    const sessionToken = jwt.sign({ userId: userInDb.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // In our new app, we need to send back the user's star balance as well
    res.json({
      token: sessionToken,
      user: {
        profile: {
          id: userInDb.id,
          username: userInDb.tikTokAccount.username,
          avatarUrl: userInDb.tikTokAccount.avatarUrl,
        },
        stars: userInDb.stars
      },
    });

  } catch (error) {
    console.error('Error during TikTok auth:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};