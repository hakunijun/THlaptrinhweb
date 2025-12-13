import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'hospital.db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database if it doesn't exist
if (!existsSync(dbPath)) {
  console.log('Database not found. Please run: npm run init-db');
}

// Database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Promisify database methods
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await dbRun(
      'INSERT INTO users (email, password, fullName, phone) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, fullName, phone]
    );

    // Return user without password
    const user = await dbGet('SELECT id, email, fullName, phone FROM users WHERE id = ?', [result.id]);

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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
  }
});

// Appointments Routes
app.get('/api/appointments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await dbAll(
      'SELECT * FROM appointments WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { userId, patientName, phone, email, specialty, doctor, date, time, symptoms } = req.body;

    if (!userId || !patientName || !phone || !specialty || !date || !time) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const result = await dbRun(
      `INSERT INTO appointments (userId, patientName, phone, email, specialty, doctor, date, time, symptoms, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, patientName, phone, email || null, specialty, doctor || null, date, time, symptoms || null]
    );

    const appointment = await dbGet('SELECT * FROM appointments WHERE id = ?', [result.id]);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM appointments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (status) {
      await dbRun('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
      const appointment = await dbGet('SELECT * FROM appointments WHERE id = ?', [id]);
      res.json(appointment);
    } else {
      res.status(400).json({ error: 'Status is required' });
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: existsSync(dbPath) ? 'connected' : 'not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

