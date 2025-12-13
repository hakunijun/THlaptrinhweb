# Hospital Appointment Scheduler

A full-stack web application for managing hospital appointments, built with React, TypeScript, Express.js, and MySQL.

## Features

- User authentication (register/login)
- Appointment booking system
- Appointment management (view, delete, update)
- Doctor information display
- Responsive design
- Vietnamese language support

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: bcrypt for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v5.7 or higher, or MariaDB)
- npm or yarn

## Installation

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure MySQL Database

1. Make sure MySQL server is running
2. Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

3. Edit `server/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_appointments
PORT=3001
```

### 4. Initialize Database

```bash
cd server
npm run init-db
```

This will:
- Create the database if it doesn't exist
- Create the `users` and `appointments` tables

## Running the Application

### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Option 2: Run Both Together

```bash
npm run dev:full
```

## Access the Application

- Frontend: http://localhost:5173 (or the port shown in terminal)
- Backend API: http://localhost:3001
- phpMyAdmin: http://localhost/phpmyadmin (if installed)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Appointments
- `GET /api/appointments/:userId` - Get all appointments for a user
- `POST /api/appointments` - Create a new appointment
- `DELETE /api/appointments/:id` - Delete an appointment
- `PUT /api/appointments/:id` - Update appointment status

### Health Check
- `GET /api/health` - Check server and database status

## Database Schema

### Users Table
- `id` (INT PRIMARY KEY AUTO_INCREMENT)
- `email` (VARCHAR(255) UNIQUE)
- `password` (VARCHAR(255) - hashed)
- `fullName` (VARCHAR(255))
- `phone` (VARCHAR(50))
- `createdAt` (DATETIME)

### Appointments Table
- `id` (INT PRIMARY KEY AUTO_INCREMENT)
- `userId` (INT - Foreign Key)
- `patientName` (VARCHAR(255))
- `phone` (VARCHAR(50))
- `email` (VARCHAR(255) - optional)
- `specialty` (VARCHAR(255))
- `doctor` (VARCHAR(255) - optional)
- `date` (DATE)
- `time` (TIME)
- `symptoms` (TEXT - optional)
- `status` (VARCHAR(50) - default: 'pending')
- `createdAt` (DATETIME)

## Troubleshooting

### Database Connection Issues

1. **Cannot connect to MySQL:**
   - Ensure MySQL server is running
   - Check `DB_HOST`, `DB_USER`, and `DB_PASSWORD` in `.env` file
   - Verify MySQL is accessible: `mysql -u root -p`

2. **Database doesn't exist:**
   - Run `npm run init-db` in the server directory

3. **Access denied:**
   - Verify MySQL user credentials
   - Check if user has CREATE DATABASE privileges

### Port Conflicts
- Frontend default port: 5173 (Vite)
- Backend default port: 3001

Change ports in:
- Frontend: `vite.config.ts`
- Backend: `PORT` in `.env` file

## Security Notes

- Passwords are hashed using bcrypt
- SQL injection protection via parameterized queries
- CORS enabled for frontend-backend communication
- Environment variables for sensitive data

## Building for Production

### Frontend
```bash
npm run build
```

### Backend
The backend server can be run directly with Node.js:
```bash
cd server
node index.js
```
