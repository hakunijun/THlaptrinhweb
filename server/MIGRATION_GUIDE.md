# Migration Guide: SQLite to MySQL

This guide will help you migrate from SQLite to MySQL.

## Step 1: Install MySQL

Make sure MySQL Server is installed and running on your system.

### Windows
- Download MySQL Installer from https://dev.mysql.com/downloads/installer/
- Install MySQL Server
- Start MySQL service

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### macOS
```bash
brew install mysql
brew services start mysql
```

## Step 2: Create MySQL User and Database

1. Log in to MySQL:
```bash
mysql -u root -p
```

2. Create a database user (optional, or use root):
```sql
CREATE USER 'hospital_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON hospital_appointments.* TO 'hospital_user'@'localhost';
FLUSH PRIVILEGES;
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cd server
cp .env.example .env
```

2. Edit `.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_appointments
PORT=3001
```

## Step 4: Initialize MySQL Database

Run the initialization script:
```bash
cd server
npm run init-db
```

This will:
- Create the `hospital_appointments` database
- Create `users` and `appointments` tables
- Set up proper indexes and foreign keys

## Step 5: Migrate Data from SQLite (Optional)

If you have existing data in SQLite that you want to migrate:

1. Export data from SQLite:
```bash
cd server
sqlite3 hospital.db .dump > sqlite_export.sql
```

2. Convert the SQLite export to MySQL format (manual editing may be required):
   - Change `INTEGER PRIMARY KEY AUTOINCREMENT` to `INT AUTO_INCREMENT PRIMARY KEY`
   - Change `TEXT` to `VARCHAR(255)` or appropriate size
   - Change `DATETIME DEFAULT CURRENT_TIMESTAMP` to `DATETIME DEFAULT CURRENT_TIMESTAMP`
   - Remove SQLite-specific syntax

3. Import to MySQL:
```bash
mysql -u root -p hospital_appointments < converted_export.sql
```

## Step 6: Test the Connection

1. Start the server:
```bash
cd server
npm start
```

2. Check the health endpoint:
```bash
curl http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "database": "connected"
}
```

## Step 7: Access via phpMyAdmin

1. Install phpMyAdmin (if not already installed)
2. Access phpMyAdmin at http://localhost/phpmyadmin
3. Log in with your MySQL credentials
4. Select the `hospital_appointments` database
5. You can now view and manage tables through the web interface

## Troubleshooting

### Connection Refused
- Ensure MySQL server is running
- Check `DB_HOST` in `.env` file

### Access Denied
- Verify `DB_USER` and `DB_PASSWORD` are correct
- Check MySQL user privileges

### Database Not Found
- Run `npm run init-db` to create the database

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the service using port 3001

## Differences from SQLite

1. **Data Types**: MySQL uses `INT`, `VARCHAR`, `TEXT` instead of SQLite's `INTEGER`, `TEXT`
2. **Auto Increment**: MySQL uses `AUTO_INCREMENT` instead of `AUTOINCREMENT`
3. **Foreign Keys**: MySQL requires `ENGINE=InnoDB` for foreign key support
4. **Connection**: MySQL uses connection pooling instead of a single file connection
5. **Case Sensitivity**: MySQL table names are case-sensitive on Linux, case-insensitive on Windows

## Next Steps

- Remove SQLite database file: `server/hospital.db` (optional, keep as backup)
- Update any documentation referencing SQLite
- Test all API endpoints to ensure everything works correctly

