// Setup database functionality

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database.db");

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("Error connecting to database:", error.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

const createTables = () => {
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        lastname TEXT NOT NULL,
        sex TEXT CHECK (sex IN ('male', 'female', 'other')),
        age INTEGER CHECK (age > 0),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    db.run(usersTable, (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table is ready.");
      }
    });
};


createTables();

module.exports = db;