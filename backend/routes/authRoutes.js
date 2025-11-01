// backend/src/routes/authRoutes.js
const express = require('express');
const { initiateMetaLogin, metaCallback } = require('../controllers/authController');

const router = express.Router();

// 1. Initiate Login: Redirects user to Meta's authorization page
router.get('/meta', initiateMetaLogin);

// 2. Callback: Handles the redirect and exchanges the code for a token
router.get('/meta/callback', metaCallback);

module.exports = router;