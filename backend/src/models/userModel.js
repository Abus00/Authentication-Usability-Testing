const db = require("../utils/db");

const findByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const create = async ({ email, password }) => {
  const query = `
    INSERT INTO users (email, password)
    VALUES (?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(query, [email, password], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, email, password });
      }
    });
  });
};

const update = async (user) => {
  const query = `
    UPDATE users
    SET name = ?, lastname = ?, sex = ?, age = ?
    WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [user.name, user.lastname, user.sex, user.age, user.email], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

const createEmailOnly = async (email) => {
  const query = `
    INSERT INTO users (email)
    VALUES (?)`;
  return new Promise((resolve, reject) => {
    db.run(query, [email], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, email });
      }
    });
  });
};

const updateVerificationCode = async (email, code) => {
  const expiresAt = Date.now() + 15 * 60 * 1000; 
  console.log(`Storing verification code: ${code} for email: ${email} with expiration: ${new Date(expiresAt).toISOString()}`);
  const query = `
    INSERT INTO verification_codes (email, code, expires_at)
    VALUES (?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.run(query, [email, code, expiresAt], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ email, code, expiresAt });
      }
    });
  });
};

const verifyCode = async (email, code) => {
  console.log(`Verifying code: ${code} for email: ${email}`);

  const query = `
    SELECT * FROM verification_codes
    WHERE email = ? AND code = ?
  `;
  console.log(`Executing query: ${query} with email: ${email} and code: ${code}`);
  return new Promise((resolve, reject) => {
    db.get(query, [email, code], (err, row) => {
      if (err) {
        console.log("Error verifying code: ", err);
        reject(err);
      } else {
        if (row) {
          const currentTime = Date.now();
          const expirationTime = parseInt(row.expires_at, 10); 
          console.log(`Retrieved verification code: ${row.code} for email: ${email} with expiration: ${new Date(expirationTime).toISOString()}`);
          if (currentTime <= expirationTime) {
            console.log(`Verification code for email: ${email} is valid`);
            resolve(row);
          } else {
            console.log(`Verification code for email: ${email} has expired`);
            resolve(null);
          }
        } else {
          console.log(`No valid verification code found for email: ${email}`);
          resolve(null);
        }
      }
    });
  });
};

module.exports = {
  findByEmail,
  create,
  update,
  createEmailOnly,
  updateVerificationCode,
  verifyCode,
};