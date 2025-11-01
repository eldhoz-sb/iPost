// backend/src/controllers/authController.js
const axios = require('axios');
const dotenv = require('dotenv');
const InstagramAPI = require('../utils/instagramAPI'); 
const BASE_GRAPH_URL = 'https://graph.facebook.com/v20.0';
dotenv.config();

const { META_APP_ID, META_APP_SECRET, REDIRECT_URI } = process.env;


// --- New Instagram-Only Login Flow ---

exports.initiateInstagramOnlyLogin = (req, res) => {
    // NOTE: This uses the graph.instagram.com host for authorization
    const scopes = 'instagram_basic,instagram_content_publish'; 
    const authUrl = `https://api.instagram.com/oauth/authorize?` +
        `client_id=${process.env.META_APP_ID}&` + // Uses the same Meta App ID
        `redirect_uri=${process.env.REDIRECT_URI}&` + // Uses the same callback URI
        `scope=${scopes}&` +
        `response_type=code`;

    res.redirect(authUrl);
};


exports.instagramOnlyCallback = async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.status(400).send(`Instagram-Only login failed: ${error}`);
    }

    try {
        // A. Exchange Code for Short-Lived Instagram User Access Token
        // NOTE: This POST request also uses the api.instagram.com host
        const tokenExchangeUrl = `https://api.instagram.com/oauth/access_token`;
        
        const { data: shortTokenData } = await axios.post(tokenExchangeUrl, null, {
            params: {
                client_id: process.env.META_APP_ID,
                client_secret: process.env.META_APP_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: process.env.REDIRECT_URI,
                code: code
            }
        });

        const shortToken = shortTokenData.access_token;
        const igUserId = shortTokenData.user_id;

        // B. Exchange Short-Lived Token for Long-Lived Token (60 days)
        // NOTE: The exchange still happens against the Facebook Graph API host
        const longTokenData = await axios.get(`https://graph.facebook.com/v20.0/access_token?` +
            `grant_type=ig_exchange_token&` +
            `client_secret=${process.env.META_APP_SECRET}&` +
            `access_token=${shortToken}`);
        
        const longToken = longTokenData.data.access_token;

        // C. Fetch final IG User Data
        const igUserDataUrl = `https://graph.instagram.com/v20.0/${igUserId}?fields=id,username&access_token=${longToken}`;
        const { data: igUserData } = await axios.get(igUserDataUrl);
        
        // --- SECURELY SAVE CREDENTIALS ---
        // You now have the longToken and the igUserData.id (which is the igBusinessId)
        // IMPORTANT: In this flow, the longToken IS the token you use for posting
        // and the igUserData.id IS the IG User ID.

        res.send({
            message: 'Instagram-Only Login successful!',
            igUserId: igUserData.id,
            username: igUserData.username,
            longTokenForPosting: longToken // This token is directly tied to the IG user
        });

    } catch (err) {
        console.error('Instagram-Only Callback Error:', err.response ? err.response.data : err.message);
        res.status(500).send('Instagram-Only Authentication failed due to a server error.');
    }
};

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
        // ➡️ NEW STEP: EXPLICITLY FETCH THE USER ID
const userProfileUrl = `${BASE_GRAPH_URL}/me?fields=id&access_token=${shortToken}`;
const { data: userData } = await axios.get(userProfileUrl);
const userID = userData.id;

console.log(`*** Fetched User ID: ${userID} ***`);
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