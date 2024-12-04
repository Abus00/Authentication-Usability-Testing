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
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
  const query = `
    INSERT INTO verification_codes (email, code, expires_at)
    VALUES (?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      code = excluded.code,
      expires_at = excluded.expires_at;
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
  const query = `
    SELECT * FROM verification_codes
    WHERE email = ? AND code = ? AND expires_at > datetime('now')
  `;
  return new Promise((resolve, reject) => {
    db.get(query, [email, code], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
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