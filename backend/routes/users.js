const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser, getDashboardStats } = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

router.get('/', authenticateToken, requireRole(['admin']), getAllUsers);
router.post('/', authenticateToken, requireRole(['admin']), validateRequest(schemas.user), createUser);
router.put('/:id', authenticateToken, requireRole(['admin']), updateUser);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteUser);
router.get('/dashboard-stats', authenticateToken, requireRole(['admin']), getDashboardStats);

module.exports = router;
