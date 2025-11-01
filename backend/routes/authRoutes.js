// routes/authRoutes.js
import express from 'express';
import { redirectToInstagram, handleInstagramCallback } from '../controllers/authController.js';

const router = express.Router();

router.get('/auth/instagram', redirectToInstagram);
router.get('/auth/instagram/callback', handleInstagramCallback);

export default router;
