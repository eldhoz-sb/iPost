// backend/src/controllers/authController.js
const axios = require('axios');
const dotenv = require('dotenv');
const InstagramAPI = require('../utils/instagramAPI'); 

dotenv.config();

const { META_APP_ID, META_APP_SECRET, REDIRECT_URI } = process.env;

// Step 1: Redirect to Meta for authorization
exports.initiateMetaLogin = (req, res) => {
    const scopes = 'instagram_basic,pages_show_list,instagram_content_publish,public_profile'; 
    const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?` +
        `client_id=${META_APP_ID}&` +
        `redirect_uri=${REDIRECT_URI}&` +
        `scope=${scopes}&` +
        `response_type=code`;

    res.redirect(authUrl);
};

// Step 2: Handle the callback
exports.metaCallback = async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.status(400).send(`Meta login failed: ${error}`);
    }

    try {
        // A. Exchange Code for Short-Lived Access Token
        const tokenExchangeUrl = `https://graph.facebook.com/v20.0/oauth/access_token?` +
            `client_id=${META_APP_ID}&` +
            `redirect_uri=${REDIRECT_URI}&` +
            `client_secret=${META_APP_SECRET}&` +
            `code=${code}`;
        
        const { data: shortTokenData } = await axios.get(tokenExchangeUrl);
        const shortToken = shortTokenData.access_token;
        const userID = shortTokenData.user_id;
        console.log('*** RAW SHORT TOKEN DATA FROM META ***', shortTokenData);
        // B. Exchange Short-Lived Token for Long-Lived User Access Token (60 days)
        const longTokenData = await InstagramAPI.getLongLivedToken(shortToken);
        const longToken = longTokenData.access_token;
        console.log('*** RAW LONG TOKEN DATA FROM META ***', longTokenData);

        // C. Get Linked Instagram Account ID and Page Access Token
        const userCredentials = await InstagramAPI.getInstagramAccountAndPageToken(userID, longToken);
        
        // --- SECURELY SAVE CREDENTIALS ---
        // In a real app, you would save userCredentials (userID, longToken, pageAccessToken, igBusinessId)
        // to your database, linked to your user's record. For simplicity, we just display it.
        // For posting, you will need **pageAccessToken** and **igBusinessId**.

        res.send({
            message: 'Login successful! Save these tokens securely.',
            userID: userID,
            longToken: longToken,
            pageAccessToken: userCredentials.pageAccessToken,
            igBusinessId: userCredentials.igBusinessId
        });

    } catch (err) {
        console.error('Meta Callback Error:', err.response ? err.response.data : err.message);
        res.status(500).send('Authentication failed due to a server error.');
    }
};