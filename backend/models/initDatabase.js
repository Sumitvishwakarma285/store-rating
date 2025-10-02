const { pool } = require('../config/database');

const initializeDatabase = async () => {
    try {
        console.log('🔄 Initializing database schema...');

        // Create Users Table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(60) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                address TEXT(400),
                role ENUM('admin', 'normal', 'store_owner') DEFAULT 'normal',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create Stores Table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS stores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(60) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                address TEXT(400),
                owner_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_name (name),
                INDEX idx_owner (owner_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create Ratings Table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS ratings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                store_id INT NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_store (user_id, store_id),
                INDEX idx_store_rating (store_id, rating)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Insert default admin user (password: admin123)
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        
        await pool.execute(`
            INSERT IGNORE INTO users (name, email, password, role, address) 
            VALUES (?, ?, ?, ?, ?)
        `, [
            'System Administrator',
            'admin@platform.com',
            hashedPassword,
            'admin',
            'System Admin Address'
        ]);

        // Insert sample stores
        await pool.execute(`
            INSERT IGNORE INTO stores (name, email, address) VALUES 
            ('Tech Store Plus', 'tech@techstore.com', '123 Technology Street, Tech City'),
            ('Fashion Hub', 'info@fashionhub.com', '456 Fashion Avenue, Style District'),
            ('Food Corner', 'contact@foodcorner.com', '789 Taste Boulevard, Flavor Town')
        `);

        console.log('✅ Database schema initialized successfully');
        console.log('🔑 Default admin: admin@platform.com / admin123');
        
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('🎉 Database initialization complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase };
