// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'jepr18',
    password: process.env.DB_PASSWORD || '123456789',
    database: process.env.DB_NAME || 'UapaSmartphones',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

// Main route - serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes using stored procedures

// Get all users (assumes stored procedure: sp_get_all_users)
app.post('/api/buscarProductos', async (req, res) => {
    try {
        const { idProducto, nombreModelo, marca } = req.body;
        const [rows] = await pool.query('CALL spBusquedaProductos(?, ?, ?)', [idProducto, nombreModelo, marca]);
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Get user by ID (assumes stored procedure: sp_get_user_by_id)
app.get('/api/buscarTodosLosProductos', async (req, res) => {
    try {
        const [rows] = await pool.query('CALL spBusquedaTodosLosProductos()');
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Create new user (assumes stored procedure: sp_create_user)
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const [result] = await pool.query(
            'CALL sp_create_user(?, ?, ?)',
            [name, email, phone]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result[0]
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// Update user (assumes stored procedure: sp_update_user)
app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, phone } = req.body;
        const [result] = await pool.query(
            'CALL sp_update_user(?, ?, ?, ?)',
            [userId, name, email, phone]
        );

        res.json({
            success: true,
            message: 'User updated successfully',
            data: result[0]
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

// Delete user (assumes stored procedure: sp_delete_user)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await pool.query('CALL sp_delete_user(?)', [userId]);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

// Search users (assumes stored procedure: sp_search_users)
app.get('/api/users/search/:query', async (req, res) => {
    try {
        const searchQuery = req.params.query;
        const [rows] = await pool.query('CALL sp_search_users(?)', [searchQuery]);

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    pool.end()
        .then(() => {
            console.log('Database pool closed');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error closing database pool:', err);
            process.exit(1);
        });
});