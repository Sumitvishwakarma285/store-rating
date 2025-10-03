const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'store_rating_platform',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false,
});

// Set SQL mode after connection instead
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Set SQL mode in the session instead of connection options
        await connection.execute("SET sql_mode = 'TRADITIONAL,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'");
        
        console.log('✅ Database connected successfully');
        console.log(`📊 Connected to: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};


module.exports = { pool, testConnection };
