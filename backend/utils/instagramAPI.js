// backend/src/utils/instagramAPI.js
const axios = require('axios');
const { META_APP_ID, META_APP_SECRET } = process.env;

const BASE_GRAPH_URL = 'https://graph.facebook.com/v20.0';

class InstagramAPI {
    // --- AUTH FLOW HELPER METHODS ---

    static async getLongLivedToken(shortToken) {
        const url = `${BASE_GRAPH_URL}/oauth/access_token?` +
            `grant_type=fb_exchange_token&` +
            `client_id=${META_APP_ID}&` +
            `client_secret=${META_APP_SECRET}&` +
            `fb_exchange_token=${shortToken}`;
        
        const { data } = await axios.get(url);
        return data;
    }

    static async getInstagramAccountAndPageToken(userID, longToken) {
        // 1. Get the list of Facebook Pages the user manages
        const accountsUrl = `${BASE_GRAPH_URL}/${userID}/accounts?access_token=${longToken}`;
        const { data: accountsData } = await axios.get(accountsUrl);

        if (!accountsData.data || accountsData.data.length === 0) {
            throw new Error('User does not manage any Facebook Pages.');
        }

        // We assume the first managed page is the one linked to the IG account
        const page = accountsData.data[0];
        const pageId = page.id;
        const pageAccessToken = page.access_token;

        // 2. Get the Instagram Business Account ID linked to the Page
        const igAccountUrl = `${BASE_GRAPH_URL}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`;
        const { data: igAccountData } = await axios.get(igAccountUrl);

        if (!igAccountData.instagram_business_account) {
            throw new Error('The selected Facebook Page is not linked to an Instagram Business/Creator Account.');
        }

        return {
            pageAccessToken: pageAccessToken,
            igBusinessId: igAccountData.instagram_business_account.id
        };
    }

    // --- INSTAGRAM POSTING METHODS ---

    static async createMediaContainer(igBusinessId, pageAccessToken, mediaUrl, caption) {
        const url = `${BASE_GRAPH_URL}/${igBusinessId}/media`;
        const params = {
            image_url: mediaUrl, // or video_url for videos
            caption: caption,
            access_token: pageAccessToken
        };

        const { data } = await axios.post(url, params);
        return data.id; // Returns the IG Container ID
    }

    static async publishMedia(igBusinessId, pageAccessToken, creationId) {
        const url = `${BASE_GRAPH_URL}/${igBusinessId}/media_publish`;
        const params = {
            creation_id: creationId,
            access_token: pageAccessToken
        };

        const { data } = await axios.post(url, params);
        return data.id; // Returns the final IG Media ID
    }
}

module.exports = InstagramAPI;