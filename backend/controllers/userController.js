// backend/src/controllers/userController.js
const InstagramAPI = require('../utils/instagramAPI');

exports.postToInstagram = async (req, res) => {
    // In a real app, you would retrieve these from the user's session/DB
    // For this example, we'll assume the frontend passes them along with the post data
    const { igBusinessId, pageAccessToken, mediaUrl, caption } = req.body;

    if (!igBusinessId || !pageAccessToken || !mediaUrl) {
        return res.status(400).send('Missing required data for Instagram post.');
    }

    try {
        // Step 1: Create the media container
        const creationId = await InstagramAPI.createMediaContainer(
            igBusinessId,
            pageAccessToken,
            mediaUrl,
            caption
        );

        // Step 2: Publish the media container
        const mediaId = await InstagramAPI.publishMedia(
            igBusinessId,
            pageAccessToken,
            creationId
        );

        // NOTE: Publishing is asynchronous. The post may take a few moments to appear.
        res.status(200).send({
            message: 'Post successfully queued for publishing to Instagram!',
            instagramMediaId: mediaId,
            creationId: creationId
        });
    } catch (err) {
        console.error('Instagram Post Error:', err.response ? err.response.data : err.message);
        res.status(500).send('Failed to post to Instagram.');
    }
};