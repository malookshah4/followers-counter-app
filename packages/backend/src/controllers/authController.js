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
  console.log("--- REDIRECTING TO TIKTOK WITH PARAMS:", params.toString());

  res.redirect(`${TIKTOK_AUTH_URL}?${params.toString()}`);
};


// 2. Handle the callback from the frontend after user logs in on TikTok

export const handleTikTokCallback = async (req, res) => {
  // NEW LOG: This will show us that this function has started
  console.log("\n--- [CALLBACK STEP] Received request from frontend after TikTok redirect. ---");

  const { code } = req.query;

  if (!code) {
    console.error("[!!!] CALLBACK FAILED: No 'code' was provided in the URL.");
    return res.status(400).json({ message: 'Authorization code is missing.' });
  }

  try {
    console.log("[CALLBACK STEP] Exchanging code for access token...");
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
    console.log("[CALLBACK STEP] Successfully received token from TikTok.");

    const { access_token, open_id, ...tokenData } = tokenResponse.data;

    // ... The rest of the function is the same ...
    // (fetching user info, saving to database, creating JWT, etc.)

  } catch (error) {
    // NEW, MORE PROMINENT ERROR LOG
    console.error("\n[!!!] CRITICAL ERROR IN CALLBACK CATCH BLOCK [!!!]");
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({ message: 'Authentication failed' });
  }
};