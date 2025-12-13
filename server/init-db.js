import mysql from 'mysql2/promise';
import 'dotenv/config';

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'hospital_appointments'
} = process.env;

async function initDatabase() {
  let connection;
  
  try {
    // First, connect without specifying database to create it if needed
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`Database '${DB_NAME}' ready`);

    // Close connection and reconnect to the specific database
    await connection.end();

    // Connect to the specific database
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    console.log(`Connected to database '${DB_NAME}'`);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Users table created/verified');

    // Create appointments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        patientName VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        specialty VARCHAR(255) NOT NULL,
        doctor VARCHAR(255),
        date DATE NOT NULL,
        time TIME NOT NULL,
        symptoms TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Appointments table created/verified');

    console.log('\n✅ Database initialization completed successfully!');
    console.log(`Database: ${DB_NAME}`);
    console.log('Tables: users, appointments');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️  Database access denied. Please check:');
      console.error('   - MySQL server is running');
      console.error('   - DB_USER and DB_PASSWORD in .env file are correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to MySQL server. Please check:');
      console.error('   - MySQL server is running');
      console.error('   - DB_HOST in .env file is correct (default: localhost)');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

initDatabase();
