const { pool } = require('../config/database');

const getAllStores = async (req, res) => {
    try {
        console.log('Getting all stores for user:', req.user.userId);
        
        // Step 1: Get all stores (simple query)
        const [stores] = await pool.query('SELECT * FROM stores ORDER BY name ASC');
        console.log(`Found ${stores.length} stores`);
        
        // Step 2: Get rating statistics for each store
        const storesWithRatings = [];
        
        for (const store of stores) {
            try {
                // Get average rating and count
                const [avgRating] = await pool.query(`
                    SELECT 
                        COALESCE(AVG(rating), 0) as average_rating,
                        COUNT(*) as total_ratings
                    FROM ratings 
                    WHERE store_id = ${store.id}
                `);
                
                // Get user's rating for this store
                const [userRating] = await pool.query(`
                    SELECT rating 
                    FROM ratings 
                    WHERE store_id = ${store.id} AND user_id = ${req.user.userId}
                    LIMIT 1
                `);
                
                storesWithRatings.push({
                    ...store,
                    average_rating: parseFloat(avgRating[0]?.average_rating || 0).toFixed(1),
                    total_ratings: avgRating[0]?.total_ratings || 0,
                    user_rating: userRating[0]?.rating || null
                });
            } catch (error) {
                console.error(`Error processing store ${store.id}:`, error);
                // Include store without ratings if there's an error
                storesWithRatings.push({
                    ...store,
                    average_rating: '0.0',
                    total_ratings: 0,
                    user_rating: null
                });
            }
        }
        
        res.json({
            stores: storesWithRatings,
            pagination: {
                current_page: 1,
                total_pages: 1,
                total_stores: storesWithRatings.length,
                per_page: storesWithRatings.length
            }
        });
        
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ 
            message: 'Server error while fetching stores',
            error: error.message 
        });
    }
};

const createStore = async (req, res) => {
    try {
        const { name, email, address } = req.body;
        
        console.log('Creating store:', { name, email, address });
        
        // Check if email already exists
        const [existing] = await pool.query(`
            SELECT id FROM stores WHERE email = '${email}'
        `);
        
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Store with this email already exists' });
        }
        
        // Insert new store
        const [result] = await pool.query(`
            INSERT INTO stores (name, email, address) 
            VALUES ('${name}', '${email}', '${address || ''}')
        `);
        
        console.log('Store created with ID:', result.insertId);
        
        res.status(201).json({
            message: 'Store created successfully',
            store: {
                id: result.insertId,
                name,
                email,
                address: address || ''
            }
        });
    } catch (error) {
        console.error('Create store error:', error);
        res.status(500).json({ 
            message: 'Server error while creating store',
            error: error.message 
        });
    }
};

const getStoreDetails = async (req, res) => {
    try {
        const storeId = req.params.id;
        console.log('Getting store details for ID:', storeId);
        
        const [stores] = await pool.query(`
            SELECT * FROM stores WHERE id = ${storeId}
        `);
        
        if (stores.length === 0) {
            return res.status(404).json({ message: 'Store not found' });
        }
        
        // Get rating statistics
        const [ratingStats] = await pool.query(`
            SELECT 
                COALESCE(AVG(rating), 0) as average_rating,
                COUNT(*) as total_ratings
            FROM ratings 
            WHERE store_id = ${storeId}
        `);
        
        const store = {
            ...stores[0],
            average_rating: parseFloat(ratingStats[0]?.average_rating || 0).toFixed(1),
            total_ratings: ratingStats[0]?.total_ratings || 0
        };
        
        res.json(store);
    } catch (error) {
        console.error('Get store details error:', error);
        res.status(500).json({ 
            message: 'Server error while fetching store details',
            error: error.message 
        });
    }
};

module.exports = { getAllStores, createStore, getStoreDetails };
