const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database.db");

console.log("Trying to connect to SQLite database for seeding.");
const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("Error connecting to database:", error.message);
    } else {
        console.log("Connected to SQLite database for seeding.");
    }
});

const seedDatabase = async (shouldSeed) => {
    if (!shouldSeed) {
        console.log("Seeding not required. Exiting.");
        return;
    }

    const likertQuestions = [
        "I found the authentication process easy to complete.",
        // "The system's feedback during the authentication was helpful.",
        // "I felt secure while using this authentication method.",
        // "The authentication method was fast and efficient.",
        // "I would recommend this authentication method to others.",
        // "The process was intuitive and easy to understand.",
        // "I trust the system to keep my data secure.",
        // "The authentication method met my expectations."
    ];

    const susQuestions = [
        "I think that I would like to use this system frequently.",
        // "I found the system unnecessarily complex.",
        // "I thought the system was easy to use.",
        // "I think that I would need the support of a technical person to use this system.",
        // "I found the various functions in this system were well integrated.",
        // "I thought there was too much inconsistency in this system.",
        // "I would imagine that most people would learn to use this system very quickly.",
        // "I found the system very cumbersome to use.",
        // "I felt very confident using the system.",
        // "I needed to learn a lot of things before I could get going with this system."
    ];

    const nasaQuestions = [
        "How mentally demanding was the task?",
        // "How physically demanding was the task?",
        // "How hurried or rushed was the pace of the task?",
        // "How successful were you in accomplishing what you were asked to do?",
        // "How hard did you have to work to accomplish your level of performance?",
        // "How insecure, discouraged, irritated, stressed, and annoyed were you?"
    ];

    const insertQuestions = (tableName, questions) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ${tableName} (question_text) VALUES (?)`;
            questions.forEach((question, index) => {
                db.run(query, [question], (err) => {
                    if (err) {
                        reject(err);
                    } else if (index === questions.length - 1) {
                        resolve();
                    }
                });
            });
        });
    };

    db.serialize(async () => {
        db.run("BEGIN TRANSACTION");

        try {
            await insertQuestions("likert_questions", likertQuestions);
            await insertQuestions("sus_questions", susQuestions);
            await insertQuestions("nasa_questions", nasaQuestions);
            db.run("COMMIT", (err) => {
                if (err) {
                    throw err;
                }
                console.log("All questions inserted successfully. Transaction committed.");
            });
        } catch (err) {
            console.error("Error during seeding, rolling back transaction:", err.message);
            db.run("ROLLBACK", (rollbackErr) => {
                if (rollbackErr) {
                    console.error("Error during rollback:", rollbackErr.message);
                } else {
                    console.log("Transaction rolled back successfully.");
                }
            });
        } finally {
            db.close((err) => {
                if (err) {
                    console.error("Error closing the database connection:", err.message);
                } else {
                    console.log("Database connection closed after seeding.");
                }
            });
        }
    });
};

module.exports = seedDatabase;