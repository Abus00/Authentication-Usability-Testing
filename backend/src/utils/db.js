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
        password TEXT,
        name TEXT,
        lastname TEXT,
        sex TEXT CHECK (sex IN ('male', 'female', 'other')),
        age INTEGER CHECK (age > 0),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const verificationCodesTable = `
      CREATE TABLE IF NOT EXISTS verification_codes (
        email TEXT UNIQUE,
        code INTEGER,
        expires_at DATETIME,
        FOREIGN KEY (email) REFERENCES users(email)
      );
    `;

    db.run(usersTable, (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table is ready.");
      }
    });

    db.run(verificationCodesTable, (err) => {
      if (err) {
        console.error("Error creating verification codes table:", err.message);
      } else {
        console.log("Verification codes table is ready.");
      }
    });
};

createTables();

module.exports = db;