// controllers/authController.js
import axios from 'axios';

const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;

// Step 1: Redirect user to Instagram authorization
export const redirectToInstagram = (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
};

// Step 2: Handle Instagram OAuth callback and exchange for access token
export const handleInstagramCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code,
    });

    res.json(tokenRes.data);
  } catch (err) {
    console.error('Instagram Auth Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};
