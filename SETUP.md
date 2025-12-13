# Hospital Appointment Scheduler - Setup Guide

## Project Overview
This is a web-based hospital appointment scheduling system built with React, TypeScript, Vite, Express, and SQLite.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation Steps

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Initialize Database
```bash
cd server
npm run init-db
cd ..
```

This will create a SQLite database file (`hospital.db`) in the `server` directory with the following tables:
- `users` - Stores user accounts
- `appointments` - Stores appointment bookings

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

### Option 2: Run Both Together (if concurrently is installed)
```bash
npm run dev:full
```

## Access the Application
- Frontend: http://localhost:5173 (or the port shown in terminal)
- Backend API: http://localhost:3001

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
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT UNIQUE)
- `password` (TEXT - hashed with bcrypt)
- `fullName` (TEXT)
- `phone` (TEXT)
- `createdAt` (DATETIME)

### Appointments Table
- `id` (INTEGER PRIMARY KEY)
- `userId` (INTEGER - Foreign Key)
- `patientName` (TEXT)
- `phone` (TEXT)
- `email` (TEXT - optional)
- `specialty` (TEXT)
- `doctor` (TEXT - optional)
- `date` (TEXT - ISO format: yyyy-MM-dd)
- `time` (TEXT)
- `symptoms` (TEXT - optional)
- `status` (TEXT - default: 'pending')
- `createdAt` (DATETIME)

## Building for Production

### Frontend
```bash
npm run build
```

The built files will be in the `dist` directory.

### Backend
The backend server can be run directly with Node.js:
```bash
cd server
node index.js
```

## Troubleshooting

### Database Issues
If you encounter database errors:
1. Delete `server/hospital.db` if it exists
2. Run `npm run init-db` again in the server directory

### Port Conflicts
- Frontend default port: 5173 (Vite)
- Backend default port: 3001

If ports are in use, you can:
- Change frontend port: Modify `vite.config.ts` server.port
- Change backend port: Set `PORT` environment variable or modify `server/index.js`

### CORS Issues
CORS is configured in the backend to allow requests from the frontend. If you change ports, make sure to update the CORS configuration in `server/index.js`.

## Features
- User registration and authentication
- Appointment booking system
- Appointment management (view, delete)
- Responsive design
- Vietnamese language support

## Security Notes
- Passwords are hashed using bcrypt
- SQL injection protection via parameterized queries
- CORS enabled for frontend-backend communication

