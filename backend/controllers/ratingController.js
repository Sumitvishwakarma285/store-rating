const { pool } = require('../config/database');

const submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.userId;
        
        console.log('Submitting rating:', { userId, storeId, rating });
        
        // Verify store exists
        const [stores] = await pool.query(`SELECT id FROM stores WHERE id = ${storeId}`);
        if (stores.length === 0) {
            return res.status(404).json({ message: 'Store not found' });
        }
        
        // Check if rating already exists
        const [existing] = await pool.query(`
            SELECT id FROM ratings WHERE user_id = ${userId} AND store_id = ${storeId}
        `);
        
        if (existing.length > 0) {
            // Update existing rating
            await pool.query(`
                UPDATE ratings 
                SET rating = ${rating}, updated_at = NOW() 
                WHERE user_id = ${userId} AND store_id = ${storeId}
            `);
            console.log('Rating updated');
            res.json({ message: 'Rating updated successfully', rating });
        } else {
            // Create new rating
            const [result] = await pool.query(`
                INSERT INTO ratings (user_id, store_id, rating) 
                VALUES (${userId}, ${storeId}, ${rating})
            `);
            console.log('New rating created with ID:', result.insertId);
            res.status(201).json({ 
                message: 'Rating submitted successfully', 
                ratingId: result.insertId,
                rating 
            });
        }
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({ 
            message: 'Server error while submitting rating',
            error: error.message 
        });
    }
};

const getStoreRatings = async (req, res) => {
    try {
        const storeId = req.params.storeId;
        console.log('Getting ratings for store:', storeId);
        
        const [ratings] = await pool.query(`
            SELECT u.name, u.email, r.rating, r.created_at, r.updated_at
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ${storeId}
            ORDER BY r.created_at DESC
        `);
        
        console.log(`Found ${ratings.length} ratings for store ${storeId}`);
        
        res.json({
            ratings,
            pagination: {
                current_page: 1,
                total_pages: 1,
                total_ratings: ratings.length,
                per_page: ratings.length
            }
        });
    } catch (error) {
        console.error('Get store ratings error:', error);
        res.status(500).json({ 
            message: 'Server error while fetching store ratings',
            error: error.message 
        });
    }
};

const getUserRatings = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('Getting ratings for user:', userId);
        
        const [ratings] = await pool.query(`
            SELECT 
                s.name as store_name, 
                s.address as store_address,
                r.rating, 
                r.created_at, 
                r.updated_at, 
                r.store_id
            FROM ratings r
            JOIN stores s ON r.store_id = s.id
            WHERE r.user_id = ${userId}
            ORDER BY r.updated_at DESC
        `);
        
        console.log(`Found ${ratings.length} ratings for user ${userId}`);
        
        res.json({
            ratings,
            pagination: {
                current_page: 1,
                total_pages: 1,
                total_ratings: ratings.length,
                per_page: ratings.length
            }
        });
    } catch (error) {
        console.error('Get user ratings error:', error);
        res.status(500).json({ 
            message: 'Server error while fetching user ratings',
            error: error.message 
        });
    }
};

module.exports = { submitRating, getStoreRatings, getUserRatings };
