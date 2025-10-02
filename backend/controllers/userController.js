const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search = '' } = req.query;
        
        let query = 'SELECT id, name, email, role, address, created_at FROM users WHERE 1=1';
        const params = [];
        
        if (role && ['admin', 'normal', 'store_owner'].includes(role)) {
            query += ` AND role = '${role}'`;
        }
        
        if (search) {
            query += ` AND (name LIKE '%${search}%' OR email LIKE '%${search}%')`;
        }
        
        query += ' ORDER BY created_at DESC';
        
        // Add pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;
        
        const [users] = await pool.query(query);
        
        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
        
        if (role && ['admin', 'normal', 'store_owner'].includes(role)) {
            countQuery += ` AND role = '${role}'`;
        }
        
        if (search) {
            countQuery += ` AND (name LIKE '%${search}%' OR email LIKE '%${search}%')`;
        }
        
        const [countResult] = await pool.query(countQuery);
        const totalUsers = countResult[0].total;
        
        res.json({
            users,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalUsers / parseInt(limit)),
                total_users: totalUsers,
                per_page: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        
        // Check if user exists
        const [existingUsers] = await pool.query(`SELECT id FROM users WHERE email = '${email}'`);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Insert user
        const [result] = await pool.query(`
            INSERT INTO users (name, email, password, address, role) 
            VALUES ('${name}', '${email}', '${hashedPassword}', '${address || ''}', '${role}')
        `);
        
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: result.insertId,
                name,
                email,
                role,
                address: address || null
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Server error while creating user' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, address, role } = req.body;
        
        // Check if user exists
        const [existingUsers] = await pool.query(`SELECT id FROM users WHERE id = ${userId}`);
        
        if (existingUsers.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if email is already taken by another user
        const [emailCheck] = await pool.query(`
            SELECT id FROM users WHERE email = '${email}' AND id != ${userId}
        `);
        
        if (emailCheck.length > 0) {
            return res.status(400).json({ message: 'Email is already taken by another user' });
        }
        
        // Update user
        await pool.query(`
            UPDATE users 
            SET name = '${name}', email = '${email}', address = '${address || ''}', role = '${role}'
            WHERE id = ${userId}
        `);
        
        res.json({
            message: 'User updated successfully',
            user: { id: userId, name, email, role, address }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error while updating user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if user exists
        const [existingUsers] = await pool.query(`SELECT id FROM users WHERE id = ${userId}`);
        
        if (existingUsers.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Prevent self-deletion
        if (parseInt(userId) === req.user.userId) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }
        
        // Delete user (ratings will be deleted due to foreign key constraints)
        await pool.query(`DELETE FROM users WHERE id = ${userId}`);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        // Get total users
        const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users');
        
        // Get total stores
        const [storeCount] = await pool.query('SELECT COUNT(*) as total FROM stores');
        
        // Get total ratings
        const [ratingCount] = await pool.query('SELECT COUNT(*) as total FROM ratings');
        
        // Get users by role
        const [roleStats] = await pool.query(`
            SELECT role, COUNT(*) as count 
            FROM users 
            GROUP BY role
        `);
        
        // Get recent ratings
        const [recentRatings] = await pool.query(`
            SELECT u.name as user_name, s.name as store_name, 
                   r.rating, r.created_at
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            ORDER BY r.created_at DESC
            LIMIT 5
        `);
        
        // Get top rated stores
        const [topStores] = await pool.query(`
            SELECT s.name, AVG(r.rating) as average_rating, COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
            HAVING total_ratings > 0
            ORDER BY average_rating DESC
            LIMIT 5
        `);
        
        res.json({
            stats: {
                totalUsers: userCount[0].total,
                totalStores: storeCount[0].total,
                totalRatings: ratingCount[0].total
            },
            roleDistribution: roleStats,
            recentRatings,
            topRatedStores: topStores.map(store => ({
                ...store,
                average_rating: parseFloat(store.average_rating).toFixed(1)
            }))
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error while fetching dashboard stats' });
    }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser, getDashboardStats };
