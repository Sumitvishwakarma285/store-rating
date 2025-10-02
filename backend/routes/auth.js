const express = require('express');
const { login, register, verifyToken } = require('../controllers/authController');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

router.post('/login', login); // All users
router.post('/register', validateRequest(schemas.userRegister), register); // Only for "normal" users
router.get('/verify', verifyToken);

module.exports = router;
