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
        email TEXT,
        code INTEGER,
        expires_at DATETIME,
        FOREIGN KEY (email) REFERENCES users(email)
      );
    `;

    // Likert Questions Table
    const likertQuestionsTable = `
      CREATE TABLE IF NOT EXISTS likert_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_text TEXT NOT NULL
      );
    `;

    // Likert Responses Table
    const likertResponsesTable = `
      CREATE TABLE IF NOT EXISTS likert_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        question_id INTEGER NOT NULL,
        response INTEGER CHECK (response BETWEEN 1 AND 5),
        FOREIGN KEY (user_email) REFERENCES users(email),
        FOREIGN KEY (question_id) REFERENCES likert_questions(id)
      );
    `;

    // SUS Questions Table
    const susQuestionsTable = `
      CREATE TABLE IF NOT EXISTS sus_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_text TEXT NOT NULL
      );
    `;

    // SUS Responses Table
    const susResponsesTable = `
      CREATE TABLE IF NOT EXISTS sus_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        question_id INTEGER NOT NULL,
        response INTEGER CHECK (response BETWEEN 1 AND 5),
        FOREIGN KEY (user_email) REFERENCES users(email),
        FOREIGN KEY (question_id) REFERENCES sus_questions(id)
      );
    `;

    // NASA-TLX Questions Table
    const nasaQuestionsTable = `
      CREATE TABLE IF NOT EXISTS nasa_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_text TEXT NOT NULL
      );
    `;

    // NASA-TLX Responses Table
    const nasaResponsesTable = `
      CREATE TABLE IF NOT EXISTS nasa_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        question_id INTEGER NOT NULL,
        response INTEGER CHECK (response BETWEEN 1 AND 100),
        FOREIGN KEY (user_email) REFERENCES users(email),
        FOREIGN KEY (question_id) REFERENCES nasa_questions(id)
      );
    `;

    // Open-Ended Feedback Table
    const feedbackTable = `
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        feedback_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_email) REFERENCES users(email)
      );
    `;

    // Create all tables
    db.serialize(() => {
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

        db.run(likertQuestionsTable, (err) => {
            if (err) {
                console.error("Error creating likert_questions table:", err.message);
            } else {
                console.log("Likert questions table is ready.");
            }
        });

        db.run(likertResponsesTable, (err) => {
            if (err) {
                console.error("Error creating likert_responses table:", err.message);
            } else {
                console.log("Likert responses table is ready.");
            }
        });

        db.run(susQuestionsTable, (err) => {
            if (err) {
                console.error("Error creating sus_questions table:", err.message);
            } else {
                console.log("SUS questions table is ready.");
            }
        });

        db.run(susResponsesTable, (err) => {
            if (err) {
                console.error("Error creating sus_responses table:", err.message);
            } else {
                console.log("SUS responses table is ready.");
            }
        });

        db.run(nasaQuestionsTable, (err) => {
            if (err) {
                console.error("Error creating nasa_questions table:", err.message);
            } else {
                console.log("NASA-TLX questions table is ready.");
            }
        });

        db.run(nasaResponsesTable, (err) => {
            if (err) {
                console.error("Error creating nasa_responses table:", err.message);
            } else {
                console.log("NASA-TLX responses table is ready.");
            }
        });

        db.run(feedbackTable, (err) => {
            if (err) {
                console.error("Error creating feedback table:", err.message);
            } else {
                console.log("Feedback table is ready.");
            }
        });
    });
};

createTables();

module.exports = db;