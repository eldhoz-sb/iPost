// ... in routes/userRoutes.js
// Assuming this is a new file or you extend it
const { postToInstagram } = require('../controllers/userController');
// Add to your router export
router.post('/post/instagram', postToInstagram);