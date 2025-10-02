const express = require('express');
const { submitRating, getStoreRatings, getUserRatings } = require('../controllers/ratingController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

router.post('/', authenticateToken, requireRole(['normal']), validateRequest(schemas.rating), submitRating);
router.get('/store/:storeId', authenticateToken, getStoreRatings);
router.get('/user', authenticateToken, getUserRatings);

module.exports = router;
