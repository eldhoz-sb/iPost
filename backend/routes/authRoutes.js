// src/routes/authRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;

// ✅ Webhook verification endpoint for Facebook/Instagram
router.get("/auth/instagram/callback", (req, res) => {
  const VERIFY_TOKEN = "ipost_token123"; // same token you entered in Meta dashboard
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Optional: OAuth redirect (Step 1)
router.get("/auth/instagram", (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

// Optional: Token exchange (Step 2)
router.get("/auth/instagram/token", async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post("https://api.instagram.com/oauth/access_token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
      code,
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
