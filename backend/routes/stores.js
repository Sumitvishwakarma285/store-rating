const express = require('express');
const { getAllStores, createStore, getStoreDetails } = require('../controllers/storeController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

router.get('/', authenticateToken, getAllStores);
router.get('/:id', authenticateToken, getStoreDetails);
router.post('/', authenticateToken, requireRole(['admin']), validateRequest(schemas.store), createStore);

module.exports = router;
