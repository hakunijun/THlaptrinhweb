import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Load environment variables from root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
dotenv.config({ path: join(rootDir, '.env') });

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'hospital_appointments',
  PORT = 3001
} = process.env;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  port: parseInt(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection (non-blocking)
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error connecting to MySQL database:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('⚠️  Database access denied. Please check DB_USER and DB_PASSWORD in .env file');
      console.error('⚠️  Server will start but database operations will fail until MySQL is configured');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('⚠️  Cannot connect to MySQL server. Please ensure MySQL is running');
      console.error('⚠️  Server will start but database operations will fail until MySQL is running');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error(`⚠️  Database '${DB_NAME}' does not exist. Please run: npm run init-db`);
      console.error('⚠️  Server will start but database operations will fail until database is created');
    } else {
      console.error('⚠️  Server will start but database operations may fail');
    }
    // Don't exit - allow server to start so user can see the error
  });

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  let connection;
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    connection = await pool.getConnection();

    // Check if user exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await connection.execute(
      'INSERT INTO users (email, password, fullName, phone) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, fullName, phone]
    );

    // Return user without password
    const [users] = await connection.execute(
      'SELECT id, email, fullName, phone FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

app.post('/api/auth/login', async (req, res) => {
  let connection;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    connection = await pool.getConnection();

    // Find user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Appointments Routes
app.get('/api/appointments/:userId', async (req, res) => {
  let connection;
  try {
    const { userId } = req.params;
    connection = await pool.getConnection();
    
    const [appointments] = await connection.execute(
      'SELECT * FROM appointments WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

app.post('/api/appointments', async (req, res) => {
  let connection;
  try {
    const { userId, patientName, phone, email, specialty, doctor, date, time, symptoms } = req.body;

    if (!userId || !patientName || !phone || !specialty || !date || !time) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    connection = await pool.getConnection();

    const [result] = await connection.execute(
      `INSERT INTO appointments (userId, patientName, phone, email, specialty, doctor, date, time, symptoms, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, patientName, phone, email || null, specialty, doctor || null, date, time, symptoms || null]
    );

    const [appointments] = await connection.execute(
      'SELECT * FROM appointments WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(appointments[0]);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    
    await connection.execute('DELETE FROM appointments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    connection = await pool.getConnection();
    
    await connection.execute('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    
    const [appointments] = await connection.execute(
      'SELECT * FROM appointments WHERE id = ?',
      [id]
    );
    
    res.json(appointments[0]);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.json({ status: 'error', database: 'disconnected', error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await pool.end();
  console.log('Database connection pool closed');
  process.exit(0);
});
