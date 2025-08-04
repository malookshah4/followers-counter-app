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
    console.log("--- STARTING TIKTOK AUTH DEBUG ---");
    console.log("Received Code:", code);
    console.log("Using Client Key:", process.env.TIKTOK_CLIENT_KEY);
    console.log("Using Client Secret:", process.env.TIKTOK_CLIENT_SECRET);
    console.log("Using Redirect URI for API call:", `${process.env.FRONTEND_URL}/auth/callback`);
    console.log("--- ENDING TIKTOK AUTH DEBUG ---");

    // STEP 1: Exchange the authorization code for an access token from TikTok
    const tokenResponse = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      // The data is the same
      new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.FRONTEND_URL}/auth/callback`,
      }),
      // === THIS IS THE NEW PART WE ARE ADDING ===
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, open_id, ...tokenData } = tokenResponse.data;

    // STEP 2: Use the access token to get the user's profile info from TikTok
    const userResponse = await axios.get(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url_100',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const tikTokUser = userResponse.data.data.user;

    // STEP 3: Save the user to our database (or update if they already exist)
    const userInDb = await prisma.user.upsert({
      where: { id: tikTokUser.open_id },
      update: {
        tikTokAccount: {
          update: {
            accessToken: access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            refreshExpiresIn: tokenData.refresh_expires_in,
          }
        }
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
            refreshExpiresIn: tokenData.refresh_expires_in,
            scope: tokenData.scope
          }
        }
      },
      include: {
        tikTokAccount: true
      }
    });

    // STEP 4: Create a JWT for our application session
    const sessionToken = jwt.sign({ userId: userInDb.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // STEP 5: Send the session token and user profile back to the frontend
    res.json({
      token: sessionToken,
      user: {
        id: userInDb.id,
        username: userInDb.tikTokAccount.username,
        avatarUrl: userInDb.tikTokAccount.avatarUrl
      }
    });

  } catch (error) {
    console.error('Error during TikTok auth:', error.response?.data || error.message);
    res.status(500).json({ message: 'Authentication failed' });
  }
};