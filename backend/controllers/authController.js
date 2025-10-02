const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const [users] = await pool.query(`
            SELECT id, name, email, password, role, address, created_at 
            FROM users 
            WHERE email = '${email}'
        `);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.email, user.role);

        // Remove password from response
        const { password: userPassword, ...userWithoutPassword } = user;

        console.log(`User ${user.email} logged in with role: ${user.role}`);

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // Check if user already exists
        const [existingUsers] = await pool.query(`
            SELECT id FROM users WHERE email = '${email}'
        `);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with 'normal' role (only normal users can register)
        const [result] = await pool.query(`
            INSERT INTO users (name, email, password, address, role) 
            VALUES ('${name}', '${email}', '${hashedPassword}', '${address || ''}', 'normal')
        `);

        // Generate token for immediate login
        const token = generateToken(result.insertId, email, 'normal');

        const newUser = {
            id: result.insertId,
            name,
            email,
            role: 'normal',
            address: address || null,
            created_at: new Date()
        };

        console.log(`New user registered: ${email}`);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: newUser
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// ... previous login and register functions

const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // Optionally fetch fresh user data if needed
        const [users] = await pool.query(
            'SELECT id, name, email, role, address, created_at FROM users WHERE id = ?',
            [decoded.userId]
        );
        if (users.length === 0) {
            return res.status(401).json({ message: 'User does not exist' });
        }
        res.json({ user: users[0] });
    } catch (error) {
        console.error('Verify token error:', error);
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

module.exports = { login, register, verifyToken };
